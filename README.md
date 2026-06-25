# LangDrift

[![npm version](https://img.shields.io/npm/v/langdrift)](https://www.npmjs.com/package/langdrift)
[![node](https://img.shields.io/node/v/langdrift)](https://www.npmjs.com/package/langdrift)

Locale-aware evals for AI agent behavior.

LangDrift checks whether an AI agent preserves behavior across languages: tool selection, tool arguments, response script, and failure modes. It is built for teams who already test their agent in English and want to know what changes when the same intent arrives in French, Arabic, Chinese, Basque, Swahili, or any other locale.

The core question:

> Does your agent still choose the right tool when the same user intent arrives in another language?

## See It In 30 Seconds

**No API key required.** Clone the repo, start the fake agent, and run a scenario:

```bash
git clone https://github.com/RubenGlez/langdrift.git
cd langdrift
pnpm install
pnpm fake-agent
```

In another terminal:

```bash
node ./src/cli.ts run ./examples/scenarios/support-routing.yaml --target http://127.0.0.1:3011/api/agent
```

**Testing your own agent?** Install globally and point it at your endpoint:

```bash
npm install -g langdrift
langdrift run ./my-scenario.yaml --target http://localhost:3010/api/agent
```

The fake agent intentionally drops tool calls for Swahili (`sw`) and Chinese (`zh`), so the demo shows the core failure mode without using an API key:

```text
Locale  Passed  Failure       Detail
en      1/1     -             create_refund_ticket
sw      0/1     no_tool_call  expected create_refund_ticket, got no tool calls
zh      0/1     no_tool_call  expected create_refund_ticket, got no tool calls

Result: failed, 2 of 12 locales failed
```

## Why This Exists

AI localization is moving from translated strings to localized behavior. For an agent, a localized experience is only correct if the agent preserves intent, tool selection, and tool arguments across languages.

In the included benchmark, English often passed while equivalent prompts in Basque, Yoruba, Swahili, Chinese, Welsh, and Mongolian triggered missing tool calls, wrong tool arguments, or different tool-use behavior. The strongest signal is that several of these weaknesses recur across three independently trained models, which is harder to dismiss than any single per-locale rate. This is not a universal language ranking; it is a reproducible demonstration that agent behavior can drift across locales.

Read the full methodology, results, limitations, and supporting papers in [RESEARCH.md](RESEARCH.md).

## What It Does

- Runs YAML scenarios with per-locale user inputs.
- Sends each locale to any HTTP agent target.
- Checks tool calls, shallow arguments, forbidden tools, ordered tool-call sequences, and response script.
- Reports pass/fail by locale with failure mode classification.
- Emits terminal, JSON, or markdown reports.
- Exits non-zero on failure, so it works in CI.
- Supports repeated runs with `--iterations N`.
- Supports directory-level scenario runs for locale x scenario matrices.
- Provides `lint` and LLM-assisted `translate` commands for scenario maintenance.

Failure modes include `no_tool_call`, `wrong_tool`, `wrong_argument`, `missing_argument`, `forbidden_tool`, `wrong_sequence`, and `wrong_language`.

## Install

```bash
npm install -g langdrift
```

Requires Node >= 24. LangDrift runs TypeScript directly via Node's native type stripping, so there is no build step. Node 22.6+ also works if you pass `--experimental-strip-types` when invoking the CLI directly, but the global install expects Node 24.

## Quick Start

Create a starter scenario:

```bash
langdrift init ./my-scenario.yaml --template support
```

Edit the generated YAML:

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

Run it against your agent:

```bash
langdrift run ./my-scenario.yaml --target http://127.0.0.1:3010/api/agent
```

Emit JSON for tooling:

```bash
langdrift run ./my-scenario.yaml --target http://127.0.0.1:3010/api/agent --format json
```

Run a directory of scenarios:

```bash
langdrift run ./scenarios --target http://127.0.0.1:3010/api/agent --iterations 3 --format markdown
```

## Assertions

### Tool arguments

Argument values are matched with scalar-normalized equality, so a JSON number `2` matches `"2"` and a boolean `true` matches `"true"`.

Tool arguments must be **canonical identifiers or enums**, not free text. Agents tend to echo the user's language into free-text argument values, so an assertion like `reason: duplicate_charge` will report a false `wrong_argument` when a localized request produces `reason: "doble cargo"`. Model your tools to emit canonical values, or accept several with `oneOf`:

```yaml
expect:
  toolCall:
    name: create_refund_ticket
    arguments:
      reason:
        oneOf: [duplicate_charge, double_charge]
```

`oneOf` is an inline list and must contain at least one value; `langdrift lint` reports an error otherwise.

### Response script

`responseLanguage` is a **script-family check**, not language detection. It confirms a reply uses the script a locale is written in (for example, that an `ar` reply is in Arabic script). It cannot distinguish languages that share a script: a `fr` assertion passes for any Latin-script reply, and `ar` cannot be told apart from `fa` or `ur`. For a locale whose script LangDrift cannot determine, the check passes rather than guessing.

## HTTP Target Contract

LangDrift makes a `POST` request to your agent for each locale.

Request:

```json
{
  "locale": "fr",
  "input": "J'ai été facturé deux fois. Pouvez-vous me rembourser un paiement?",
  "scenarioId": "refund_request"
}
```

Response:

```json
{
  "text": "Je peux vous aider avec ce remboursement.",
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

Response fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `text` | string | Agent text reply. Missing defaults to `""`. |
| `toolCalls` | array | Tool calls made by the agent. Each item must have `name`; `arguments` is optional. Missing defaults to `[]`. |
| `structured` | any | Optional structured output. Missing defaults to `null`. |

Extra response fields are ignored. Non-2xx responses fail the locale.

See [docs/integrations.md](docs/integrations.md) for OpenAI SDK, Vercel AI SDK, LangChain, Anthropic, and Fastify examples.

## CLI

```bash
langdrift init [scenario.yaml] [--template support|ecommerce|scheduling|generic]
langdrift run <scenario.yaml|dir> --target <url> [--iterations N] [--format text|json|markdown] [--min-pass-rate N] [--allow-fail <locale>]
langdrift lint <scenario.yaml|dir>
langdrift translate <scenario.yaml> [--locales fr,ar,zh,...] [--write]
```

Useful CI flags:

- `--min-pass-rate N`: fail only if the overall pass rate is below `N`.
- `--allow-fail <locale>`: keep reporting a known weak locale without letting it fail the build.
- `--format markdown`: write a table suitable for GitHub Actions summaries or PR comments.

See [docs/ci.md](docs/ci.md) for GitHub Actions examples.

## Example Agents

The repo includes two local agents:

- `pnpm fake-agent`: deterministic demo agent, no API key required.
- `pnpm agent`: model-backed agent for OpenAI, Anthropic, DeepSeek, or any OpenAI-compatible API.

```bash
# OpenAI
OPENAI_API_KEY=... pnpm agent

# Anthropic
ANTHROPIC_API_KEY=... MODEL_PROVIDER=anthropic MODEL_NAME=claude-haiku-4-5-20251001 pnpm agent

# DeepSeek
DEEPSEEK_API_KEY=... MODEL_PROVIDER=deepseek MODEL_NAME=deepseek-chat pnpm agent

# Choose domain: support (default), ecommerce, scheduling
DOMAIN=ecommerce OPENAI_API_KEY=... pnpm agent
```

Then run a scenario:

```bash
langdrift run ./examples/scenarios/support-routing.yaml --target http://127.0.0.1:3010/api/agent
```

## Design Choices

- **Behavior over text.** LangDrift checks tool calls and structured behavior, not whether a reply sounds fluent.
- **Deterministic assertions first.** No LLM-as-judge in the core loop; failures are explainable and CI-friendly.
- **HTTP contract over framework lock-in.** Any agent that can accept one POST request can be tested.
- **Small, inspectable core.** Zero runtime dependencies, TypeScript source, Node >= 24.
- **Demo without API keys.** The fake agent makes the failure mode visible locally before connecting a real model.

## More Context

- [RESEARCH.md](RESEARCH.md): full experiment, results, limitations, and supporting research.
- [docs/ci.md](docs/ci.md): CI integration examples.
- [docs/integrations.md](docs/integrations.md): agent adapter examples.
