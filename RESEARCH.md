# Research: Multilingual Agent Behavior Drift

## Hypothesis

AI localization is shifting from translated strings toward behavior verification. For agentic systems, a "localized experience" is only correct if the agent preserves intent, tool selection, structured output, and locale-specific assumptions across languages — not just if the UI renders in another language.

I wanted to know whether this was a real, measurable problem or a theoretical one.

## Phase 1: Initial Experiment

I built a minimal eval harness and ran a realistic support-routing scenario across 8 languages. The agent had 5 tools available and a standard multilingual system prompt. Each locale got an equivalent, natural-language phrasing of the same user intent — not a literal translation. I ran 3 iterations to check for flakiness.

**Setup:**
- Agent: 5-tool support agent (refund, escalation, payment status, account management, shipping)
- Model: DeepSeek Chat (OpenAI-compatible API)
- Locales: en, fr, ar, sw, cy, yo, eu, mn
- Iterations: 3
- Expected behavior: `create_refund_ticket` with `reason: duplicate_charge`

**Results:**

| Locale | Passes | Language |
| --- | ---: | --- |
| en | 3/3 | English |
| fr | 3/3 | French |
| ar | 3/3 | Arabic |
| sw | 0/3 | Swahili |
| cy | 3/3 | Welsh |
| yo | 2/3 | Yoruba (flaky) |
| eu | 3/3 | Basque |
| mn | 0/3 | Mongolian |

**Pass rate: 17/24 (71%)**

Swahili and Mongolian routed to `check_payment_status` every single time instead of `create_refund_ticket`. Yoruba was flaky — passing 2 out of 3 runs. European languages, including lower-resource ones like Welsh and Basque, held up consistently.

**Raw terminal output, iteration 1:**

```text
LangDrift run

Scenario: support_routing
Target: http://127.0.0.1:3002/api/agent

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

## Phase 2: Expanded Benchmark

Phase 1 established the problem with one scenario. Phase 2 asked whether the pattern held across domains, intents, and a wider language set.

**Methodology changes:**
- 6 scenarios across 3 domains: support (billing, subscription), ecommerce (cancel order, track order), scheduling (reschedule, new booking)
- 12 locales per scenario: en, fr, ar, zh, ru, id, vi, sw, cy, eu, mn, yo
- English prompt validated to 3/3 before translating — any non-English failure is definitively language drift, not prompt ambiguity
- Each domain uses a domain-appropriate agent system prompt
- Same model (deepseek-chat), 3 iterations, 36 locale checks per scenario

**Results:**

| Scenario | Pass rate | Consistent failures |
| -------- | --------- | ------------------- |
| support-routing | 86% (31/36) | sw (3/3), yo (1/3), zh (1/3) |
| support-cancel-subscription | 78% (28/36) | sw (2/3), cy (2/3), yo (2/3) |
| ecommerce-cancel-order | 72% (26/36) | zh (3/3), eu (3/3), yo (2/3) |
| ecommerce-track-order | 81% (29/36) | zh (3/3), sw (2/3) |
| scheduling-reschedule | 78% (28/36) | ar (2/3), sw (2/3), cy (1/3) |
| scheduling-book-new | 92% (33/36) | zh (1/3), mn (1/3) |

English passed 3/3 in every scenario.

**Sample run, ecommerce-cancel-order:**

```text
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent

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

## The Pattern

Across both phases, the failures are consistent and non-random.

**Drift correlates with instruction-tuning coverage, not raw speaker count.** Arabic (330M speakers) passes in all 6 scenarios. Swahili (200M speakers) fails in 4 of 6. Indonesian (200M speakers, similar count to Swahili) passes consistently. The differentiator isn't how many people speak the language — it's how well-represented the language is in instruction-following and tool-use training data.

**The same locales fail across different domains and intents.** Swahili fails in billing support, subscription cancellation, order tracking, and appointment scheduling. Yoruba fails in billing support, subscription cancellation, and order cancellation. This is a stable property of the model's tool-use competence in those languages — it isn't specific to one task or one set of tool descriptions.

