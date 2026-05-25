import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { assertExpectedToolCall } from "../src/assertions.ts";
import { INIT_TEMPLATES, initScenario, starterScenario } from "../src/init.ts";
import { formatJsonReport } from "../src/reportJson.ts";
import { formatMarkdownRunReport } from "../src/reportMarkdown.ts";
import { parseScenario } from "../src/scenario.ts";

test("parses the explicit v0 scenario shape", () => {
  const scenario = parseScenario(`
id: refund_request
agent: support

locales:
  en:
    input: "I was charged twice."
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason: duplicate_charge
      noToolCall:
        name: escalate_to_human
`);

  assert.equal(scenario.id, "refund_request");
  assert.equal(scenario.agent, "support");
  assert.equal(scenario.locales.en.input, "I was charged twice.");
  const tc = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc) && tc !== undefined);
  assert.equal(tc.name, "create_refund_ticket");
  assert.deepEqual(tc.arguments, { reason: "duplicate_charge" });
  assert.equal(
    scenario.locales.en.expect.noToolCall?.name,
    "escalate_to_human",
  );
});

test("fails when the expected tool call is missing", () => {
  const result = assertExpectedToolCall(
    { toolCall: { name: "create_refund_ticket" } },
    { text: "I can help.", toolCalls: [], structured: null },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "no_tool_call",
    detail: "expected create_refund_ticket, got no tool calls",
  });
});

test("fails when an expected tool call argument is missing", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: "duplicate_charge" },
      },
    },
    {
      text: "I can help.",
      toolCalls: [{ name: "create_refund_ticket", arguments: {} }],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "missing_argument",
    detail: "expected argument reason=duplicate_charge, got missing",
  });
});

test("fails when a forbidden tool call appears", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      noToolCall: { name: "escalate_to_human" },
    },
    {
      text: "I need a person.",
      toolCalls: [
        { name: "create_refund_ticket" },
        { name: "escalate_to_human" },
      ],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "forbidden_tool",
    detail: "forbidden tool call escalate_to_human was called",
  });
});

test("passes when a forbidden tool call is absent", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      noToolCall: { name: "escalate_to_human" },
    },
    {
      text: "I can help.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "create_refund_ticket",
  });
});

test("fails when an expected tool call argument has the wrong value", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: "duplicate_charge" },
      },
    },
    {
      text: "I can help.",
      toolCalls: [
        { name: "create_refund_ticket", arguments: { reason: "other" } },
      ],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_argument",
    detail: "expected argument reason=duplicate_charge, got other",
  });
});

test("passes when expected tool call arguments match", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: {
        name: "create_refund_ticket",
        arguments: { reason: "duplicate_charge" },
      },
    },
    {
      text: "I can help.",
      toolCalls: [
        {
          name: "create_refund_ticket",
          arguments: { reason: "duplicate_charge", locale: "en" },
        },
      ],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "create_refund_ticket",
  });
});

test("passes when the expected tool call appears", () => {
  const result = assertExpectedToolCall(
    { toolCall: { name: "create_refund_ticket" } },
    {
      text: "I can help.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );

  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "create_refund_ticket",
  });
});

test("anyOf passes when the first option matches", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "", toolCalls: [{ name: "check_availability" }], structured: null },
  );
  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "check_availability",
  });
});

test("anyOf passes when the second option matches", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [{ name: "book_new_appointment" }],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "book_new_appointment",
  });
});

test("anyOf fails when no option matches", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "", toolCalls: [{ name: "cancel_order" }], structured: null },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_tool",
    detail:
      "expected one of [check_availability | book_new_appointment], got cancel_order",
  });
});

test("anyOf fails with no_tool_call when no tools called", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "Let me look into that.", toolCalls: [], structured: null },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "no_tool_call",
    detail:
      "expected one of [check_availability | book_new_appointment], got no tool calls",
  });
});

test("toolCalls sequence passes when all steps appear in order", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "check_availability → book_new_appointment",
  });
});

test("toolCalls sequence passes with extra tool calls between steps", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [
        { name: "check_availability" },
        { name: "get_user_preferences" },
        { name: "book_new_appointment" },
      ],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
});

test("toolCalls sequence fails when a step is missing", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    { text: "", toolCalls: [{ name: "check_availability" }], structured: null },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_sequence",
    detail: "sequence incomplete, missing: book_new_appointment",
  });
});

