# LangDrift

A locale-aware eval harness for AI agent behavior.

LangDrift is a research-backed developer tool prototype. It starts with a question, tests it in a small reproducible setup, and turns the result into a CLI that agent teams can point at their own systems.

## The thesis

AI localization is moving from translated strings to localized behavior. When you build an AI agent, you're not just rendering UI text in multiple languages: your agent interprets intent, selects tools, and produces structured output. Those behaviors can drift silently across languages while your translation coverage looks fine.

The goal is not to publish a universal benchmark or rank languages. The goal is to make a product-shaped risk visible: English-only evals can pass while localized agent behavior fails at the tool-use boundary.

## The experiment

I ran 6 scenarios across 3 domains (support, ecommerce, scheduling) and 12 locales each, using a 5-tool-per-domain agent. The methodology: write and validate each English prompt to 3/3 pass first, then write equivalent natural-language phrasings in the other 11 languages. That controls for one obvious failure source: the base English scenario being ambiguous.

This is an applied experiment, not scientific evidence. It uses one model, one agent implementation, a small scenario set, and three iterations per locale. Read the results as a reproducible demonstration of a real risk, not as a ranking of languages, models, or agent architectures.

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

The interesting pattern is recurrence: Swahili fails in support routing, subscription cancellation, order tracking, and scheduling. Chinese fails in five of the six scenarios. That does not prove a universal language ranking, but it is exactly the kind of cross-locale behavior drift that English-only evals are blind to.

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

The full benchmark results are in `examples/benchmark/results/`.

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
- Run multiple iterations per locale with `--iterations N` and see aggregated pass rates
- Run a full directory of scenario files in one command for a locale × scenario matrix view
- Generate markdown matrix reports with `--format markdown`, suitable for PRs and QA review

## Design choices

- **Behavior over text.** LangDrift checks tool calls and structured behavior, not whether a reply sounds fluent.
- **Deterministic assertions first.** The current harness avoids LLM-as-judge so failures are explainable and CI-friendly.
- **HTTP contract over framework lock-in.** Any agent that can accept `POST { locale, input, scenarioId }` and return `{ text, toolCalls, structured }` can be tested.
- **Small, inspectable core.** The CLI is zero-dependency TypeScript running directly on Node >= 24.
- **Demo without API keys.** The fake agent makes the failure mode visible locally before anyone connects a real model.

## Project status

LangDrift is at v0.2: the CLI, scenario format, HTTP target contract, fake demo agent, model-backed example agent, JSON output, and checked-in benchmark reports are working. Multi-iteration runs, directory-level multi-scenario execution, and locale × scenario markdown matrix reports are now part of the core CLI.

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
langdrift run ./examples/scenarios/support-routing.yaml --target http://127.0.0.1:3010/api/agent
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
  → resolveScenarioPaths (runner.ts)   # file path or directory → [paths]
  → runScenario (runner.ts)            # iterate locales × iterations, aggregate pass rates
      → executeHttpTarget (httpTarget.ts)  # POST {locale, input, scenarioId} to agent URL
      → assertExpectedToolCall (assertions.ts)  # deterministic checks
  → runScenarios (runner.ts)           # multiple scenarios → MatrixResult
  → formatTerminalReport / formatTerminalMatrixReport (reportTerminal.ts)
  → formatJsonReport / formatJsonMatrixReport (reportJson.ts)
  → formatMarkdownRunReport / formatMarkdownMatrixReport (reportMarkdown.ts)
```

**CLI usage:**

```bash
langdrift init [scenario.yaml] [--template support|ecommerce|scheduling|generic]
langdrift run <scenario.yaml|dir> --target <url> [--iterations N] [--format text|json|markdown]
```

Pass a directory to run all `.yaml` files in it and produce a locale × scenario matrix. `--iterations N` repeats each locale N times and reports aggregated pass rates.

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

## More context

- [RESEARCH.md](RESEARCH.md): full investigation, limitations, and supporting research.
- [ROADMAP.md](ROADMAP.md): product direction and planned next steps.
