# LangDrift

A locale-aware eval harness for AI agent behavior.

## The thesis

AI localization is moving from translated strings to localized behavior. When you build an AI agent, you're not just rendering UI text in multiple languages: your agent interprets intent, selects tools, and produces structured output. Those behaviors can drift silently across languages while your translation coverage looks fine.

I wanted to know whether that drift was observable in a small, controlled agent setup, so I ran a benchmark.

## The experiment

I ran 6 scenarios across 3 domains (support, ecommerce, scheduling) and 12 locales each, using a 5-tool-per-domain agent. The methodology: write and validate each English prompt to 3/3 pass first, then write equivalent natural-language phrasings in the other 11 languages. That controls for one obvious failure source: the base English scenario being ambiguous. It does not make the results scientific proof, but it does make language-conditioned drift visible and measurable in this setup. Three iterations per scenario, 36 locale checks each.

**Results (3 iterations × 12 locales):**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | --------------- |
| support-routing | 86% (31/36) | sw (3/3), yo (1/3), zh (1/3) |
| support-cancel-subscription | 78% (28/36) | ru (1/3), sw (2/3), cy (2/3), yo (3/3) |
| ecommerce-cancel-order | 72% (26/36) | zh (3/3), eu (3/3), mn (1/3), yo (3/3) |
| ecommerce-track-order | 81% (29/36) | zh (3/3), vi (1/3), sw (3/3) |
| scheduling-reschedule | 78% (28/36) | ar (2/3), zh (1/3), sw (3/3), cy (1/3), eu (1/3) |
| scheduling-book-new | 92% (33/36) | zh (1/3), eu (1/3), mn (1/3) |

English passed 3/3 in every scenario. The failures are language-specific within this model, prompt, and tool setup.

**Failures cluster around the same locales across unrelated domains.** Indonesian, French, and English pass consistently. Swahili and Yoruba fail regularly: the model either routes to the wrong tool or drops tool use entirely. Chinese fails more than expected given its resource level, which may suggest the gap is specifically in instruction-tuning and tool-use data. These observations are from a single model and a small number of iterations, so they point at hypotheses rather than conclusions.

```text
Scenario: support_routing (sample iteration)

Locale  Status  Failure       Detail
en      pass    -             create_refund_ticket
fr      pass    -             create_refund_ticket
ar      pass    -             create_refund_ticket
sw      fail    no_tool_call  expected create_refund_ticket, got no tool calls
cy      pass    -             create_refund_ticket
eu      pass    -             create_refund_ticket
mn      pass    -             create_refund_ticket
yo      pass    -             create_refund_ticket
zh      fail    no_tool_call  expected create_refund_ticket, got no tool calls
ru      pass    -             create_refund_ticket
id      pass    -             create_refund_ticket
vi      pass    -             create_refund_ticket

Result: failed, 2 of 12 locales failed
```

**The failures recur across domains and intents.** Swahili fails in support routing, subscription cancellation, order tracking, and scheduling. Chinese fails in five of the six scenarios. That does not prove a universal language ranking, but it is exactly the kind of repeated cross-locale failure pattern that English-only evals are blind to.

```text
Scenario: ecommerce-cancel-order (sample iteration)

Locale  Status  Failure       Detail
en      pass    -             cancel_order
fr      pass    -             cancel_order
ar      pass    -             cancel_order
zh      fail    no_tool_call  expected cancel_order, got no tool calls
ru      pass    -             cancel_order
id      pass    -             cancel_order
vi      pass    -             cancel_order
sw      pass    -             cancel_order
cy      pass    -             cancel_order
eu      fail    no_tool_call  expected cancel_order, got no tool calls
mn      pass    -             cancel_order
yo      fail    no_tool_call  expected cancel_order, got no tool calls

Result: failed, 3 of 12 locales failed
```

None of this is visible in English-only testing. English passes cleanly every time, which is precisely why these failures go undetected in practice.

The full benchmark results are in `examples/benchmark/results/`. The original investigation and supporting research is in [RESEARCH.md](RESEARCH.md).

## How to read this

This is an applied experiment, not scientific evidence. The benchmark uses one model, one agent implementation, a small scenario set, and three iterations per locale. The results should be read as a product-shaped demonstration of a real risk: multilingual agents can preserve text-level localization while drifting at the behavior boundary.

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
- Report the same run as stable JSON for CI and tooling
- Exit non-zero on failure (CI-ready)
- Generate starter scenarios with `langdrift init --template support|ecommerce|scheduling|generic`
- Run multi-iteration benchmarks, write markdown reports with per-locale failure tables

## Quick start

**Install:**

```bash
npm install -g langdrift
```

