import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { executeHttpTarget } from "../src/httpTarget.ts";
import { resolveScenarioPaths, runScenario } from "../src/runner.ts";
import { lintScenarios } from "../src/lint.ts";
import { serializeExpect } from "../src/translate.ts";
import { parseScenario } from "../src/scenario.ts";
import { formatMarkdownRunReport } from "../src/reportMarkdown.ts";
import { wilsonInterval } from "../src/stats.ts";
import type { Scenario } from "../src/types.ts";

// Spins up a one-off HTTP server that returns whatever the handler decides, so
// the transport half of the product (httpTarget, runner) is tested for real.
async function withServer(
  handler: (body: unknown) => { status: number; json: unknown },
  run: (url: string) => Promise<void>,
): Promise<void> {
  const server: Server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      let body: unknown = null;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        body = null;
      }
      const { status, json } = handler(body);
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(json));
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}/`);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

const baseInput = {
  scenarioId: "s",
  locale: "en",
  input: "hi",
  agent: "support",
};

test("httpTarget normalizes a well-formed response", async () => {
  await withServer(
    () => ({
      status: 200,
      json: { text: "ok", toolCalls: [{ name: "t", arguments: { a: 1 } }] },
    }),
    async (url) => {
      const result = await executeHttpTarget({ ...baseInput, target: url });
      assert.ok(result.ok);
      assert.equal(result.response.text, "ok");
      assert.deepEqual(result.response.toolCalls, [
        { name: "t", arguments: { a: 1 } },
      ]);
    },
  );
});

test("httpTarget sends the agent field in the POST body", async () => {
  const received: Record<string, unknown>[] = [];
  await withServer(
    (body) => {
      received.push(body as Record<string, unknown>);
      return { status: 200, json: { text: "", toolCalls: [] } };
    },
    async (url) => {
      await executeHttpTarget({ ...baseInput, target: url });
    },
  );
  assert.equal(received[0].agent, "support");
});

test("httpTarget reports a non-object body as malformed", async () => {
  await withServer(
    () => ({ status: 200, json: "ok" }),
    async (url) => {
      const result = await executeHttpTarget({ ...baseInput, target: url });
      assert.equal(result.ok, false);
      if (!result.ok) assert.match(result.detail, /malformed response/);
    },
  );
});

test("httpTarget reports a non-array toolCalls as malformed", async () => {
  await withServer(
    () => ({ status: 200, json: { toolCalls: "create_refund" } }),
    async (url) => {
      const result = await executeHttpTarget({ ...baseInput, target: url });
      assert.equal(result.ok, false);
      if (!result.ok) assert.match(result.detail, /toolCalls/);
    },
  );
});

test("httpTarget surfaces a non-2xx status", async () => {
  await withServer(
    () => ({ status: 500, json: { error: "boom" } }),
    async (url) => {
      const result = await executeHttpTarget({ ...baseInput, target: url });
      assert.equal(result.ok, false);
      if (!result.ok) assert.match(result.detail, /HTTP 500.*boom/);
    },
  );
});

test("runner classifies transport failure as target_error, not no_tool_call", async () => {
  const scenario: Scenario = {
    id: "s",
    agent: "support",
    locales: {
      en: { input: "hi", expect: { toolCall: { name: "t" } } },
    },
  };
  // Nothing is listening on this port.
  const run = await runScenario(scenario, "http://127.0.0.1:1/", 1, 200);
  assert.equal(run.results[0].failureMode, "target_error");
});

test("runner aggregation: first failure is the representative", async () => {
  const scenario: Scenario = {
    id: "s",
    agent: "support",
    locales: {
      en: { input: "hi", expect: { toolCall: { name: "wanted" } } },
    },
  };
  await withServer(
    () => ({ status: 200, json: { text: "", toolCalls: [] } }),
    async (url) => {
      const run = await runScenario(scenario, url, 3);
      const r = run.results[0];
      assert.equal(r.status, "fail");
      assert.equal(r.passed, 0);
      assert.equal(r.total, 3);
      assert.equal(r.failureMode, "no_tool_call");
    },
  );
});

test("resolveScenarioPaths flags a directory and sorts yaml files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "langdrift-"));
  try {
    await writeFile(join(dir, "b.yaml"), "");
    await writeFile(join(dir, "a.yaml"), "");
    await writeFile(join(dir, "note.txt"), "");
    const resolved = await resolveScenarioPaths(dir);
    assert.equal(resolved.isDirectory, true);
    assert.deepEqual(
      resolved.paths.map((p) => p.split("/").pop()),
      ["a.yaml", "b.yaml"],
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("resolveScenarioPaths flags a single file as not a directory", async () => {
  const dir = await mkdtemp(join(tmpdir(), "langdrift-"));
  try {
    const file = join(dir, "one.yaml");
    await writeFile(file, "");
    const resolved = await resolveScenarioPaths(file);
    assert.equal(resolved.isDirectory, false);
    assert.deepEqual(resolved.paths, [file]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

const SCENARIO_SRC = `id: refund
agent: support
locales:
  en:
    input: "hi"
    expect:
      toolCall:
        name: create_refund
      responseLanguage: en
