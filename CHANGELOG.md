# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `target_error` failure mode: transport failures (network error, non-2xx, malformed or non-JSON response, timeout) are now classified separately from the behavioral `no_tool_call` mode, so an agent outage is no longer counted as locale drift.
- `--timeout MS` flag on `run` (default 30000); a hung locale is recorded as `target_error` instead of stalling the whole run.
- `noToolCall` can forbid multiple tools via `anyOf: [a, b]`.
- `translate` now emits `responseLanguage` for the target locale (when the source asserts one) and warns when the model returns fewer locales than requested.
- `lint` flags duplicate scenario ids across a directory and `responseLanguage` values whose script cannot be determined (the check can never fail).
- The CLI JSON report includes a 95% Wilson confidence interval per locale.

### Changed
- `responseLanguage`: `ja` now requires kana so pure-Chinese text no longer passes; the non-Latin detector covers every script in the table (including Georgian and Ethiopic); the measured in-script ratio is included in the `detail`.
- Directory input always emits the matrix report shape, even for a single file.
- Markdown run report includes a `Detail` column; the matrix highlights failing cells instead of passing ones and escapes `|` in cell values.
- The `agent:` field is now sent in the POST body to the target as routing metadata.
- Minimum Node version relaxed to `>=22`.

### Fixed
- Scalar argument assertions no longer let a non-scalar (array/object/null) pass via `String()` coercion.
- Scenario parser: `oneOf` items with quoted commas parse correctly; duplicate locale keys, nameless tool-call list items, tab/odd indentation, and block scalars are rejected with line-numbered errors; an empty `noToolCall:` no longer absorbs a sibling's `name:`.
- `translate` serializes `oneOf` matchers correctly instead of `[object Object]`.
- `--allow-fail` warns when a value matches no locale; `-v`/`-h` no longer hijack a `run` invocation; the target URL is validated.
- CI now builds the compiled artifact and runs it.

## [0.3.1] - 2026-06-25

### Fixed
- The published package now ships compiled JavaScript (`dist/`) and runs when installed from npm. Previously it shipped raw TypeScript as its CLI entry, which Node refuses to type-strip under `node_modules`, so `npm install langdrift` produced a non-functional CLI on every prior version (including 0.3.0).

## [0.3.0] - 2026-06-25

### Added
- Tool-argument assertions support `oneOf` (a list of accepted canonical values) and match scalars with type-normalized equality, so canonical arguments are no longer falsely failed on type alone (e.g. number `2` matches `"2"`).
- Benchmark report includes a 95% Wilson confidence interval per locale.

### Changed
- `responseLanguage` is documented and implemented as a script-family check: it confirms a reply's script and passes when a locale's script cannot be determined, rather than guessing. It cannot distinguish languages that share a script.
- Benchmark harness consumes the CLI's `--format json` output instead of scraping the terminal report.
- Research methodology framing: benchmark runs are near-deterministic at temperature 0, per-locale rates are reported as estimates with confidence intervals, and cross-model agreement is foregrounded as the primary finding.

### Fixed
- `responseLanguage` no longer false-flags correct responses for locales whose script is not in the Latin set (e.g. Mongolian Cyrillic).

## [0.2.7] - 2026-06-07

### Changed
- MIT license standardized

## [0.2.6] - 2026-05-01

### Added
- DeepSeek benchmark results

## [0.2.5] - 2026-04-15

### Changed
- Improved agent translate prompt for general agent workflows (not just support)

## [0.2.4] - 2026-04-01

### Added
- DeepSeek support in the example model-backed agent (`MODEL_PROVIDER=deepseek`)

## [0.2.3] - 2026-03-15

### Changed
- README refocused for product adoption and clearer onboarding

## [0.2.2] - 2026-03-01

### Added
- `responseLanguage` assertion: check that the agent replies in the expected BCP-47 language (no external deps; uses Unicode script detection)
- Ordered tool-call sequence assertions: `toolCalls` accepts an array and checks calls in order
- anyOf `toolCall`: `toolCall` field now accepts an array of alternatives — pass if any match

## [0.2.1] - 2026-02-15

### Added
- Anthropic support in the example model-backed agent (`MODEL_PROVIDER=anthropic`)

## [0.2.0] - 2026-02-01

### Added
- `langdrift lint`: validate scenario files for missing locales, duplicate IDs, and invalid assertion structure
- `langdrift translate`: LLM-assisted locale generation — translate a scenario's English inputs to other locales via OpenAI API; `--write` appends results directly to the YAML file
- Directory-level matrix runs: pass a directory to `langdrift run` to run all `.yaml` files and get a combined pass-rate matrix
- `--format markdown`: emit a GitHub-flavored markdown table for use in GitHub Actions summaries or PR comments

## [0.1.0] - 2026-01-01

### Added
- `langdrift run`: run YAML scenarios against any HTTP agent target
- `langdrift init`: generate a starter scenario from templates (support, ecommerce, scheduling, generic)
- Per-locale `toolCall`, `noToolCall` assertions with shallow argument matching
- `--iterations N`: repeat each locale multiple times and aggregate pass rates
- `--min-pass-rate N`: fail CI only if overall pass rate falls below a threshold
- `--allow-fail <locale>`: acknowledge a known-weak locale without blocking CI
- `--format json`: machine-readable output for downstream tooling
- Fake local agent for no-key demos
- HTTP target contract: POST `{ locale, input, scenarioId }`, respond with `{ text, toolCalls, structured }`
