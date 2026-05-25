import type { MatrixResult, RunResult } from "./types.ts";

export function formatJsonReport(run: RunResult): string {
  const failedLocales = run.results.filter((r) => r.status === "fail").length;
  const passedLocales = run.results.length - failedLocales;

  return `${JSON.stringify(
    {
      schemaVersion: 2,
      scenarioId: run.scenarioId,
      target: run.target,
      iterations: run.iterations,
      status: failedLocales === 0 ? "passed" : "failed",
      summary: {
        locales: run.results.length,
        passedLocales,
        failedLocales,
        totalRuns: run.results.reduce((sum, r) => sum + r.total, 0),
        totalPassed: run.results.reduce((sum, r) => sum + r.passed, 0),
      },
      results: run.results.map(({ response: _response, ...rest }) => rest),
    },
    null,
    2,
  )}\n`;
}

export function formatJsonMatrixReport(matrix: MatrixResult): string {
  const allLocales = collectLocales(matrix);
  const totalPassed = matrix.runs.reduce(
    (sum, run) => sum + run.results.reduce((s, r) => s + r.passed, 0),
    0,
  );
  const totalRuns = matrix.runs.reduce(
    (sum, run) => sum + run.results.reduce((s, r) => s + r.total, 0),
    0,
  );

  return `${JSON.stringify(
    {
      schemaVersion: 2,
      target: matrix.target,
      iterations: matrix.iterations,
      status: matrix.runs.every((run) =>
        run.results.every((r) => r.status === "pass"),
      )
        ? "passed"
        : "failed",
      summary: {
        scenarios: matrix.runs.length,
        locales: allLocales.length,
        totalRuns,
        totalPassed,
      },
      runs: matrix.runs.map((run) => ({
        scenarioId: run.scenarioId,
        status: run.results.every((r) => r.status === "pass")
          ? "passed"
          : "failed",
        results: run.results.map(({ response: _response, ...rest }) => rest),
      })),
    },
    null,
    2,
  )}\n`;
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
