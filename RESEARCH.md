# Research: Multilingual Agent Behavior Drift

## The question

AI localization is shifting from translated strings toward behavior verification. For agentic systems, a "localized experience" is only correct if the agent preserves intent, tool selection, and structured output across languages, not just if the UI renders in another language.

I wanted to know whether this was a measurable problem or a theoretical one, so I ran an experiment.

## The experiment

I built a minimal eval harness and ran scenarios across 3 domains and 12 locales. Each domain had a dedicated agent with 5 tools and a domain-appropriate system prompt. The methodology: write and validate each English prompt to 3/3 pass first, then write equivalent natural-language phrasings in the other 11 languages. This reduces one obvious confounder: an ambiguous base task. The remaining failures are not proof of a universal language effect, but they are evidence of language-conditioned behavior drift in this concrete setup.

**Setup:**
- 6 scenarios across 3 domains: support (billing, subscription), ecommerce (cancel order, track order), scheduling (reschedule, new booking)
- 12 locales per scenario: en, fr, ar, zh, ru, id, vi, sw, cy, eu, mn, yo
- 3 iterations per scenario
- Model: deepseek-chat via OpenAI-compatible API
- English baseline confirmed at 3/3 before any other locale was tested

**Results:**

| Scenario | Pass rate | Failing locale checks |
| -------- | --------- | ------------------- |
| support-routing | 86% (31/36) | sw (3/3), yo (1/3), zh (1/3) |
| support-cancel-subscription | 78% (28/36) | ru (1/3), sw (2/3), cy (2/3), yo (3/3) |
| ecommerce-cancel-order | 72% (26/36) | zh (3/3), eu (3/3), mn (1/3), yo (3/3) |
| ecommerce-track-order | 81% (29/36) | zh (3/3), vi (1/3), sw (3/3) |
| scheduling-reschedule | 78% (28/36) | ar (2/3), zh (1/3), sw (3/3), cy (1/3), eu (1/3) |
| scheduling-book-new | 92% (33/36) | zh (1/3), eu (1/3), mn (1/3) |

English passed 3/3 in every scenario.

## Limitations

This is an applied experiment, not a scientific claim.

**Single model.** The benchmark uses deepseek-chat only. Failures attributed to language-conditioned drift may instead reflect this specific model's training distribution or fine-tuning choices. Running the same scenarios against a second model (planned: OpenAI) would separate model-specific behavior from a more general pattern. Until that comparison exists, the results should be read as findings about deepseek-chat in this setup, not about multilingual agent behavior in general.

**Low iteration count.** Three iterations per locale is too thin to treat pass rates as stable measurements. A 2/3 result for a given locale could be noise. The planned improvement is at least 10 iterations, which would give the pass rate numbers enough weight to draw more confident conclusions.

**Unreviewed locale prompts.** The locale inputs were written by one author to preserve intent but were not reviewed by native speakers. Some failures may reflect phrasing gaps rather than model behavior. This is acknowledged as a real threat to validity, but native review at scale is not practical for a solo project. Results should be interpreted with that caveat explicitly in mind.

**One agent architecture.** The agent uses a simple single-turn prompt-to-tool-call pattern with 5 tools per domain. More complex setups, such as multi-turn agents, RAG, or larger tool sets, may show different failure patterns.

The result is best read as a reproducible demonstration of a real risk, not as a ranking of languages, models, or agent architectures.

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

## What we observed

These observations are from a single experiment with one model and 3 iterations per locale. They suggest hypotheses worth testing more rigorously, not conclusions.

**Failures cluster around the same locales across different domains.** Swahili fails in billing support, subscription cancellation, order tracking, and scheduling. Yoruba fails in billing support, subscription cancellation, and order cancellation. This pattern showing up across unrelated domains suggests a language-conditioned weakness in this model's tool-use behavior, though a larger benchmark would be needed to separate model behavior from prompt phrasing and locale coverage effects.

**Speaker count doesn't predict failures.** Arabic (330M speakers) passes in 5 of 6 scenarios and Indonesian (200M speakers) passes consistently, while Swahili (200M speakers) fails in 4 of 6. Whatever drives the failures in this setup, raw speaker count alone doesn't explain it.

**Chinese underperforms relative to expectations.** Mandarin Chinese fails in 5 of 6 scenarios. If this held across multiple models, it would be a notable finding, since most NLP benchmarks treat Chinese as a high-resource language.

**The dominant failure mode is `no_tool_call`.** In most failures, the model responds in natural language rather than calling a tool. The agent isn't routing to the wrong tool, it's declining to act entirely. That's arguably harder to catch in production than a wrong tool call.

**None of this is visible in English-only testing.** English passes cleanly every time, which is the point: teams running English-only evals have no signal that anything is wrong.

## Supporting research

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
