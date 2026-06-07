# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
