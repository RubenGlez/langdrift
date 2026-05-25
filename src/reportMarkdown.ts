import type { MatrixResult, RunResult } from "./types.ts";

export function formatMarkdownRunReport(run: RunResult): string {
  const failedLocales = run.results.filter((r) => r.status === "fail").length;
  const rows = run.results.map((r) => {
    const rate = `${r.passed}/${r.total}`;
    const pct = `${Math.round((r.passed / r.total) * 100)}%`;
    const failure = r.failureMode ?? "—";
    return `| ${r.locale} | ${rate} | ${pct} | ${failure} |`;
  });

  const lines = [
    "# LangDrift Run",
    "",
    `**Scenario:** ${run.scenarioId}  `,
    `**Target:** ${run.target}  `,
    `**Iterations:** ${run.iterations}  `,
    "",
    "| Locale | Passed | Rate | Failure |",
    "|--------|--------|------|---------|",
    ...rows,
    "",
    `**Result:** ${failedLocales === 0 ? "passed" : "failed"}, ${failedLocales} of ${run.results.length} locales failed`,
    "",
  ];

  return lines.join("\n");
}

export function formatMarkdownMatrixReport(matrix: MatrixResult): string {
  const allLocales = collectLocales(matrix);
  const scenarioIds = matrix.runs.map((r) => r.scenarioId);

  const headerRow = `| Locale | ${scenarioIds.join(" | ")} |`;
  const separator = `|--------|${scenarioIds.map(() => "--------").join("|")}|`;

  const dataRows = allLocales.map((locale) => {
    const cells = matrix.runs.map((run) => {
      const result = run.results.find((r) => r.locale === locale);
      if (!result) return "—";
      const cell = `${result.passed}/${result.total}`;
      return result.status === "pass" ? `**${cell}**` : cell;
    });
    return `| ${locale} | ${cells.join(" | ")} |`;
  });

  const { totalPassed, totalRuns } = computeTotals(matrix, allLocales);
  const overallPct =
    totalRuns === 0 ? "—" : `${Math.round((totalPassed / totalRuns) * 100)}%`;

  const lines = [
    "# LangDrift Matrix",
    "",
    `**Target:** ${matrix.target}  `,
    `**Iterations:** ${matrix.iterations}  `,
    "",
    headerRow,
    separator,
    ...dataRows,
    "",
    `**Scenarios:** ${matrix.runs.length}  **Locales:** ${allLocales.length}  **Overall:** ${totalPassed}/${totalRuns} (${overallPct})`,
    "",
  ];

  return lines.join("\n");
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