test("toolCalls sequence fails when steps are out of order", () => {
  const result = assertExpectedToolCall(
    {
      toolCalls: [
        { name: "check_availability" },
        { name: "book_new_appointment" },
      ],
    },
    {
      text: "",
      toolCalls: [
        { name: "book_new_appointment" },
        { name: "check_availability" },
      ],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_sequence",
    detail: "sequence incomplete, missing: book_new_appointment",
  });
});

test("responseLanguage passes when Japanese text is in ja locale", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ja",
    },
    {
      text: "払い戻しの手続きを開始します。",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
  assert.equal(result.failureMode, null);
});

test("responseLanguage fails when English text is expected to be Japanese", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ja",
    },
    {
      text: "I will start the refund process for you.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_language",
    detail: "expected ja script in response, got mostly other script",
  });
});

test("responseLanguage passes when Latin-script response matches en locale", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "en",
    },
    {
      text: "I will process your refund now.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
  assert.equal(result.failureMode, null);
});

test("responseLanguage fails when Japanese text is expected to be English", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "en",
    },
    {
      text: "払い戻しの手続きを開始します。",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "wrong_language",
    detail: "expected Latin-script response (en), got mostly non-Latin characters",
  });
});

test("responseLanguage passes when Arabic text matches ar locale", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ar",
    },
    {
      text: "سأبدأ عملية استرداد الأموال الآن.",
      toolCalls: [{ name: "create_refund_ticket" }],
      structured: null,
    },
  );
  assert.equal(result.pass, true);
  assert.equal(result.failureMode, null);
});

test("responseLanguage can be the sole assertion", () => {
  const result = assertExpectedToolCall(
    { responseLanguage: "ru" },
    {
      text: "Я обработаю ваш возврат.",
      toolCalls: [],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: true,
    failureMode: null,
    detail: "responseLanguage: ru",
  });
});

test("responseLanguage tool call failure surfaces before language check", () => {
  const result = assertExpectedToolCall(
    {
      toolCall: { name: "create_refund_ticket" },
      responseLanguage: "ja",
    },
    {
      text: "払い戻しの手続きを開始します。",
      toolCalls: [],
      structured: null,
    },
  );
  assert.deepEqual(result, {
    pass: false,
    failureMode: "no_tool_call",
    detail: "expected create_refund_ticket, got no tool calls",
  });
});

test("parses responseLanguage from YAML", () => {
  const scenario = parseScenario(`
id: multilingual_response
agent: support

locales:
  ja:
    input: 払い戻しを申請したいです
    expect:
      toolCall:
        name: create_refund_ticket
      responseLanguage: ja
`);
  assert.equal(scenario.locales.ja.expect.responseLanguage, "ja");
});

test("parses responseLanguage as sole assertion from YAML", () => {
  const scenario = parseScenario(`
id: language_check_only
agent: support

locales:
  en:
    input: Hello
    expect:
      responseLanguage: en
`);
  assert.equal(scenario.locales.en.expect.responseLanguage, "en");
  assert.equal(scenario.locales.en.expect.toolCall, undefined);
});

test("parses anyOf from YAML and asserts correctly", () => {
  const scenario = parseScenario(`
id: booking
agent: scheduling

locales:
  en:
    input: Book me a slot
    expect:
      toolCall:
        anyOf:
          - name: check_availability
          - name: book_new_appointment
            arguments:
              slot: morning
`);
  const tc = scenario.locales.en.expect.toolCall;
  assert.ok(Array.isArray(tc));
  assert.equal(tc.length, 2);
  assert.equal(tc[0].name, "check_availability");
  assert.equal(tc[1].name, "book_new_appointment");
  assert.deepEqual(tc[1].arguments, { slot: "morning" });
});

test("parses toolCalls sequence from YAML and asserts correctly", () => {
  const scenario = parseScenario(`
id: booking_flow
agent: scheduling

locales:
  en:
    input: Check and then book for me
    expect:
      toolCalls:
        - name: check_availability
        - name: book_new_appointment
          arguments:
            slot: morning
`);
  const tcs = scenario.locales.en.expect.toolCalls;
  assert.ok(Array.isArray(tcs));
  assert.equal(tcs?.length, 2);
  assert.equal(tcs?.[0].name, "check_availability");
  assert.equal(tcs?.[1].name, "book_new_appointment");
  assert.deepEqual(tcs?.[1].arguments, { slot: "morning" });
});

