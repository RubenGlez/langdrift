# Research: Multilingual Agent Behavior Drift

## The question

AI localization is shifting from translated strings toward behavior verification. For agentic systems, a "localized experience" is only correct if the agent preserves intent, tool selection, and structured output across languages, not just if the UI renders in another language.

I wanted to know whether this was a measurable problem or a theoretical one, so I ran an experiment.

## The experiment

I built a minimal eval harness and ran scenarios across 3 domains and 12 locales. Each domain had a dedicated agent with 5 tools and a domain-appropriate system prompt. The methodology: write and validate each English prompt to 3/3 pass first, then write equivalent natural-language phrasings in the other 11 languages. This reduces one obvious confounder: an ambiguous base task. The remaining failures are not proof of a universal language effect, but they are evidence of language-conditioned behavior drift in this concrete setup.

**Setup:**
- 6 scenarios across 3 domains: support (billing, subscription), ecommerce (cancel order, track order), scheduling (reschedule, new booking)
- 12 locales per scenario: en, fr, ar, zh, ru, id, vi, sw, cy, eu, mn, yo
- 10 iterations per scenario for each model
- English baseline confirmed before any other locale was tested

**Results — gpt-4o-mini (10 iterations × 12 locales):**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | ------------------- |
| support-routing | 100% (120/120) | — |
| support-cancel-subscription | 100% (120/120) | — |
| ecommerce-cancel-order | 92% (110/120) | eu (0/10, wrong_argument) |
| ecommerce-track-order | 100% (120/120) | — |
| scheduling-reschedule | 92% (110/120) | eu (0/10, no_tool_call) |
| scheduling-book-new | 0% (0/120) | all locales — model behavior difference (see below) |

**Results — claude-haiku-4-5-20251001 (10 iterations × 12 locales):**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | ------------------- |
| support-routing | 59% (71/120) | mn (1/10), sw (3/10), yo (3/10), vi (4/10), cy (5/10), eu (5/10), zh (6/10) |
| support-cancel-subscription | 68% (82/120) | yo (0/10), sw (1/10), mn (2/10), eu (4/10), cy (6/10) |
| ecommerce-cancel-order | 69% (83/120) | yo (0/10), cy (1/10), eu (2/10), zh (6/10), mn (6/10) |
| ecommerce-track-order | 46% (55/120) | mn (0/10), cy (1/10), eu (1/10), en (3/10), sw (4/10) |
| scheduling-reschedule | 88% (106/120) | sw (4/10), eu (7/10), mn (8/10) |
| scheduling-book-new | 40% (48/120) | id (0/10), sw (0/10), cy (0/10), fr (2/10), ar (4/10) |

**Results — DeepSeek deepseek-chat (10 iterations × 12 locales):**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | ------------------- |
| support-routing | 84% (101/120) | mn (1/10), cy (2/10), sw (9/10), zh (9/10) |
| support-cancel-subscription | 62% (74/120) | zh (0/10), eu (0/10), sw (1/10), id (2/10), ar (3/10) |
| ecommerce-cancel-order | 57% (69/120) | zh (0/10), ru (0/10), eu (0/10), yo (0/10), sw (3/10), en (8/10) |
| ecommerce-track-order | 42% (50/120) | ar (0/10), zh (0/10), vi (0/10), sw (0/10), fr (1/10), yo (1/10), mn (3/10) |
| scheduling-reschedule | 64% (77/120) | ar (0/10), zh (0/10), sw (0/10, wrong tool), id (1/10), mn (8/10) |
| scheduling-book-new | 93% (112/120) | eu (2/10) |

English is not a perfect baseline on every model. It passes every scenario on gpt-4o-mini except the model-behavior divergence in `scheduling-book-new`, while claude-haiku misses `ecommerce-track-order` in 7/10 runs and DeepSeek misses `ecommerce-cancel-order` in 2/10 runs. That matters: LangDrift surfaces both locale drift and scenario/model reliability issues.

## Limitations

This is an applied experiment, not a scientific claim.

**Three models, one architecture.** The benchmark now covers gpt-4o-mini, claude-haiku-4-5-20251001, and DeepSeek deepseek-chat via the same HTTP agent wrapper with the same system prompt and tool set. Cross-model patterns (Basque, Yoruba, low-resource language clusters) are therefore more credible than when a single model was used. However, the agent architecture is still simple: single-turn, 5 tools per domain, no RAG, no multi-turn context. More complex setups may show different failure patterns.

**Small sample, but comparable across models.** Each scenario/model/locale cell now uses 10 iterations. That is enough to expose repeated failure patterns and reduce single-run noise, but it is still not a large-sample statistical benchmark.

**Unreviewed locale prompts.** The locale inputs were written by one author to preserve intent but were not reviewed by native speakers. Some failures may reflect phrasing gaps rather than model behavior. This is acknowledged as a real threat to validity, but native review at scale is not practical for a solo project. Results should be interpreted with that caveat explicitly in mind.

The result is best read as a reproducible demonstration of a real risk, not as a ranking of languages, models, or agent architectures.

**Sample run, ecommerce-cancel-order (DeepSeek, 1 iteration):**

