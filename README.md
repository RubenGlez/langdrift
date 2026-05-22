# LangDrift

A locale-aware eval harness for AI agent behavior.

## The thesis

AI localization is moving from translated strings to localized behavior. When you build an AI agent, you're not just rendering UI text in multiple languages — your agent interprets intent, selects tools, and produces structured output. Those behaviors can drift silently across languages while your translation coverage looks fine.

I wanted to know how bad the drift actually is, so I ran a benchmark.

## The findings

I ran 6 scenarios across 3 domains (support, ecommerce, scheduling) and 12 locales each, using a 5-tool-per-domain agent backed by deepseek-chat. Each locale got a natural-language phrasing of the same intent — not a literal translation, verified for equivalent directness and natural phrasing before running. Three iterations per scenario, 36 locale checks each.

**Results (deepseek-chat, 3 iterations × 12 locales):**

| Scenario | Pass rate | Dominant failure |
| -------- | --------- | ---------------- |
| support-routing | 92% (33/36) | wrong_tool / no_tool_call (sw, mn, yo) |
| support-cancel-subscription | 61% (22/36) | no_tool_call (en, vi, sw, cy, yo) |
| ecommerce-cancel-order | 11% (4/36) | no_tool_call (11 of 12 locales) |
| ecommerce-track-order | 78% (28/36) | no_tool_call (zh, sw) |
| scheduling-reschedule | 39% (14/36) | no_tool_call (en, fr, zh, ru, vi) |
| scheduling-book-new | 100% (36/36) | — |

Three patterns stand out.

**Locale drift is real and correlated with training corpus coverage.** The support domain shows this most clearly: Arabic (high-resource, non-Latin script) passes consistently, while Swahili, Mongolian, and Yoruba fail regularly — not by misunderstanding the intent, but by routing to the wrong tool or dropping tool use entirely. The failures don't track speaker count; they track how well-represented the language is in instruction-tuning data.

```text
Scenario: support_routing (sample iteration)

Locale  Status  Failure       Detail
en      pass    -             create_refund_ticket
fr      pass    -             create_refund_ticket
ar      pass    -             create_refund_ticket
sw      fail    no_tool_call  expected create_refund_ticket, got no tool calls
cy      pass    -             create_refund_ticket
eu      pass    -             create_refund_ticket
mn      fail    wrong_tool    expected create_refund_ticket, got check_payment_status
yo      pass    -             create_refund_ticket
zh      pass    -             create_refund_ticket
ru      pass    -             create_refund_ticket
id      pass    -             create_refund_ticket
vi      pass    -             create_refund_ticket

Result: failed, 2 of 12 locales failed
```

**English is not always the strongest baseline.** In `support-cancel-subscription`, English failed all 3 iterations while French, Arabic, Chinese, and Russian passed consistently. The model appears more cautious about immediately acting on irreversible requests in English — it responds conversationally instead of calling `cancel_subscription`. This reversed the expected hierarchy. English-first testing would have given a false sense of baseline quality here.

**Tool-use consistency varies sharply by domain.** `ecommerce-cancel-order` failed at 89% — but French was the only language that passed, consistently, across all 3 iterations. Every other locale, including English, got no tool call. This isn't language drift; it's a language-specific behaviour pattern baked into the model. The scheduling domain shows a different failure mode: the model asks for more information (new time, confirmation) instead of acting on a clear reschedule intent, and this happens uniformly across locales.

```text
Scenario: ecommerce-cancel-order (sample iteration)

Locale  Status  Failure       Detail
en      fail    no_tool_call  expected cancel_order, got no tool calls
fr      pass    -             cancel_order
ar      fail    no_tool_call  expected cancel_order, got no tool calls
sw      fail    no_tool_call  expected cancel_order, got no tool calls
cy      fail    no_tool_call  expected cancel_order, got no tool calls
eu      fail    no_tool_call  expected cancel_order, got no tool calls
mn      fail    no_tool_call  expected cancel_order, got no tool calls
yo      fail    no_tool_call  expected cancel_order, got no tool calls
zh      fail    no_tool_call  expected cancel_order, got no tool calls
ru      fail    no_tool_call  expected cancel_order, got no tool calls
id      fail    no_tool_call  expected cancel_order, got no tool calls
vi      fail    no_tool_call  expected cancel_order, got no tool calls

Result: failed, 11 of 12 locales failed
```

All three failure types are invisible in English-only testing. Locale drift disappears because English passes. The English-baseline reversal is invisible because you'd never see it without the other locales. Domain-level tool-use collapse looks like a pass in English-only testing precisely because English is often the locale that refuses to act.

The full benchmark results are in `examples/benchmark/results/`. The original investigation and supporting research is in [RESEARCH.md](RESEARCH.md).

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

Run multi-iteration benchmarks across the six included scenarios (12 locales each). Results are written to `examples/benchmark/results/<scenario>.md`.

```bash
# OpenAI (default)
OPENAI_API_KEY=... pnpm benchmark:support
OPENAI_API_KEY=... pnpm benchmark:ecommerce
OPENAI_API_KEY=... pnpm benchmark:scheduling
OPENAI_API_KEY=... pnpm benchmark:support-cancel
OPENAI_API_KEY=... pnpm benchmark:ecommerce-track
OPENAI_API_KEY=... pnpm benchmark:scheduling-book

# Anthropic
ANTHROPIC_API_KEY=... MODEL_PROVIDER=anthropic MODEL_NAME=claude-haiku-4-5-20251001 pnpm benchmark:support

# DeepSeek (the original benchmark that produced the findings above used DeepSeek)
MODEL_API_KEY=... MODEL_API_URL=https://api.deepseek.com/chat/completions MODEL_NAME=deepseek-chat pnpm benchmark:support
```

**Included scenarios:**
- `support-routing` — duplicate charge, expected: `create_refund_ticket(reason=duplicate_charge)`
- `support-cancel-subscription` — explicit cancellation, expected: `cancel_subscription`
- `ecommerce-cancel-order` — accidental order, expected: `cancel_order(reason=ordered_by_mistake)`
- `ecommerce-track-order` — package tracking, expected: `check_order_status`
- `scheduling-reschedule` — move existing appointment, expected: `reschedule_appointment`
- `scheduling-book-new` — new customer with time preference, expected: `check_availability`

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