test("starter scenario generated by init is parseable", () => {
  const scenario = parseScenario(starterScenario("support"));

  assert.equal(scenario.id, "refund_request");
  assert.equal(scenario.agent, "support");
  assert.deepEqual(Object.keys(scenario.locales), ["en", "fr"]);
  const tc2 = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc2) && tc2 !== undefined);
  assert.equal(tc2.name, "create_refund_ticket");
});

test("all init templates generate parseable scenarios", () => {
  const expectedAgents = {
    support: "support",
    ecommerce: "ecommerce",
    scheduling: "scheduling",
    generic: "generic",
  };

  for (const template of INIT_TEMPLATES) {
    const scenario = parseScenario(starterScenario(template));

    assert.equal(scenario.agent, expectedAgents[template]);
    assert.deepEqual(Object.keys(scenario.locales), ["en", "fr"]);
  }
});

test("init writes the requested template", async () => {
  const dir = await mkdtemp(join(tmpdir(), "langdrift-init-"));
  const path = join(dir, "scenario.yaml");

  await initScenario(path, "ecommerce");

  const scenario = parseScenario(await readFile(path, "utf8"));
  assert.equal(scenario.id, "cancel_order_request");
  assert.equal(scenario.agent, "ecommerce");
  const tc3 = scenario.locales.en.expect.toolCall;
  assert.ok(!Array.isArray(tc3) && tc3 !== undefined);
  assert.equal(tc3.name, "cancel_order");
});

test("formats a stable JSON run report with iteration counts", () => {
  const report = formatJsonReport({
    scenarioId: "refund_request",
    target: "http://127.0.0.1:3010/api/agent",
    iterations: 3,
    results: [
      {
        locale: "en",
        status: "pass",
        passed: 3,
        failed: 0,
        total: 3,
        failureMode: null,
        detail: "create_refund_ticket",
      },
      {
        locale: "fr",
        status: "fail",
        passed: 1,
        failed: 2,
        total: 3,
        failureMode: "no_tool_call",
        detail: "expected create_refund_ticket, got no tool calls",
      },
    ],
  });

  const parsed = JSON.parse(report) as {
    schemaVersion: number;
    status: string;
    iterations: number;
    summary: {
      locales: number;
      passedLocales: number;
      failedLocales: number;
      totalRuns: number;
      totalPassed: number;
    };
    results: Array<{
      locale: string;
      status: string;
      passed: number;
      failed: number;
      total: number;
    }>;
  };

  assert.equal(parsed.schemaVersion, 2);
  assert.equal(parsed.status, "failed");
  assert.equal(parsed.iterations, 3);
  assert.deepEqual(parsed.summary, {
    locales: 2,
    passedLocales: 1,
    failedLocales: 1,
    totalRuns: 6,
    totalPassed: 4,
  });
  assert.deepEqual(
    parsed.results.map((r) => [r.locale, r.status, r.passed, r.total]),
    [
      ["en", "pass", 3, 3],
      ["fr", "fail", 1, 3],
    ],
  );
});

test("JSON report strips response from results", () => {
  const report = formatJsonReport({
    scenarioId: "refund_request",
    target: "http://127.0.0.1:3010/api/agent",
    iterations: 1,
    results: [
      {
        locale: "en",
        status: "pass",
        passed: 1,
        failed: 0,
        total: 1,
        failureMode: null,
        detail: "create_refund_ticket",
        response: { text: "done", toolCalls: [], structured: null },
      },
    ],
  });

  const parsed = JSON.parse(report) as {
    results: Array<{ response?: unknown }>;
  };
  assert.equal(parsed.results[0].response, undefined);
});

test("markdown run report includes pass rates and scenario id", () => {
  const report = formatMarkdownRunReport({
    scenarioId: "refund_request",
    target: "http://127.0.0.1:3010/api/agent",
    iterations: 5,
    results: [
      {
        locale: "en",
        status: "pass",
        passed: 5,
        failed: 0,
        total: 5,
        failureMode: null,
        detail: "create_refund_ticket",
      },
      {
        locale: "fr",
        status: "fail",
        passed: 3,
        failed: 2,
        total: 5,
        failureMode: "no_tool_call",
        detail: "expected create_refund_ticket, got no tool calls",
      },
    ],
  });

  assert.ok(report.includes("refund_request"));
  assert.ok(report.includes("5/5"));
  assert.ok(report.includes("3/5"));
  assert.ok(report.includes("no_tool_call"));
  assert.ok(report.startsWith("# LangDrift Run"));
});
