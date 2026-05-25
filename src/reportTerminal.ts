import type { MatrixResult, RunResult } from "./types.ts";

export function formatTerminalReport(run: RunResult): string {
  const failedLocales = run.results.filter((r) => r.status === "fail").length;
  const localeWidth = Math.max(
    "Locale".length,
    ...run.results.map((r) => r.locale.length),
  );
  const rateWidth = Math.max(
    "Passed".length,
    ...run.results.map((r) => `${r.passed}/${r.total}`.length),
  );
  const failureModeWidth = Math.max(
    "Failure".length,
    ...run.results.map((r) => (r.failureMode ?? "-").length),
  );

  const lines = [
    "LangDrift run",
    "",
    `Scenario: ${run.scenarioId}`,
    `Target: ${run.target}`,
    `Iterations: ${run.iterations}`,
    "",
    `${pad("Locale", localeWidth)}  ${pad("Passed", rateWidth)}  ${pad("Failure", failureModeWidth)}  Detail`,
    ...run.results.map(
      (r) =>
        `${pad(r.locale, localeWidth)}  ${pad(`${r.passed}/${r.total}`, rateWidth)}  ${pad(r.failureMode ?? "-", failureModeWidth)}  ${r.detail}`,
    ),
    "",
    `Result: ${failedLocales === 0 ? "passed" : "failed"}, ${failedLocales} of ${run.results.length} locales failed`,
  ];

  return `${lines.join("\n")}\n`;
}

export function formatTerminalMatrixReport(matrix: MatrixResult): string {
  const allLocales = collectLocales(matrix);
  const scenarioIds = matrix.runs.map((r) => r.scenarioId);

  const localeWidth = Math.max(
    "Locale".length,
    ...allLocales.map((l) => l.length),
  );
  const colWidths = matrix.runs.map((run) =>
    Math.max(
      run.scenarioId.length,
      ...run.results.map((r) => `${r.passed}/${r.total}`.length),
    ),
  );

  const header = `${pad("Locale", localeWidth)}  ${scenarioIds.map((id, i) => pad(id, colWidths[i])).join("  ")}`;
  const separator = `${"-".repeat(localeWidth)}  ${colWidths.map((w) => "-".repeat(w)).join("  ")}`;

  const rows = allLocales.map((locale) => {
    const cells = matrix.runs.map((run, i) => {
      const result = run.results.find((r) => r.locale === locale);
      if (!result) return pad("—", colWidths[i]);
      return pad(`${result.passed}/${result.total}`, colWidths[i]);
    });
    return `${pad(locale, localeWidth)}  ${cells.join("  ")}`;
  });

  const { totalPassed, totalRuns } = computeTotals(matrix, allLocales);
  const overallPct =
    totalRuns === 0 ? "—" : `${Math.round((totalPassed / totalRuns) * 100)}%`;
  const failedLocales = allLocales.filter((locale) =>
    matrix.runs.some(
      (run) => run.results.find((r) => r.locale === locale)?.status === "fail",
    ),
  ).length;

  const lines = [
    "LangDrift matrix",
    "",
    `Target: ${matrix.target}`,
    `Iterations: ${matrix.iterations}`,
    `Scenarios: ${matrix.runs.length}`,
    "",
    header,
    separator,
    ...rows,
    "",
    `Result: ${failedLocales === 0 ? "passed" : "failed"}, ${totalPassed}/${totalRuns} (${overallPct}) overall`,
  ];

  return `${lines.join("\n")}\n`;
}

function collectLocales(matrix: MatrixResult): string[] {
  const seen = new Set<string>();
  for (const run of matrix.runs) {
    for (const result of run.results) {
      seen.add(result.locale);
    }
  }
  return [...seen].sort();
}

function computeTotals(
  matrix: MatrixResult,
  locales: string[],
): { totalPassed: number; totalRuns: number } {
  let totalPassed = 0;
  let totalRuns = 0;
  for (const run of matrix.runs) {
    for (const locale of locales) {
      const result = run.results.find((r) => r.locale === locale);
      if (result) {
        totalPassed += result.passed;
        totalRuns += result.total;
      }
    }
  }
  return { totalPassed, totalRuns };
}

function pad(value: string, width: number): string {
  return value.padEnd(width, " ");
}
