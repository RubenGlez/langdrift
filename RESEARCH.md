# Research: Multilingual Agent Behavior Drift

## Hypothesis

AI localization is shifting from translated strings toward behavior verification. For agentic systems, a "localized experience" is only correct if the agent preserves intent, tool selection, structured output, and locale-specific assumptions across languages — not just if the UI renders in another language.

I wanted to know whether this was a real, measurable problem or a theoretical one.

## The Experiment

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

## The Pattern

The failures weren't random. They correlated with linguistic distance from the model's training corpus, not with speaker count. Arabic (330M speakers) passed every time. Swahili (200M speakers) failed every time. Welsh (~700K speakers) passed every time. The differentiator appears to be morphological structure and script, not just data volume.

The agent wasn't failing to understand the user. It was routing the request to a plausible-but-wrong tool — a different kind of failure than a simple comprehension error. This is the kind of drift that gets missed in English-first testing.

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
