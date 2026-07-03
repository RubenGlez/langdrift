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
  timeoutMs?: number,
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
        agent: scenario.agent,
        timeoutMs,
      });

      if (!targetResult.ok) {
        // Transport/harness failures get their own mode so an agent outage or a
        // malformed response isn't miscounted as model drift (F-5, F-21).
        localeIterations[locale].push({
          status: "fail",
          failureMode: "target_error",
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
  timeoutMs?: number,
): Promise<MatrixResult> {
  const runs: RunResult[] = [];

  for (const path of scenarioPaths) {
    const scenario = await loadScenario(path);
    runs.push(await runScenario(scenario, target, iterations, timeoutMs));
  }

  return { target, iterations, runs };
}

// Resolves a run input to the scenario files it covers, and reports whether the
// input was a directory. The directory flag lets the CLI pick the report schema
// by input kind rather than by file count, so a directory that happens to hold
// one file still emits the matrix shape (F-20).
export type ResolvedScenarioPaths = {
  paths: string[];
  isDirectory: boolean;
};

export async function resolveScenarioPaths(
  path: string,
): Promise<ResolvedScenarioPaths> {
  try {
    const entries = await readdir(path);
    const paths = entries
      .filter((name) => name.endsWith(".yaml") || name.endsWith(".yml"))
      .map((name) => join(path, name))
      .sort();
    return { paths, isDirectory: true };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOTDIR") {
      return { paths: [path], isDirectory: false };
    }
    throw err;
  }
}
