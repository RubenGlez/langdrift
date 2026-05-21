# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the CLI
node ./src/cli.ts run <scenario.yaml> --target <url>
# or via pnpm script
pnpm lokalite -- run ./examples/scenarios/refund-request.yaml --target http://127.0.0.1:3000/api/agent

# Run tests (Node built-in test runner)
pnpm test

# Run a single test file
node --test tests/scenario.test.ts

# Start the demo agent (port 3000)
pnpm example:agent

# Start the DeepSeek-backed agent (requires DEEPSEEK_API_KEY)
pnpm example:deepseek-agent

# Run the DeepSeek benchmark
DEEPSEEK_API_KEY=... pnpm benchmark:deepseek
```

TypeScript is not compiled — Node runs `.ts` files directly (Node >= 24 with native strip-types). There is no build step.

## Architecture

Lokalite is a locale-aware eval harness for AI agent workflows. The core question it answers: does an AI agent still behave correctly when the same user intent is expressed in different languages?

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
- `Scenario` — loaded from YAML; contains `id`, `agent`, and per-locale variants
- `ScenarioLocale` — one locale's `input` string plus `expect` assertions (required tool call, optional forbidden tool call, optional argument checks)
- `TargetResponse` — what the HTTP agent returns: `text`, `toolCalls[]`, `structured`
- `LocaleResult` — per-locale pass/fail with a detail string
- `RunResult` — full run output consumed by the reporter

**HTTP target contract** — Lokalite POSTs `{ locale, input, scenarioId }` to the target URL. The agent must respond with `{ text, toolCalls, structured }`. Missing fields normalize to `""`, `[]`, `null`.

**Assertions** are deterministic only (no LLM-as-judge). Checks: required tool call name, required shallow argument key/value pairs, forbidden tool call name. Argument checks are shallow — extra keys in the actual response are ignored.

**YAML parser** (`scenario.ts`) is a hand-rolled indent-aware tokenizer with no external dependencies. The project has zero runtime dependencies.

**Examples** (`examples/`) demonstrate two agent implementations:
- `support-agent/server.ts` — deterministic fake agent; French locale intentionally omits the tool call to show a cross-locale failure
- `deepseek-support-agent/` — real LLM-backed agent using DeepSeek API

**Scenarios** (`examples/scenarios/*.yaml`) — one scenario per file; each locale gets its own `input` and `expect` block.
