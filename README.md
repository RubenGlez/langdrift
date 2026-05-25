# LangDrift

A locale-aware eval harness for AI agent behavior.

LangDrift is a research-backed developer tool prototype. It starts with a question, tests it in a small reproducible setup, and turns the result into a CLI that agent teams can point at their own systems.

It answers a practical question: does your agent still choose the right tool when the same user intent arrives in another language?

## See it in 30 seconds

```bash
npm install -g langdrift
git clone https://github.com/RubenGlez/langdrift.git
cd langdrift
pnpm install
pnpm fake-agent
```

In another terminal:

```bash
langdrift run ./examples/scenarios/support-routing.yaml --target http://127.0.0.1:3011/api/agent
```

The fake agent intentionally drops tool calls for Swahili (`sw`) and Chinese (`zh`), so the demo shows the core failure mode without using an API key:

```text
Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 2 of 12 locales failed
```

## The thesis

AI localization is moving from translated strings to localized behavior. When you build an AI agent, you're not just rendering UI text in multiple languages: your agent interprets intent, selects tools, and produces structured output. Those behaviors can drift silently across languages while your translation coverage looks fine.

The goal is not to publish a universal benchmark or rank languages. The goal is to make a product-shaped risk visible: English-only evals can pass while localized agent behavior fails at the tool-use boundary.

## The experiment

I ran 6 scenarios across 3 domains (support, ecommerce, scheduling) and 12 locales each, using a 5-tool-per-domain agent. The methodology: write and validate each English prompt to 3/3 pass first, then write equivalent natural-language phrasings in the other 11 languages. That controls for one obvious failure source: the base English scenario being ambiguous.

This is an applied experiment, not scientific evidence. It uses one model, one agent implementation, a small scenario set, and three iterations per locale. Read the results as a reproducible demonstration of a real risk, not as a ranking of languages, models, or agent architectures.

**DeepSeek deepseek-chat — 3 iterations × 12 locales:**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | --------------- |
| support-routing | 86% (31/36) | sw (3/3), yo (1/3), zh (1/3) |
| support-cancel-subscription | 78% (28/36) | ru (1/3), sw (2/3), cy (2/3), yo (3/3) |
| ecommerce-cancel-order | 72% (26/36) | zh (3/3), eu (3/3), mn (1/3), yo (3/3) |
| ecommerce-track-order | 81% (29/36) | zh (3/3), vi (1/3), sw (3/3) |
| scheduling-reschedule | 78% (28/36) | ar (2/3), zh (1/3), sw (3/3), cy (1/3), eu (1/3) |
| scheduling-book-new | 92% (33/36) | zh (1/3), eu (1/3), mn (1/3) |

**claude-haiku-4-5-20251001 — 10 iterations × 12 locales:**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | --------------- |
| support-routing | 59% (71/120) | mn (1/10), sw (3/10), yo (3/10), vi (4/10), cy (5/10), eu (5/10), zh (6/10) |
| support-cancel-subscription | 68% (82/120) | yo (0/10), sw (1/10), mn (2/10), eu (4/10), cy (6/10) |
| ecommerce-cancel-order | 69% (83/120) | yo (0/10), cy (1/10), eu (2/10), zh (6/10), mn (6/10) |
| ecommerce-track-order | 46% (55/120) | mn (0/10), cy (1/10), eu (1/10), en (3/10), sw (4/10) |
| scheduling-reschedule | 88% (106/120) | sw (4/10), eu (7/10), mn (8/10) |
| scheduling-book-new | 40% (48/120) | id (0/10), sw (0/10), cy (0/10), fr (2/10), ar (4/10) |

**`ecommerce-track-order` fails in English too (3/10)** — the only scenario where English isn't near-perfect. This is a haiku model quality issue on that specific scenario, not locale drift. It shows up regardless of language.

All haiku failures are `no_tool_call` — the model often replies in text rather than using tools, especially for minority and low-resource languages. This contrasts with gpt-4o-mini which mostly fails on `wrong_argument`.

**gpt-4o-mini — 10 iterations × 12 locales:**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | --------------- |
| support-routing | 100% (120/120) | — |
| support-cancel-subscription | 100% (120/120) | — |
| ecommerce-cancel-order | 92% (110/120) | eu (10/10, wrong argument) |
| ecommerce-track-order | 100% (120/120) | — |
| scheduling-reschedule | 92% (110/120) | eu (10/10, no tool call) |
| scheduling-book-new | 0% (0/120) | all locales — model behavior difference (see below) |

English passed in every scenario on DeepSeek and gpt-4o-mini. claude-haiku-4-5-20251001 is the exception: English fails on `ecommerce-track-order` (3/10), which is a model quality issue on that scenario rather than locale drift.

**Basque (`eu`) is a consistent weak spot across all three models**, failing in multiple scenarios on DeepSeek, gpt-4o-mini, and claude-haiku. It is not model-specific. **Yoruba (`yo`), Mongolian (`mn`), Welsh (`cy`), and Swahili (`sw`) are also persistent failure points**, particularly on haiku where low-resource languages frequently produce `no_tool_call` instead of a structured response.

**`scheduling-book-new` at 0% is a model behavior difference, not locale drift.** The scenario expects the agent to check availability before booking. gpt-4o-mini interprets "I'd like to book my first appointment" as a direct booking request and calls `book_new_appointment` every time, in every language. DeepSeek took the more conservative `check_availability` path. Neither is strictly wrong — this is a scenario design question as much as a model quality question, and LangDrift surfaces it either way.