Requires Node >= 24 (LangDrift runs TypeScript directly via Node's built-in type stripping).

**Try the no-key demo:**

Clone this repo, then in one terminal:

```bash
pnpm fake-agent
```

In another terminal:

```bash
langdrift run ./examples/scenarios/support-routing.yaml --target http://127.0.0.1:3011/api/agent
```

The fake agent intentionally drops tool calls for a couple of locales, so the run shows the core LangDrift failure mode without calling any model provider.

Expected result: the run exits non-zero and reports `2 of 12 locales failed`.

**1. Create a starter scenario:**

```bash
langdrift init ./my-scenario.yaml --template support
```

Then edit the generated YAML:

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

Your agent needs to accept `POST /api/agent` with `{ locale, input, scenarioId }` and respond with `{ text, toolCalls, structured }`. See [HTTP target contract](#http-target-contract) below.

**3. Run:**

```bash
langdrift run ./my-scenario.yaml --target http://127.0.0.1:3010/api/agent
```

For CI or downstream tooling, emit JSON:

```bash
langdrift run ./my-scenario.yaml --target http://127.0.0.1:3010/api/agent --format json
```

## Example agent

The repo includes two local agents:

- `pnpm fake-agent`: deterministic demo agent, no API key required.
- `pnpm agent`: model-backed agent for OpenAI, Anthropic, or any OpenAI-compatible API.

The model-backed agent defaults to OpenAI but supports any OpenAI-compatible API or Anthropic.

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

# Reproduce a checked-in report; swap the benchmark script for each scenario
ITERATIONS=3 MODEL_API_KEY=... MODEL_API_URL=https://api.deepseek.com/chat/completions MODEL_NAME=deepseek-chat pnpm benchmark:support

# Anthropic
ANTHROPIC_API_KEY=... MODEL_PROVIDER=anthropic MODEL_NAME=claude-haiku-4-5-20251001 pnpm benchmark:support

# Any OpenAI-compatible API
MODEL_API_KEY=... MODEL_API_URL=https://api.example.com/chat/completions MODEL_NAME=model-name pnpm benchmark:support
```

**Included scenarios:**
- `support-routing`: duplicate charge, expected: `create_refund_ticket(reason=duplicate_charge)`
- `support-cancel-subscription`: explicit cancellation, expected: `cancel_subscription`
- `ecommerce-cancel-order`: accidental order, expected: `cancel_order(reason=ordered_by_mistake)`
- `ecommerce-track-order`: package tracking, expected: `check_order_status`
- `scheduling-reschedule`: move existing appointment, expected: `reschedule_appointment`
- `scheduling-book-new`: new customer with time preference, expected: `check_availability`

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

**CLI usage:**

```bash
langdrift init [scenario.yaml] [--template support|ecommerce|scheduling|generic]
langdrift run <scenario.yaml> --target <url> [--format text|json]
```

## HTTP target contract

LangDrift makes a `POST` request to your agent for each locale in the scenario.

**Request** (`Content-Type: application/json`):

```json
{
  "locale": "fr",
  "input": "J'ai été facturé deux fois. Pouvez-vous me rembourser un paiement?",
  "scenarioId": "refund_request"
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `locale` | string | BCP 47 locale tag from the scenario (e.g. `en`, `fr`, `zh`) |
| `input` | string | The user message for this locale |
| `scenarioId` | string | The `id` field from the scenario YAML |

**Response** (`Content-Type: application/json`):

```json
{
  "text": "I can help you with that refund.",
  "toolCalls": [
    {
      "name": "create_refund_ticket",
      "arguments": {
        "reason": "duplicate_charge"
      }
    }
  ],
  "structured": null
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `text` | string | The agent's text reply. Can be empty. Missing defaults to `""`. |
| `toolCalls` | array | Tool calls the agent made. Each item must have `name` (string). `arguments` is optional. Missing defaults to `[]`. |
| `structured` | any | Optional structured output for schema assertions. Missing defaults to `null`. |

**No-tool-call response** (agent replied in text only):

```json
{
  "text": "I'm not sure how to help with that.",
  "toolCalls": [],
  "structured": null
}
```

Extra fields in the response body are ignored. Tool call items without a `name` string are silently dropped. The response status must be `2xx`; any non-2xx status is treated as a target error and fails all assertions for that locale.

## Where this is going

The benchmark makes the problem concrete: multilingual agent quality needs behavior-level evals, not only translated UI strings. The immediate next step is the locale matrix: an aggregate view across scenarios and iterations that surfaces cross-language failure patterns as clearly as a CI report. After that, lower-friction integration for common agent frameworks and a basic CI gate.

See [ROADMAP.md](ROADMAP.md) for the full plan.

See [RESEARCH.md](RESEARCH.md) for the full investigation.
