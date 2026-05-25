import assert from "node:assert/strict";
import test from "node:test";
import type { LocaleResult } from "../src/types.ts";

function makeResult(
  locale: string,
  passed: number,
  total: number,
): LocaleResult {
  return {
    locale,
    status: passed === total ? "pass" : "fail",
    passed,
    failed: total - passed,
    total,
    failureMode: passed === total ? null : "no_tool_call",
    detail: "",
  };
}

function shouldFail(
  results: LocaleResult[],
  minPassRate: number | null,
  allowFail: string[],
): boolean {
  const counted = results.filter((r) => !allowFail.includes(r.locale));

  if (minPassRate !== null) {
    const totalChecks = counted.reduce((sum, r) => sum + r.total, 0);
    const totalPassed = counted.reduce((sum, r) => sum + r.passed, 0);
    const rate = totalChecks === 0 ? 100 : (totalPassed / totalChecks) * 100;
    return rate < minPassRate;
  }

  return counted.some((r) => r.status === "fail");
}

const passing = makeResult("en", 1, 1);
const failing = makeResult("eu", 0, 1);
const partial = makeResult("sw", 7, 10);

test("exits 0 with no failures and no threshold", () => {
  assert.equal(shouldFail([passing], null, []), false);
});

test("exits 1 when a locale fails with no threshold", () => {
  assert.equal(shouldFail([passing, failing], null, []), true);
});

test("allow-fail suppresses a failing locale", () => {
  assert.equal(shouldFail([passing, failing], null, ["eu"]), false);
});

test("allow-fail does not suppress other failing locales", () => {
  assert.equal(
    shouldFail([passing, failing, makeResult("yo", 0, 1)], null, ["eu"]),
    true,
  );
});

test("min-pass-rate passes when rate is above threshold", () => {
  // en 1/1 + sw 7/10 = 8/11 = 72.7% → fails at 70 threshold but passes at 70
  assert.equal(shouldFail([passing, partial], 70, []), false);
});

test("min-pass-rate fails when rate is below threshold", () => {
  // 7/10 = 70% on sw alone, threshold 80 → fail
  assert.equal(shouldFail([partial], 80, []), true);
});

test("min-pass-rate excludes allow-fail locales from calculation", () => {
  // sw is 7/10 (70%), but it's allow-failed; only en 1/1 counts → 100% → pass
  assert.equal(shouldFail([passing, partial], 80, ["sw"]), false);
});

test("min-pass-rate at exactly threshold boundary passes", () => {
  // 8/10 = 80%, threshold 80 → should not fail (rate is not strictly less)
  assert.equal(shouldFail([makeResult("fr", 8, 10)], 80, []), false);
});

test("min-pass-rate just below threshold fails", () => {
  assert.equal(shouldFail([makeResult("fr", 7, 10)], 80, []), true);
});