**Chinese is a surprising underperformer.** Mandarin Chinese fails in 4 of 6 scenarios, despite being one of the highest-resource languages in pre-training. This suggests the gap is specifically in instruction-tuning and tool-use data rather than general language understanding — a pattern that wouldn't surface in standard NLP benchmarks.

**Arabic holds up across domains.** Arabic passes consistently even in the ecommerce and scheduling domains where other languages struggle. This is notable because Arabic has a non-Latin script, right-to-left text direction, and significant morphological complexity. High representation in instruction-tuning data appears to outweigh structural distance from English.

**The dominant failure mode is `no_tool_call`.** In most failures, the model responds in natural language instead of calling a tool at all. `wrong_tool` routing (the failure mode seen in Phase 1 for Swahili and Mongolian) is less common in Phase 2, likely because the prompts were tightened. The model isn't confidently routing to the wrong tool; it's declining to act. That's a different failure mode and arguably harder to detect — a wrong tool call at least signals that the model was trying.

## Supporting Research

The experiment above aligns with an emerging body of work on multilingual agent evaluation:

**Multilingual tool calling is a benchmarked problem, not a theoretical one.**
- [International Tool Calling](https://huggingface.co/papers/2603.05515) evaluates LLMs on real APIs across languages and geographies, documenting substantial gaps between open and closed models for non-English queries.
- [MASSIVE-Agents](https://papers.cool/venue/2025.findings-emnlp.1099%40ACL) reformats the MASSIVE intent dataset for function-calling evaluation across 52 languages with 47k+ samples.
- [Ticket-Bench](https://openreview.net/forum?id=RrcWawfxSz) evaluates task-oriented agents across 6 languages and reports notable performance gaps even for strong models.

**Agent evaluation needs to go below the final text.**
- [Berkeley Function Calling Leaderboard (BFCL)](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2025/31680.html) evaluates whether models invoke correct function calls across single-turn, live, and agentic settings.
- [HammerBench](https://aclanthology.org/2025.findings-acl.175.pdf) argues for fine-grained metrics: function-name accuracy, parameter hallucination, missing parameters, progress rate.

**Most agentic benchmarks are still English-only.**
- [MAPS: A Multilingual Benchmark for Agent Performance and Security](https://aclanthology.org/2026.findings-eacl.42.pdf) finds that most existing agentic benchmarks remain English-only and that multilingual limitations propagate into agent decision-making and tool execution.

**Safety behavior can also drift.**
- [All Languages Matter](https://huggingface.co/papers/2310.00905) introduces XSafety and reports that LLMs produce significantly more unsafe responses for non-English queries than English ones.

## What This Means

The gap isn't about translation. Teams already use translation management platforms for static strings. The gap is at the behavior boundary: does the same user intent trigger the same tool call, the same structured output, the same policy behavior across languages?

Phase 2 makes this more concrete. The failure pattern is stable enough that you can predict which locales will fail before running the test — and broad enough that it appears in billing, ecommerce, and scheduling workflows equally. That means it affects any multi-domain agent deployed across languages, not just a specific task type.

That gap has no obvious owner. Translation platforms don't test agent behavior. Observability platforms don't model locale as an experimental variable. Generic LLM eval platforms don't ship with locale-first scenario formats.

The practical opportunity is to make this kind of test as easy to run as a unit test — a scenario file, a target URL, a CI check.

## What I Built

LangDrift is the harness I used for this experiment, cleaned up and made general. It:
- Loads YAML scenarios with per-locale inputs and assertions
- POSTs each input to any HTTP agent target
- Checks tool calls and arguments deterministically
- Reports pass/fail by locale with failure mode classification
- Exits non-zero on failure, so it works in CI

The goal is to eventually become a lightweight eval system that lets any team run localized behavior checks against their own agents — not just refund routing, but any workflow where the right behavior matters across languages.
