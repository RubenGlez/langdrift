# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the CLI
node ./src/cli.ts run <scenario.yaml> --target <url>

# Run tests (Node built-in test runner)
pnpm test

# Run a single test file
node --test tests/scenario.test.ts

# Start the example agent
OPENAI_API_KEY=... pnpm agent

# Run a benchmark
OPENAI_API_KEY=... pnpm benchmark:support
```

TypeScript is not compiled; Node runs `.ts` files directly (Node >= 24 with native strip-types). There is no build step.

## Architecture

LangDrift is a locale-aware eval harness for AI agent workflows. The core question it answers: does an AI agent still behave correctly when the same user intent is expressed in different languages?

**Data flow:**

```
CLI (cli.ts)
  → loadScenario (scenario.ts)       # parse YAML into Scenario type
  → runScenario (runner.ts)          # iterate locales sequentially
      → executeHttpTarget (httpTarget.ts)  # POST {locale, input, scenarioId} to agent URL
      → assertExpectedToolCall (assertions.ts)  # deterministic tool call checks
  → formatTerminalReport (reportTerminal.ts)  # plain-text output
```

**Key types** (`src/types.ts`):
- `Scenario`: loaded from YAML; contains `id`, `agent`, and per-locale variants
- `ScenarioLocale`: one locale's `input` string plus `expect` assertions (required tool call, optional forbidden tool call, optional argument checks)
- `TargetResponse`: what the HTTP agent returns: `text`, `toolCalls[]`, `structured`
- `LocaleResult`: per-locale pass/fail with a detail string
- `RunResult`: full run output consumed by the reporter

**HTTP target contract:** LangDrift POSTs `{ locale, input, scenarioId }` to the target URL. The agent must respond with `{ text, toolCalls, structured }`. Missing fields normalize to `""`, `[]`, `null`.

**Assertions** are deterministic only (no LLM-as-judge). Checks: required tool call name, required shallow argument key/value pairs, forbidden tool call name. Argument checks are shallow; extra keys in the actual response are ignored.

**YAML parser** (`scenario.ts`) is a hand-rolled indent-aware tokenizer with no external dependencies. The project has zero runtime dependencies.

**Examples** (`examples/`) demonstrate a real LLM-backed agent:
- `agent/`: model-agnostic agent supporting OpenAI, Anthropic, and any OpenAI-compatible API

**Scenarios** (`examples/scenarios/*.yaml`): one scenario per file; each locale gets its own `input` and `expect` block.
