import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { assertExpectedToolCall } from "./assertions.ts";
import { executeHttpTarget } from "./httpTarget.ts";
import { loadScenario } from "./scenario.ts";
import type {
  LocaleResult,
  MatrixResult,
  RunResult,
  Scenario,
  TargetResponse,
} from "./types.ts";

type IterationRecord = {
  status: "pass" | "fail";
  failureMode: LocaleResult["failureMode"];
  detail: string;
  response?: TargetResponse;
};

export async function runScenario(
  scenario: Scenario,
  target: string,
  iterations: number,
): Promise<RunResult> {
  const localeIterations: Record<string, IterationRecord[]> = {};

  for (const locale of Object.keys(scenario.locales)) {
    localeIterations[locale] = [];
  }

  for (let i = 0; i < iterations; i++) {
    for (const [locale, variant] of Object.entries(scenario.locales)) {
      const targetResult = await executeHttpTarget({
        target,
        scenarioId: scenario.id,
        locale,
        input: variant.input,
      });

      if (!targetResult.ok) {
        localeIterations[locale].push({
          status: "fail",
          failureMode: "no_tool_call",
          detail: targetResult.detail,
        });
        continue;
      }

      const assertion = assertExpectedToolCall(
        variant.expect,
        targetResult.response,
      );
      localeIterations[locale].push({
        status: assertion.pass ? "pass" : "fail",
        failureMode: assertion.failureMode,
        detail: assertion.detail,
        response: targetResult.response,
      });
    }
  }

  const results: LocaleResult[] = [];

  for (const [locale, iters] of Object.entries(localeIterations)) {
    const passed = iters.filter((r) => r.status === "pass").length;
    const failed = iters.length - passed;
    const firstFail = iters.find((r) => r.status === "fail");
    const representative = firstFail ?? iters[0];

    results.push({
      locale,
      status: failed === 0 ? "pass" : "fail",
      passed,
      failed,
      total: iters.length,
      failureMode: firstFail?.failureMode ?? null,
      detail: representative?.detail ?? "",
      response: representative?.response,
    });
  }

  return { scenarioId: scenario.id, target, iterations, results };
}

export async function runScenarios(
  scenarioPaths: string[],
  target: string,
  iterations: number,
): Promise<MatrixResult> {
  const runs: RunResult[] = [];

  for (const path of scenarioPaths) {
    const scenario = await loadScenario(path);
    runs.push(await runScenario(scenario, target, iterations));
  }

  return { target, iterations, runs };
}

export async function resolveScenarioPaths(path: string): Promise<string[]> {
  try {
    const entries = await readdir(path);
    return entries
      .filter((name) => name.endsWith(".yaml") || name.endsWith(".yml"))
      .map((name) => join(path, name))
      .sort();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOTDIR") {
      return [path];
    }
    throw err;
  }
}
