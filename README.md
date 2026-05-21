# LangDrift

A locale-aware eval harness for AI agent behavior.

## The thesis

AI localization is moving from translated strings to localized behavior. When you build an AI agent, you're not just rendering UI text in multiple languages — your agent interprets intent, selects tools, and produces structured output. Those behaviors can drift silently across languages while your translation coverage looks fine.

I wanted to know how bad the drift actually is, so I ran a benchmark.

## The finding

I ran a realistic support-routing scenario across 8 languages using a 5-tool agent. Each locale got an equivalent, natural-language phrasing of the same intent — not a literal translation. Three iterations, checking whether the agent called the right tool every time.

```text
Scenario: support_routing

Locale  Status  Failure      Detail
en      pass    -            create_refund_ticket
fr      pass    -            create_refund_ticket
ar      pass    -            create_refund_ticket
sw      fail    wrong_tool   expected create_refund_ticket, got check_payment_status
cy      pass    -            create_refund_ticket
yo      fail    wrong_tool   expected create_refund_ticket, got no tool calls
eu      pass    -            create_refund_ticket
mn      fail    wrong_tool   expected create_refund_ticket, got check_payment_status

Result: failed, 3 of 8 locales failed
```

Swahili and Mongolian routed to the wrong tool every time. The pattern correlated with linguistic distance from the training corpus, not speaker count — Arabic passed, Swahili failed. The agent wasn't misunderstanding the user; it was confidently doing the wrong thing.

This is the kind of failure that's invisible in English-first testing.

The full investigation and supporting research is in [RESEARCH.md](RESEARCH.md).

## What LangDrift does

LangDrift runs locale-specific scenarios against any HTTP agent and checks behavior, not just text. You write a YAML scenario with per-locale inputs and assertions. LangDrift calls your agent for each locale and reports pass/fail with failure mode classification.

Failure modes: `no_tool_call`, `wrong_tool`, `wrong_argument`, `missing_argument`, `forbidden_tool`.

## What works today

- Load a YAML scenario with per-locale inputs and assertions
- Call an HTTP agent target across multiple locales
- Assert required tool call name
- Assert required shallow tool arguments
- Assert forbidden tool calls did not happen
- Report pass/fail with failure mode by locale in terminal output
- Exit non-zero on failure (CI-ready)
- Run multi-iteration benchmarks, write markdown reports with per-locale failure tables

## Quick start

**1. Write a scenario:**

```yaml
id: refund_request
agent: support

locales:
  en:
    input: "I was charged twice for my subscription. Can you refund one charge?"
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason: duplicate_charge
      noToolCall:
        name: escalate_to_human

  fr:
    input: "J'ai été facturé deux fois. Pouvez-vous me rembourser un paiement?"
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason: duplicate_charge
```

**2. Point it at your agent:**

Your agent needs to accept `POST /api/agent` with `{ locale, input, scenarioId }` and respond with `{ text, toolCalls, structured }`.

**3. Run:**

```bash
node ./src/cli.ts run ./my-scenario.yaml --target http://127.0.0.1:3010/api/agent
```

## Example agent

The repo includes a model-agnostic agent you can run locally. It defaults to OpenAI but supports any OpenAI-compatible API or Anthropic.

```bash
# OpenAI (default)
OPENAI_API_KEY=... pnpm agent

# Anthropic
ANTHROPIC_API_KEY=... MODEL_PROVIDER=anthropic MODEL_NAME=claude-haiku-4-5-20251001 pnpm agent

# Any OpenAI-compatible API (DeepSeek, Together, etc.)
MODEL_API_KEY=... MODEL_API_URL=https://api.deepseek.com/chat/completions MODEL_NAME=deepseek-chat pnpm agent

# Choose domain: support (default), ecommerce, scheduling
DOMAIN=ecommerce OPENAI_API_KEY=... pnpm agent
```

Then run a scenario against it:

```bash
node ./src/cli.ts run ./examples/scenarios/support-routing.yaml --target http://127.0.0.1:3010/api/agent
```

## Benchmark

Run multi-iteration benchmarks across the three included scenarios (8 locales each). Results are written to `examples/benchmark/results/<scenario>.md`.

```bash
# OpenAI (default)
OPENAI_API_KEY=... pnpm benchmark:support
OPENAI_API_KEY=... pnpm benchmark:ecommerce
OPENAI_API_KEY=... pnpm benchmark:scheduling

# Anthropic
ANTHROPIC_API_KEY=... MODEL_PROVIDER=anthropic MODEL_NAME=claude-haiku-4-5-20251001 pnpm benchmark:support

# DeepSeek (the original benchmark that produced the findings above used DeepSeek)
MODEL_API_KEY=... MODEL_API_URL=https://api.deepseek.com/chat/completions MODEL_NAME=deepseek-chat pnpm benchmark:support
```

**Included scenarios:**
- `support-routing` — duplicate charge, expected: `create_refund_ticket(reason=duplicate_charge)`
- `ecommerce-cancel-order` — accidental order, expected: `cancel_order(reason=ordered_by_mistake)`
- `scheduling-reschedule` — reschedule appointment, expected: `reschedule_appointment`

## Architecture

LangDrift is zero-dependency TypeScript. Node runs `.ts` files directly (Node >= 24 with native strip-types). No build step.

```
CLI (cli.ts)
  → loadScenario (scenario.ts)       # parse YAML into Scenario type
  → runScenario (runner.ts)          # iterate locales sequentially
      → executeHttpTarget (httpTarget.ts)  # POST {locale, input, scenarioId} to agent URL
      → assertExpectedToolCall (assertions.ts)  # deterministic checks
  → formatTerminalReport (reportTerminal.ts)  # plain-text output
```

**HTTP contract** — LangDrift POSTs `{ locale, input, scenarioId }` to the target. The agent responds with `{ text, toolCalls, structured }`. Missing fields normalize to `""`, `[]`, `null`.

## Where this is going

The benchmark confirmed the problem is real and measurable. The next step is making LangDrift useful for teams beyond this repo — a proper getting-started flow, expanded assertions (JSON schema, response language, placeholder preservation), and eventually a CI integration.

The longer-term direction is a full eval system for multilingual agent workflows, with a locale matrix report that makes cross-language failures as easy to catch as a failing unit test.

See [RESEARCH.md](RESEARCH.md) for the full investigation.