```text
LangDrift run

Scenario: ecommerce_cancel_order
Target: http://127.0.0.1:3010/api/agent
Iterations: 1

Locale  Passed  Failure       Detail
en      1/1     -             cancel_order
fr      1/1     -             cancel_order
ar      1/1     -             cancel_order
zh      0/1     no_tool_call  expected cancel_order, got no tool calls
ru      0/1     no_tool_call  expected cancel_order, got no tool calls
id      1/1     -             cancel_order
vi      1/1     -             cancel_order
sw      1/1     -             cancel_order
cy      1/1     -             cancel_order
eu      0/1     no_tool_call  expected cancel_order, got no tool calls
mn      1/1     -             cancel_order
yo      0/1     no_tool_call  expected cancel_order, got no tool calls

Result: failed, 4 of 12 locales failed
```

## What we observed

These observations now cover three models and 10 iterations per locale. They suggest hypotheses worth testing more rigorously, not conclusions.

**Some locale weaknesses are model-independent.** Basque (`eu`) fails in multiple scenarios on all three models. Swahili (`sw`), Yoruba (`yo`), Mongolian (`mn`), Welsh (`cy`), and Chinese (`zh`) also recur across at least two models, though the exact failure mode varies by model and scenario. This cross-model pattern is harder to dismiss as a single model's training quirk.

**Speaker count doesn't predict failures.** High-speaker-count languages are not automatically safe: Arabic and Indonesian both fail heavily on some DeepSeek scenarios, while gpt-4o-mini handles them cleanly in most cases. Swahili and Yoruba also fail regularly. Whatever drives failures in this setup, raw speaker count alone doesn't explain it.

**Chinese underperforms relative to expectations on weaker models.** Mandarin Chinese fails in 5 of 6 scenarios on DeepSeek and shows significant failure rates on claude-haiku. gpt-4o-mini handles Chinese well, which suggests Chinese support is present but unevenly distributed across models. Most NLP benchmarks treat Chinese as high-resource, which makes this worth watching in agentic contexts.

**The dominant failure mode on DeepSeek and haiku is `no_tool_call`.** Both models frequently reply in text rather than invoking a tool, especially outside their stronger locale/scenario combinations. gpt-4o-mini is different: its most interesting failures are usually `wrong_argument` or a consistent `wrong_tool` behavior difference. A text response that declines to act is arguably harder to catch in production than a wrong argument — it looks like a normal reply.

**gpt-4o-mini is highly reliable but has model-specific behavior differences.** It achieves 100% on four of six scenarios, but `scheduling-book-new` fails at 0% across all locales: the model interprets "I'd like to book my first appointment" as a direct booking request and calls `book_new_appointment` every time, rather than the expected `check_availability` path. DeepSeek takes the conservative path. Neither is strictly wrong, but LangDrift surfaces the divergence regardless.

**English baselines matter.** English fails on DeepSeek `ecommerce-cancel-order` (8/10) and on haiku `ecommerce-track-order` (3/10). Those are not locale-drift findings; they are scenario/model reliability findings. Keeping English in the matrix helps separate "this model is unreliable on the workflow" from "this workflow drifts across locales."

**Most of this is invisible in English-only testing.** English is still much stronger than many other locales in this setup, but English-only evals would miss the large cross-locale failures in Basque, Chinese, Swahili, Yoruba, Mongolian, Welsh, Arabic, Indonesian, and Vietnamese.

## Supporting research

The experiment above aligns with an emerging body of work on multilingual agent evaluation:

**Multilingual tool calling is a benchmarked problem, not a theoretical one.**
- [International Tool Calling](https://huggingface.co/papers/2603.05515) evaluates LLMs on real APIs across languages and geographies, documenting substantial gaps between open and closed models for non-English queries.
- [MASSIVE-Agents](https://papers.cool/venue/2025.findings-emnlp.1099%40ACL) reformats the MASSIVE intent dataset for function-calling evaluation across 52 languages with 47k+ samples.
- [Ticket-Bench](https://openreview.net/forum?id=RrcWawfxSz) evaluates task-oriented agents across 6 languages and reports notable performance gaps even for strong models.

**Most agentic benchmarks are still English-only.**
- [MAPS: A Multilingual Benchmark for Agent Performance and Security](https://aclanthology.org/2026.findings-eacl.42.pdf) finds that most existing agentic benchmarks remain English-only and that multilingual limitations propagate into agent decision-making and tool execution.

**Safety behavior can also drift.**
- [All Languages Matter](https://huggingface.co/papers/2310.00905) introduces XSafety and reports that LLMs produce significantly more unsafe responses for non-English queries than English ones.

## What this means

The gap isn't about translation. Teams already use translation management platforms for static strings. The gap is at the behavior boundary: does the same user intent trigger the same tool call, the same structured output, the same policy behavior across languages?

The failure pattern in this experiment is consistent enough to motivate the question. Whether it holds across models, agent architectures, and language pairs more broadly is worth investigating, but even at this scale it illustrates something that English-only testing won't catch.

That gap has no obvious owner. Translation platforms don't test agent behavior. Observability platforms don't model locale as an experimental variable. Generic LLM eval platforms don't ship with locale-first scenario formats.

The practical opportunity is to make this kind of check as easy to run as a unit test: a scenario file, a target URL, a CI check.

## What I built

LangDrift is the harness I used for this experiment, cleaned up and made general. It:
- Loads YAML scenarios with per-locale inputs and assertions
- POSTs each input to any HTTP agent target
- Checks tool calls and arguments deterministically
- Reports pass/fail by locale with failure mode classification
- Exits non-zero on failure, so it works in CI

The goal is to let any team run localized behavior checks against their own agents, not just refund routing, but any workflow where the right behavior matters across languages.
