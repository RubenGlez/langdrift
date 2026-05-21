# LangDrift

LangDrift is a locale-aware eval harness for AI workflows.

Core belief:

> AI localization is moving from translated strings to localized behavior.

Traditional i18n asks whether the product text exists in another language.
LangDrift asks whether an AI workflow still behaves correctly when the user
speaks another language, uses another region, or expects another cultural norm.

## What It Tests

LangDrift helps developers detect cross-locale behavior drift in:

- agent tool calls
- tool arguments
- structured outputs
- generated product copy
- response language
- placeholders
- glossary and brand terms
- locale-specific formatting
- policy and safety behavior

## Why This Matters

AI-powered products do not only render strings. They make decisions, call tools,
produce structured data, and generate dynamic responses. Those behaviors can
change when the same user intent is expressed in another language.

Example:

```text
English user asks for refund  -> create_refund_ticket
Spanish user asks for refund  -> create_refund_ticket
French user asks for refund   -> no tool call
Japanese user asks for refund -> invalid structured output
```

That is the kind of failure LangDrift should make visible.

## What Works Today

LangDrift can:

- load a YAML scenario
- call an HTTP agent target across multiple locales
- assert required tool calls and shallow tool arguments
- assert forbidden tool calls did not happen
- report pass/fail by locale in plain terminal output
- exit non-zero on failure

## Demo

LangDrift ships with a DeepSeek-backed agent that demonstrates real cross-locale
tool-call drift. With equivalent natural phrasing across 8 languages, Swahili
and Mongolian consistently route to the wrong tool while European and Arabic
locales pass.

```bash
DEEPSEEK_API_KEY=... pnpm benchmark:deepseek-realistic
```

Expected result:

```text
LangDrift run

Scenario: deepseek_realistic_routing
Target: http://127.0.0.1:3002/api/agent

Locale  Status  Detail
en      pass    create_refund_ticket
fr      pass    create_refund_ticket
ar      pass    create_refund_ticket
sw      fail    expected create_refund_ticket, got check_payment_status
cy      pass    create_refund_ticket
yo      fail    expected create_refund_ticket, got no tool calls
eu      pass    create_refund_ticket
mn      fail    expected create_refund_ticket, got check_payment_status
```

See [DeepSeek Demo](docs/deepseek-demo.md).

## Documents

- [Mission, Vision, And Principles](docs/mission-vision-principles.md)
- [Agent i18n Product Notes](docs/agent-i18n-product-notes.md)
- [Research Brief](docs/research-brief-agent-i18n.md)
- [Core Workflow](docs/core-workflow.md)
- [DeepSeek Demo](docs/deepseek-demo.md)
- [Roadmap](docs/roadmap.md)

## Working Definition

LangDrift is successful if it becomes the simplest way for a developer to answer:

> Did this AI workflow still work when the user used another language?