```text
Scenario: ecommerce-cancel-order (gpt-4o-mini, iteration 1)

Locale  Passed  Failure         Detail
en      1/1     -               cancel_order
fr      1/1     -               cancel_order
ar      1/1     -               cancel_order
zh      1/1     -               cancel_order
ru      1/1     -               cancel_order
id      1/1     -               cancel_order
vi      1/1     -               cancel_order
sw      1/1     -               cancel_order
cy      1/1     -               cancel_order
eu      0/1     wrong_argument  expected argument reason=ordered_by_mistake, got other
mn      1/1     -               cancel_order
yo      1/1     -               cancel_order

Result: failed, 1 of 12 locales failed
```

None of this is visible in English-only testing. English passes cleanly every time, which is precisely why these failures go undetected in practice.

The full benchmark results are in `examples/benchmark/results/`.

## What LangDrift does

LangDrift runs locale-specific scenarios against any HTTP agent and checks behavior, not just text. You write a YAML scenario with per-locale inputs and assertions. LangDrift calls your agent for each locale and reports pass/fail with failure mode classification.

Failure modes: `no_tool_call`, `wrong_tool`, `wrong_argument`, `missing_argument`, `forbidden_tool`, `wrong_sequence`, `wrong_language`.

## What works today

- Load a YAML scenario with per-locale inputs and assertions
- Call an HTTP agent target across multiple locales
- Assert required tool call name (single, `anyOf` list, or ordered `toolCalls` sequence)
- Assert required shallow tool arguments
- Assert forbidden tool calls did not happen
- Assert the response text is in the expected language with `responseLanguage` (Unicode script detection, no external deps; works well for non-Latin scripts; Latin locales get a weaker "no dominant foreign script" check)
- Report pass/fail with failure mode by locale in terminal output
- Report the same run as stable JSON for CI and tooling
- Exit non-zero on failure (CI-ready)
- Generate starter scenarios with `langdrift init --template support|ecommerce|scheduling|generic`
- Run multiple iterations per locale with `--iterations N` and see aggregated pass rates
- Run a full directory of scenario files in one command for a locale × scenario matrix view
- Generate markdown matrix reports with `--format markdown`, suitable for PRs and QA review
- Gate CI with `--min-pass-rate N` (exit non-zero below N% pass rate) and `--allow-fail <locale>` (exclude known-failing locales from exit code)
- Lint scenario files with `langdrift lint` — catches parse errors, single-locale scenarios, and inconsistent coverage across a directory
- Generate locale input drafts with `langdrift translate` using an LLM (OPENAI_API_KEY required); outputs YAML ready to paste, with a disclaimer that drafts need review

## Design choices

- **Behavior over text.** LangDrift checks tool calls and structured behavior, not whether a reply sounds fluent.
- **Deterministic assertions first.** The current harness avoids LLM-as-judge so failures are explainable and CI-friendly.
- **HTTP contract over framework lock-in.** Any agent that can accept `POST { locale, input, scenarioId }` and return `{ text, toolCalls, structured }` can be tested.
- **Small, inspectable core.** The CLI is zero-dependency TypeScript running directly on Node >= 24.
- **Demo without API keys.** The fake agent makes the failure mode visible locally before anyone connects a real model.

## Project status

LangDrift is an early public prototype on the `0.2.x` release line. The working feature set includes the CLI, scenario format, HTTP target contract, fake demo agent, model-backed example agent, JSON output, and checked-in benchmark reports. Multi-iteration runs, directory-level multi-scenario execution, locale × scenario markdown matrix reports, CI gate flags, scenario linting, LLM-assisted locale generation, and integration docs are all part of the core CLI. Assertions include `anyOf` alternatives, ordered `toolCalls` sequences, and `responseLanguage` script checks. Benchmark results are included for three models: DeepSeek deepseek-chat, gpt-4o-mini, and claude-haiku-4-5-20251001.

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
      responseLanguage: fr
```

`responseLanguage` checks that the agent's text reply is in the expected language using Unicode script detection. Useful for catching agents that always respond in English regardless of the input locale.

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

# DeepSeek
DEEPSEEK_API_KEY=... MODEL_PROVIDER=deepseek MODEL_NAME=deepseek-chat pnpm agent

# Any other OpenAI-compatible API
OPENAI_API_KEY=... MODEL_API_URL=https://api.together.xyz/v1/chat/completions MODEL_NAME=... pnpm agent

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

# Anthropic
ANTHROPIC_API_KEY=... MODEL_PROVIDER=anthropic MODEL_NAME=claude-haiku-4-5-20251001 pnpm benchmark:support

# DeepSeek
DEEPSEEK_API_KEY=... MODEL_PROVIDER=deepseek MODEL_NAME=deepseek-chat pnpm benchmark:support
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
langdrift run <scenario.yaml|dir> --target <url> [--iterations N] [--format text|json|markdown] [--min-pass-rate N] [--allow-fail <locale>]
langdrift lint <scenario.yaml|dir>
langdrift translate <scenario.yaml> [--locales fr,ar,zh,...] [--write]
```

Pass a directory to `run` to execute all `.yaml` files and produce a locale × scenario matrix. `--iterations N` repeats each locale N times. `--min-pass-rate N` exits non-zero only if the overall pass rate falls below N%. `--allow-fail <locale>` excludes a locale from the exit code (repeatable). See [CI integration](docs/ci.md) for GitHub Actions examples.

`langdrift lint` validates scenario files: parse errors exit 1, warnings (single locale, inconsistent coverage across a directory) exit 0.

`langdrift translate` calls an LLM to generate natural-language input drafts for new locales. Outputs a YAML snippet ready to paste into your scenario. Use `--write` to append directly to the file. Requires `OPENAI_API_KEY`. Generated phrasings are drafts — review before using in evals.

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
