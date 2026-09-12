# Implementation Plan: Research-Validity Hardening

**Status: complete.** Both phases implemented and QA-passed on 2026-06-25 (see `../qa/report.md`). All five features are `done`. One follow-up remains outside this plan: a single benchmark run against a real model provider to regenerate result tables with the new confidence-interval column (F4 was verified against a deterministic stub, not a live provider).

## Goal

Harden LangDrift's credibility anchor (the multilingual benchmark) before it gets a public writeup. These five fixes remove measurement-validity threats that currently inflate or misrepresent the headline "locale drift" finding. None of them add runtime dependencies or change the CLI's stateless, no-build-step architecture.

This is not feature work in the roadmap sense. It protects the existing must-have "Research benchmark with reproducible results" so the should-have public writeup can stand up to scrutiny.

## Why these five

| # | Problem today | Validity threat |
| - | ------------- | --------------- |
| F1 | Tool args compared by exact string equality over `Record<string,string>` | Models echo the user's language into free-text args, so correct non-English behavior is scored `wrong_argument`. The miscount falls on the very locales being measured — asymmetric bias that inflates the effect. Numbers/booleans always fail `!==`. |
| F2 | `responseLanguage` is script-based but documented as language detection; unlisted-script locales (e.g. Mongolian Cyrillic) get falsely flagged `wrong_language` | Overstated capability; a latent false-positive bug; the check contributes zero evidence to the benchmark (no scenario uses it). |
| F3 | Benchmark computes headline numbers by regex-scraping the pretty-printed terminal report | The numbers that *are* the credibility anchor are derived by brittle screen-scraping while a clean `--format json` path sits unused. |
| F4 | RESEARCH says 10 iterations "reduce noise", but the agent runs at `temperature:0` | Near-deterministic runs don't average out sampling variance; per-cell rates are reported with no uncertainty, inviting over-reading of noisy 7/10-vs-9/10 differences. |
| F5 | Writeup leans on per-language, single-model leaderboard reading | Per-language cells are confounded by unreviewed translation quality. The confound-robust signal (cross-model recurrence) is underplayed. |

## Decisions

See ADRs:
- [adr/0001-script-check-over-language-id.md](../adr/0001-script-check-over-language-id.md)
- [adr/0002-oneof-scalar-arg-matching.md](../adr/0002-oneof-scalar-arg-matching.md)
- [adr/0003-report-cis-not-rerun-benchmark.md](../adr/0003-report-cis-not-rerun-benchmark.md)

## Phases

### Phase 1 — Measurement correctness (code)

Independent slices; F1 and F2 both touch `assertions.ts`/`types.ts`/`README.md` so land them in sequence to avoid conflicts, F3 is isolated.

- **F1** [features.md#oneof-scalar-normalized-argument-matching](features.md#oneof-scalar-normalized-argument-matching) — `oneOf` + scalar-normalized arg equality, canonical-args docs
- **F2** [features.md#honest-script-family-check-for-responselanguage](features.md#honest-script-family-check-for-responselanguage) — honest script-family check, fix Latin/Cyrillic false-positive, doc reframe
- **F3** [features.md#benchmark-consumes---format-json](features.md#benchmark-consumes---format-json) — benchmark consumes `--format json`

### Phase 2 — Research integrity (stats + docs)

- **F4** [features.md#benchmark-stats-integrity-wilson-cis-honest-temperature-framing](features.md#benchmark-stats-integrity-wilson-cis-honest-temperature-framing) — Wilson CIs, drop "reduces noise" framing (depends on F3)
- **F5** [features.md#reframe-the-writeup-around-cross-model-agreement](features.md#reframe-the-writeup-around-cross-model-agreement) — foreground cross-model agreement (depends on F1/F2 corrected semantics; numbers narrative aligns with F4)

## Verification (whole effort)

- `pnpm lint`, `pnpm typecheck`, `pnpm test` green
- New unit tests in `tests/scenario.test.ts` cover: `oneOf` match/miss, scalar-normalized number/boolean equality, script-check cannot-decide PASS for Latin-vs-Latin, Mongolian Cyrillic no longer false-flagged
- `pnpm fake-agent` + a sample `langdrift run` still passes the demo scenario
- `examples/benchmark/run.ts` produces the same table from JSON ingest as before (spot-check one cached result), now with a CI column
- README, RESEARCH.md, and CONTEXT.md contain no claim the code doesn't implement

## Out of scope

- Real statistical language identification (fastText/CLD) — rejected, see ADR 0001
- Re-running the benchmark at `temperature>0` — rejected, see ADR 0003
- Regex/contains/case-insensitive arg matchers — deferred, see ADR 0002
- JSON-schema assertions for `structured` output — separate roadmap item
