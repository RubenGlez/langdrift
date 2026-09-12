# Architecture

## Overview

LangDrift is a stateless CLI tool. There is no server and no persistent state. The dev workflow runs the TypeScript source directly via Node 24 native `strip-types` (`node ./src/cli.ts`), but the published package ships compiled JavaScript (`dist/`, built by `tsc` on `prepack`) because Node refuses to strip types under `node_modules` — see [ADR 0004](../adr/0004-build-step-for-npm-distribution.md). Zero runtime dependencies — every component from YAML parsing to Unicode script detection is hand-rolled.

## Stack

- Language: TypeScript (executed directly via Node >= 24 native strip-types)
- Framework: none (pure Node.js)
- Database / storage: none (stateless CLI)
- Key libraries: `@biomejs/biome` (linting/formatting), `typescript` (type checking only)

## Components

- `cli.ts` — entry point; parses CLI args and dispatches to `run`, `init`, `lint`, and `translate` subcommands; owns exit code logic
- `scenario.ts` — hand-rolled indent-aware YAML tokenizer (no external deps); exports `loadScenario` and `resolveScenarioPaths` for directory glob support
- `runner.ts` — iterates locales sequentially; calls `executeHttpTarget` then `assertExpectedToolCall` per locale; exports `runScenario` (single file → `RunResult`) and `runScenarios` (directory → `MatrixResult`)
- `httpTarget.ts` — POSTs `{ locale, input, scenarioId }` to the agent URL; normalizes missing response fields to `""`, `[]`, `null`; non-2xx is a locale failure
- `assertions.ts` — deterministic assertion engine; handles `toolCall` (single or anyOf array), `toolCalls` (ordered sequence), `noToolCall`, and `responseLanguage`. Argument matching uses scalar-normalized equality plus optional per-argument `oneOf` (see `engineering/features.md#oneof-scalar-normalized-argument-matching`). `responseLanguage` is a script-family check, not language detection: it confirms script via Unicode ranges, returns PASS when a locale's script is not determinable, and only penalizes non-Latin content for locales in an explicit Latin allowlist (see `engineering/features.md#honest-script-family-check-for-responselanguage`)
- `reportTerminal.ts` — plain-text formatter; prioritizes failure mode and first failing detail over raw response data
- `reportJson.ts` — JSON formatter; emits the full `RunResult` or `MatrixResult` as structured output
- `reportMarkdown.ts` — Markdown formatter; designed for GitHub Actions step summaries and PR comments
- `init.ts` — generates starter YAML from built-in templates: `support`, `ecommerce`, `scheduling`, `generic`
- `lint.ts` — scenario linter; checks for missing locales, duplicate IDs, and invalid assertion shapes; supports directory mode for cross-scenario locale coverage warnings
- `translate.ts` — LLM-assisted locale generation; calls OpenAI API to translate user inputs across locales; `--write` modifies the YAML file in place
- `types.ts` — shared type definitions: `Scenario`, `ScenarioLocale`, `TargetResponse`, `LocaleResult`, `RunResult`, `MatrixResult`

## Data flow

```
CLI (cli.ts)
  → loadScenario / resolveScenarioPaths (scenario.ts)  # parse YAML into Scenario; glob dirs
  → runScenario / runScenarios (runner.ts)              # iterate locales (or matrix of scenarios)
      → executeHttpTarget (httpTarget.ts)               # POST {locale, input, scenarioId} to agent
      → assertExpectedToolCall (assertions.ts)          # deterministic assertion checks
  → format report (reportTerminal / reportJson / reportMarkdown)
  → exit 0 on pass, 1 on failure (based on pass rate or any-fail)
```

For directory runs, `runScenarios` aggregates per-file `RunResult` values into a `MatrixResult`. Single-file runs return `RunResult` directly.

## HTTP target contract

The agent endpoint must accept POST `{ locale, input, scenarioId }` and respond with `{ text, toolCalls[], structured }`. Missing fields normalize to `""`, `[]`, `null`. Any non-2xx response fails the locale immediately.

## Key decisions

- **Zero runtime dependencies** — the YAML parser is hand-rolled to avoid requiring a parser package; Unicode script detection is table-driven regex; all report formatters are pure string operations; this keeps `npm install` instant and audit surface minimal
- **Build only for publishing** — the dev workflow type-strips `.ts` directly (no build), but the npm artifact is compiled to `dist/*.js` via `tsc` on `prepack`, because Node cannot type-strip under `node_modules` ([ADR 0004](../adr/0004-build-step-for-npm-distribution.md)). Build-time-only; zero runtime dependencies unchanged
- **Deterministic assertions only** — no LLM-as-judge in the core; assertion results are explainable, stable, and CI-reproducible without a second API call
- **`toolCall` anyOf semantics without a schema change** — `toolCall` accepts both a single object and an array; the YAML tokenizer's output is post-processed to detect both shapes, keeping the YAML authoring experience natural
- **Exit code as the CI gate** — `--min-pass-rate` and `--allow-fail` translate pass/fail logic into exit codes 0/1, making the tool composable with any CI runner without custom plugins

## Open questions

- JSON schema assertions for `structured` output — how to validate without pulling in `ajv` or similar without breaking the zero-dependency rule?
