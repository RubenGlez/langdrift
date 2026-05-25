import { loadScenario } from "./scenario.ts";
import type { Scenario } from "./types.ts";

export type LintIssue = {
  severity: "error" | "warning";
  message: string;
};

export type LintResult = {
  path: string;
  issues: LintIssue[];
};

export async function lintScenarios(paths: string[]): Promise<LintResult[]> {
  const loaded: Array<{
    path: string;
    scenario: Scenario | null;
    issues: LintIssue[];
  }> = [];

  for (const path of paths) {
    const issues: LintIssue[] = [];
    let scenario: Scenario | null = null;

    try {
      scenario = await loadScenario(path);
    } catch (error) {
      issues.push({
        severity: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }

    if (scenario) {
      const locales = Object.keys(scenario.locales);

      if (locales.length === 1) {
        issues.push({
          severity: "warning",
          message: `only 1 locale defined (${locales[0]}); add more locales to test multilingual behavior`,
        });
      }

      if (!locales.includes("en")) {
        issues.push({
          severity: "warning",
          message: `no "en" locale; English is typically used as the baseline`,
        });
      }
    }

    loaded.push({ path, scenario, issues });
  }

  if (paths.length > 1) {
    const localeSetByPath = new Map<string, Set<string>>();
    for (const { path, scenario } of loaded) {
      if (scenario) {
        localeSetByPath.set(path, new Set(Object.keys(scenario.locales)));
      }
    }

    const allLocales = new Set<string>();
    for (const set of localeSetByPath.values()) {
      for (const locale of set) allLocales.add(locale);
    }

    for (const { path, scenario, issues } of loaded) {
      if (!scenario) continue;
      const covered = localeSetByPath.get(path) ?? new Set<string>();
      const missing = [...allLocales].filter((l) => !covered.has(l));
      if (missing.length > 0) {
        issues.push({
          severity: "warning",
          message: `missing locales present in other files: ${missing.join(", ")}`,
        });
      }
    }
  }

  return loaded.map(({ path, issues }) => ({ path, issues }));
}

export function formatLintReport(results: LintResult[]): string {
  const lines: string[] = [];
  let errors = 0;
  let warnings = 0;

  for (const result of results) {
    for (const issue of result.issues) {
      const label = issue.severity === "error" ? "error" : "warning";
      lines.push(`${result.path}: ${label}: ${issue.message}`);
      if (issue.severity === "error") errors += 1;
      else warnings += 1;
    }
  }

  if (lines.length === 0) {
    lines.push(
      `${results.length} file${results.length === 1 ? "" : "s"} checked, no issues found`,
    );
  } else {
    lines.push("");
    lines.push(
      `${results.length} file${results.length === 1 ? "" : "s"} checked — ${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}`,
    );
  }

  return `${lines.join("\n")}\n`;
}
