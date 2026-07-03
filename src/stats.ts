// Wilson score interval for a binomial proportion. Reported per locale so
// per-cell pass rates are read as estimates with uncertainty, not exact facts.
// Runs are near-deterministic at temperature 0, so this reflects API-side
// variance over N iterations, not a sampling distribution.
export function wilsonInterval(
  passes: number,
  total: number,
  z = 1.96,
): [number, number] | null {
  if (total === 0) return null;
  const p = passes / total;
  const denom = 1 + (z * z) / total;
  const center = (p + (z * z) / (2 * total)) / denom;
  const margin =
    (z / denom) *
    Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total));
  const low = Math.max(0, center - margin);
  const high = Math.min(1, center + margin);
  return [low, high];
}
