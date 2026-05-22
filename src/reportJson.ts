import type { RunResult } from "./types.ts";

export function formatJsonReport(run: RunResult): string {
  const failed = run.results.filter((result) => result.status === "fail").length;
  const passed = run.results.length - failed;

  return `${JSON.stringify(
    {
      schemaVersion: 1,
      scenarioId: run.scenarioId,
      target: run.target,
      status: failed === 0 ? "passed" : "failed",
      summary: {
        total: run.results.length,
        passed,
        failed,
      },
      results: run.results,
    },
    null,
    2,
  )}\n`;
}
