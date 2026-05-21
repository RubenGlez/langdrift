import type { RunResult } from "./types.ts";

export function formatTerminalReport(run: RunResult): string {
  const failed = run.results.filter((r) => r.status === "fail").length;
  const localeWidth = Math.max("Locale".length, ...run.results.map((r) => r.locale.length));
  const statusWidth = "Status".length;
  const failureModeWidth = Math.max(
    "Failure".length,
    ...run.results.map((r) => (r.failureMode ?? "-").length),
  );

  const lines = [
    "LangDrift run",
    "",
    `Scenario: ${run.scenarioId}`,
    `Target: ${run.target}`,
    "",
    `${pad("Locale", localeWidth)}  ${pad("Status", statusWidth)}  ${pad("Failure", failureModeWidth)}  Detail`,
    ...run.results.map(
      (r) =>
        `${pad(r.locale, localeWidth)}  ${pad(r.status, statusWidth)}  ${pad(r.failureMode ?? "-", failureModeWidth)}  ${r.detail}`,
    ),
    "",
    `Result: ${failed === 0 ? "passed" : "failed"}, ${failed} of ${run.results.length} locales failed`,
  ];

  return `${lines.join("\n")}\n`;
}

function pad(value: string, width: number): string {
  return value.padEnd(width, " ");
}
