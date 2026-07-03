#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import { writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { wilsonInterval } from "../../src/stats.ts";
import { FAILURE_MODES } from "../../src/types.ts";

const scenarioPath =
  process.env.SCENARIO ?? "./examples/scenarios/support-routing.yaml";
const domain = process.env.DOMAIN ?? "support";
const provider = process.env.MODEL_PROVIDER ?? "openai-compat";
const modelName = process.env.MODEL_NAME ?? "gpt-4o-mini";
const iterations = Number.parseInt(process.env.ITERATIONS ?? "3", 10);
const port = 3010;
const target = `http://127.0.0.1:${port}/api/agent`;

const PROVIDER_KEY_ENV: Record<string, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  "openai-compat": "OPENAI_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
};

const apiKey = process.env[PROVIDER_KEY_ENV[provider] ?? ""];

if (!apiKey) {
  const envVar = PROVIDER_KEY_ENV[provider] ?? "MODEL_API_KEY";
  console.error(`No API key found for provider "${provider}". Set ${envVar}.`);
  process.exit(1);
}

const server = spawn(process.execPath, ["./examples/agent/server.ts"], {
  env: {
    ...process.env,
    PORT: String(port),
    DOMAIN: domain,
    MODEL_PROVIDER: provider,
    MODEL_NAME: modelName,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForServer();

  const runs: BenchmarkRun[] = [];

  for (let i = 0; i < iterations; i += 1) {
    const startedAt = performance.now();
    const run = await runLangDrift();
    const durationMs = Math.round(performance.now() - startedAt);
    // A single malformed run shouldn't discard every completed iteration; skip
    // it with a warning and keep going (F-16).
    let parsed: { summary: Record<string, LocaleSummary>; log: string };
    try {
      parsed = parseJsonRun(run.stdout, run.stderr);
    } catch (error) {
      console.error(
        `Iteration ${i + 1} produced unparseable output, skipping: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      continue;
    }
    runs.push({
      iteration: i + 1,
      durationMs,
      exitCode: run.exitCode,
      output: parsed.log,
      summary: parsed.summary,
    });
  }

  if (runs.length === 0) {
    throw new Error("No benchmark iterations produced parseable output.");
  }

  const report = renderReport(runs);
  const slug = basename(scenarioPath).replace(/\.yaml$/, "");
  const modelSlug = modelName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const outDir = `./examples/benchmark/results/${modelSlug}`;
  const { mkdir } = await import("node:fs/promises");
  await mkdir(outDir, { recursive: true });
  const outPath = `${outDir}/${slug}.md`;
  await writeFile(outPath, report);
  process.stdout.write(report);
  console.error(`\nResults written to ${outPath}`);
} finally {
  server.kill("SIGINT");
  // `server.killed` only means a signal was delivered, not that the process
  // exited, so it can't gate the SIGKILL fallback. Race the real exit event
  // against a timeout and force-kill if the process is still running (F-16).
  let exited = false;
  const exitPromise = once(server, "exit").then(() => {
    exited = true;
  });
  await Promise.race([
    exitPromise,
    new Promise<void>((resolve) => setTimeout(resolve, 3000)),
  ]);
  if (!exited) {
    server.kill("SIGKILL");
    await exitPromise;
  }
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (serverOutput.includes("LangDrift agent listening")) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Agent server did not start.\n${serverOutput}`);
}

async function runLangDrift(): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> {
  const child = spawn(
    process.execPath,
    [
      "./src/cli.ts",
      "run",
      scenarioPath,
      "--target",
      target,
      "--format",
      "json",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const [exitCode] = (await once(child, "close")) as [number];
  return { exitCode, stdout, stderr };
}

type JsonLocaleResult = {
  locale: string;
  status: "pass" | "fail";
  passed: number;
  total: number;
  failureMode: string | null;
  detail: string;
};

function parseJsonRun(
  stdout: string,
  stderr: string,
): { summary: Record<string, LocaleSummary>; log: string } {
  let report: { results: JsonLocaleResult[] };
  try {
    report = JSON.parse(stdout);
  } catch {
    throw new Error(
      `Expected JSON from langdrift run, got:\n${stdout}\n${stderr}`,
    );
  }

  const summary: Record<string, LocaleSummary> = {};
  const logLines: string[] = [];

  for (const r of report.results) {
    summary[r.locale] = {
      status: r.status,
      failureMode: r.failureMode,
      detail: r.detail,
    };
    logLines.push(
      `${r.locale}\t${r.passed}/${r.total}\t${r.failureMode ?? "-"}\t${r.detail}`,
    );
  }

  return { summary, log: logLines.join("\n") };
}

function formatCi(passes: number, total: number): string {
  const ci = wilsonInterval(passes, total);
  if (!ci) return "—";
  return `[${ci[0].toFixed(2)}, ${ci[1].toFixed(2)}]`;
}

function renderReport(runs: BenchmarkRun[]): string {
  const localeSet = new Set<string>();
  for (const run of runs) {
    for (const locale of Object.keys(run.summary)) localeSet.add(locale);
  }
  const locales = Array.from(localeSet);

  // Derived from the single FailureMode source of truth so a newly added mode
  // (wrong_language, target_error) can never silently vanish from the table (F-12).
  const failureModes = FAILURE_MODES;

  type LocaleStats = {
    passes: number;
    failures: Record<string, number>;
  };

  const stats: Record<string, LocaleStats> = Object.fromEntries(
    locales.map((l) => [
      l,
      {
        passes: 0,
        failures: Object.fromEntries(failureModes.map((m) => [m, 0])),
      },
    ]),
  );

  for (const run of runs) {
    for (const [locale, result] of Object.entries(run.summary)) {
      if (result.status === "pass") {
        stats[locale].passes += 1;
      } else if (
        result.failureMode &&
        result.failureMode in stats[locale].failures
      ) {
        stats[locale].failures[result.failureMode] += 1;
      }
    }
  }

  const totalChecks = runs.length * locales.length;
  const totalPasses = locales.reduce((sum, l) => sum + stats[l].passes, 0);
  const avgDuration = Math.round(
    runs.reduce((sum, r) => sum + r.durationMs, 0) / runs.length,
  );

  const headerCols = ["Locale", "Pass", "95% CI", ...failureModes];
  const colWidths = headerCols.map((h) => h.length);

  const tableRows = locales.map((locale) => {
    const s = stats[locale];
    return [
      locale,
      `${s.passes}/${runs.length}`,
      formatCi(s.passes, runs.length),
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
    (row) =>
      `| ${row.map((cell, i) => cell.padEnd(colWidths[i])).join(" | ")} |`,
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