`;

test("lint warns on single locale and missing en", async () => {
  const dir = await mkdtemp(join(tmpdir(), "langdrift-"));
  try {
    const file = join(dir, "s.yaml");
    await writeFile(
      file,
      `id: s\nagent: support\nlocales:\n  fr:\n    input: "salut"\n    expect:\n      toolCall:\n        name: t\n`,
    );
    const [result] = await lintScenarios([file]);
    const messages = result.issues.map((i) => i.message).join("\n");
    assert.match(messages, /only 1 locale/);
    assert.match(messages, /no "en" locale/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("lint errors on duplicate scenario ids across files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "langdrift-"));
  try {
    const a = join(dir, "a.yaml");
    const b = join(dir, "b.yaml");
    await writeFile(a, SCENARIO_SRC);
    await writeFile(b, SCENARIO_SRC);
    const results = await lintScenarios([a, b]);
    const errors = results.flatMap((r) =>
      r.issues.filter((i) => i.severity === "error"),
    );
    assert.ok(
      errors.some((e) => /duplicate scenario id "refund"/.test(e.message)),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("lint warns when responseLanguage is not script-determinable", async () => {
  const dir = await mkdtemp(join(tmpdir(), "langdrift-"));
  try {
    const file = join(dir, "s.yaml");
    await writeFile(
      file,
      `id: s\nagent: support\nlocales:\n  en:\n    input: "hi"\n    expect:\n      responseLanguage: tlh\n`,
    );
    const [result] = await lintScenarios([file]);
    assert.ok(
      result.issues.some((i) => /not script-determinable/.test(i.message)),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("serializeExpect round-trips oneOf, noToolCall anyOf, and responseLanguage", () => {
  const src = `id: s
agent: support
locales:
  en:
    input: "hi"
    expect:
      toolCall:
        name: create_refund
        arguments:
          reason:
            oneOf: [duplicate_charge, double_charge]
      noToolCall:
        anyOf: [escalate, contact_seller]
      responseLanguage: en
`;
  const scenario = parseScenario(src);
  const lines = serializeExpect(scenario.locales.en, "fr");
  const yaml = [
    "id: s2",
    "agent: support",
    "locales:",
    "  fr:",
    '    input: "salut"',
    "    expect:",
    ...lines.map((l) => `    ${l}`),
  ].join("\n");

  const reparsed = parseScenario(yaml);
  const expect = reparsed.locales.fr.expect;
  assert.ok(!Array.isArray(expect.toolCall) && expect.toolCall);
  assert.deepEqual(expect.toolCall.arguments, {
    reason: { oneOf: ["duplicate_charge", "double_charge"] },
  });
  assert.deepEqual(expect.noToolCall?.names, ["escalate", "contact_seller"]);
  // responseLanguage is rewritten to the target locale.
  assert.equal(expect.responseLanguage, "fr");
});

test("markdown run report escapes pipes and includes a detail column", () => {
  const report = formatMarkdownRunReport({
    scenarioId: "a|b",
    target: "http://x/",
    iterations: 1,
    results: [
      {
        locale: "en",
        status: "fail",
        passed: 0,
        failed: 1,
        total: 1,
        failureMode: "wrong_argument",
        detail: "expected a|b, got c",
      },
    ],
  });
  assert.match(report, /Detail/);
  assert.match(report, /a\\\|b/);
  assert.match(report, /expected a\\\|b, got c/);
});

test("wilsonInterval matches reference values", () => {
  assert.equal(wilsonInterval(0, 0), null);
  const ci7 = wilsonInterval(7, 10);
  assert.ok(ci7);
  assert.ok(Math.abs(ci7[0] - 0.397) < 0.005);
  assert.ok(Math.abs(ci7[1] - 0.892) < 0.005);
  const ci0 = wilsonInterval(0, 10);
  assert.ok(ci0);
  assert.equal(ci0[0], 0);
  assert.ok(Math.abs(ci0[1] - 0.278) < 0.005);
});
