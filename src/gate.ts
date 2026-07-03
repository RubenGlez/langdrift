import type { LocaleResult } from "./types.ts";

// The CI exit-code decision. Lives here (rather than inline in cli.ts) so the
// tests exercise the real function instead of a copy-pasted duplicate (F-23).
export function shouldFail(
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
