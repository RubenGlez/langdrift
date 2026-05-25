#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import { writeFile } from "node:fs/promises";
import { basename } from "node:path";

const scenarioPath = process.env.SCENARIO ?? "./examples/scenarios/support-routing.yaml";
const domain = process.env.DOMAIN ?? "support";
const provider = process.env.MODEL_PROVIDER ?? "openai-compat";
const modelName = process.env.MODEL_NAME ?? "gpt-4o-mini";
const iterations = Number.parseInt(process.env.ITERATIONS ?? "3", 10);
const port = 3010;
const target = `http://127.0.0.1:${port}/api/agent`;

const apiKey =
  process.env.MODEL_API_KEY ??
  process.env.OPENAI_API_KEY ??
  process.env.ANTHROPIC_API_KEY ??
  process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
  console.error("No API key found. Set MODEL_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, or DEEPSEEK_API_KEY.");
  process.exit(1);
}

const server = spawn(process.execPath, ["./examples/agent/server.ts"], {
  env: {
    ...process.env,
    PORT: String(port),
    DOMAIN: domain,
    MODEL_PROVIDER: provider,
    MODEL_NAME: modelName,
    MODEL_API_KEY: apiKey,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

try {
  await waitForServer();

  const runs: BenchmarkRun[] = [];

  for (let i = 0; i < iterations; i += 1) {
    const startedAt = performance.now();
    const run = await runLangDrift();
    const durationMs = Math.round(performance.now() - startedAt);
    runs.push({ iteration: i + 1, durationMs, exitCode: run.exitCode, output: run.output, summary: parseOutput(run.output) });
  }

  const report = renderReport(runs);
  const slug = basename(scenarioPath).replace(/\.yaml$/, "");
  const outPath = `./examples/benchmark/results/${slug}.md`;
  await writeFile(outPath, report);
  process.stdout.write(report);
  console.error(`\nResults written to ${outPath}`);
} finally {
  server.kill("SIGINT");
  await Promise.race([
    once(server, "exit"),
    new Promise<void>((resolve) => setTimeout(resolve, 3000)),
  ]);
  if (!server.killed) server.kill("SIGKILL");
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (serverOutput.includes("LangDrift agent listening")) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Agent server did not start.\n${serverOutput}`);
}

async function runLangDrift(): Promise<{ exitCode: number; output: string }> {
  const child = spawn(
    process.execPath,
    ["./src/cli.ts", "run", scenarioPath, "--target", target],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk.toString(); });
  child.stderr.on("data", (chunk) => { output += chunk.toString(); });

  const [exitCode] = (await once(child, "close")) as [number];
  return { exitCode, output };
}

function parseOutput(output: string): Record<string, LocaleSummary> {
  const summary: Record<string, LocaleSummary> = {};

  for (const line of output.split("\n")) {
    const match = line.match(/^([a-z]{2,5})\s+(\d+)\/(\d+)\s+(\S+)\s+(.*)/);
    if (match) {
      const passed = Number(match[2]);
      const total = Number(match[3]);
      const status = passed === total ? "pass" : "fail";
      const failureMode = match[4] === "-" ? null : match[4];
      summary[match[1]] = { status, failureMode, detail: match[5] ?? "" };
    }
  }

  return summary;
}

function renderReport(runs: BenchmarkRun[]): string {
  const localeSet = new Set<string>();
  for (const run of runs) {
    for (const locale of Object.keys(run.summary)) localeSet.add(locale);
  }
  const locales = Array.from(localeSet);

  const failureModes = ["no_tool_call", "wrong_tool", "wrong_argument", "missing_argument", "forbidden_tool"] as const;

  type LocaleStats = {
    passes: number;
    failures: Record<string, number>;
  };

  const stats: Record<string, LocaleStats> = Object.fromEntries(
    locales.map((l) => [l, { passes: 0, failures: Object.fromEntries(failureModes.map((m) => [m, 0])) }]),
  );

  for (const run of runs) {
    for (const [locale, result] of Object.entries(run.summary)) {
      if (result.status === "pass") {
        stats[locale].passes += 1;
      } else if (result.failureMode && result.failureMode in stats[locale].failures) {
        stats[locale].failures[result.failureMode] += 1;
      }
    }
  }

  const totalChecks = runs.length * locales.length;
  const totalPasses = locales.reduce((sum, l) => sum + stats[l].passes, 0);
  const avgDuration = Math.round(runs.reduce((sum, r) => sum + r.durationMs, 0) / runs.length);

  const headerCols = ["Locale", "Pass", ...failureModes];
  const colWidths = headerCols.map((h) => h.length);

  const tableRows = locales.map((locale) => {
    const s = stats[locale];
    const failures = s.passes < runs.length ? runs.length - s.passes : 0;
    return [
      locale,
      `${s.passes}/${runs.length}`,
      ...failureModes.map((m) => String(s.failures[m] || 0)),
    ];
  });

  for (const row of tableRows) {
    row.forEach((cell, i) => {
      colWidths[i] = Math.max(colWidths[i], cell.length);
    });
  }

  const tableHeader = `| ${headerCols.map((h, i) => h.padEnd(colWidths[i])).join(" | ")} |`;
  const tableDivider = `| ${colWidths.map((w) => "-".repeat(w)).join(" | ")} |`;
  const tableBody = tableRows.map(
    (row) => `| ${row.map((cell, i) => cell.padEnd(colWidths[i])).join(" | ")} |`,
  );

  return [
    "# LangDrift Benchmark Results",
    "",
    `Scenario: ${scenarioPath}`,
    `Domain: ${domain}`,
    `Model: ${modelName} (${provider})`,
    `Iterations: ${runs.length}`,
    `Total locale checks: ${totalChecks}`,
    `Pass rate: ${totalPasses}/${totalChecks} (${Math.round((totalPasses / totalChecks) * 100)}%)`,
    `Average run duration: ${avgDuration} ms`,
    "",
    tableHeader,
    tableDivider,
    ...tableBody,
    "",
    "## Runs",
    "",
    ...runs.flatMap((run) => [
      `### Iteration ${run.iteration}`,
      "",
      `Duration: ${run.durationMs} ms / Exit: ${run.exitCode}`,
      "",
      "```",
      run.output.trim(),
      "```",
      "",
    ]),
  ].join("\n");
}

type LocaleSummary = {
  status: "pass" | "fail";
  failureMode: string | null;
  detail: string;
};

type BenchmarkRun = {
  iteration: number;
  durationMs: number;
  exitCode: number;
  output: string;
  summary: Record<string, LocaleSummary>;
};
