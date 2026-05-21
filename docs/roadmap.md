# Roadmap

## North Star

> Given the same user intent across locales, does the AI workflow preserve behavior?

LangDrift exists on two parallel tracks: proving the thesis through research, and
building a tool other developers can use to run the same checks on their own agents.

---

## Track 1: Research

Build and publish investigations that make cross-locale agent drift visible.
The goal is not software — it is findings.

### R1: Baseline Finding (done)

Ran the same refund intent in 8 languages with equivalent natural phrasing
against a realistic 5-tool agent. Results:

- English, French, Arabic, Welsh, Basque: pass consistently
- Yoruba: flaky (0–2/3)
- Swahili: fail 3/3 — routes to wrong tool (`check_payment_status`)
- Mongolian: fail 3/3 — routes to wrong tool (`check_payment_status`)

Key insight: failure correlates with linguistic distance from the training
corpus, not speaker count. European-rooted languages hold up; non-European
morphology and grammar break routing.

See `examples/deepseek-support-agent/benchmark-deepseek-realistic-routing.md`.

### R2: Publish the Finding

Turn the R1 result into a public artifact — a short write-up that explains
what was tested, what failed, and why it matters.

Suggested shape:

> We gave 8 languages the same support request. Swahili and Mongolian routed
> to the wrong tool every time. Here is the harness we used.

Candidates: a GitHub README section, a dev.to post, a short blog post.

### R3: Multi-Model Comparison

Run the same scenario across multiple models to see whether the failure pattern
is model-specific or structural.

```bash
langdrift compare --models deepseek-chat,claude-haiku,gpt-4o-mini
```

Expected output:

```text
Scenario: deepseek_realistic_routing

Model           en   fr   ar   sw   cy   yo   eu   mn
deepseek-chat   ok   ok   ok   ✗    ok   ~    ok   ✗
claude-haiku    ?    ?    ?    ?    ?    ?    ?    ?
gpt-4o-mini     ?    ?    ?    ?    ?    ?    ?    ?
```

This would show whether Swahili and Mongolian fail universally or only under
certain training regimes.

### R4: Safety Behavior Drift

Test whether safety guardrails are weaker in non-English languages, as
documented in XSafety research. Build scenarios where a policy-sensitive
request should be refused and check whether refusal is consistent across locales.

### R5: Argument Drift Investigation

Extend the realistic routing scenario to test argument value extraction — not
just whether the right tool is called, but whether the right argument values
are extracted. Based on HammerBench findings around parameter hallucination.

---

## Track 2: Product

Build a CLI tool other developers can use to run localized scenarios against
their own agents.

### P1: Usable By Strangers (next)

Right now the repo is internal tooling. A developer who finds it on GitHub
cannot use it for their own agent without reading the source.

Deliverables:

- Clear getting-started section in the README: write a scenario, point it at
  your endpoint, run it — in under one minute
- Remove `"private": true` from `package.json`
- Publish to npm so `npx langdrift run` works without cloning

### P2: Expanded Assertions

Make LangDrift trustworthy in CI with a broader deterministic assertion set:

- forbidden arguments
- JSON schema validation for structured output
- expected response language
- `contains` / `notContains` checks
- placeholder preservation
- glossary term preservation

### P3: Config And Suites

Make it convenient to run multiple scenarios without passing everything on the
command line:

- `langdrift.config.ts` or `langdrift.config.json`
- Multiple scenarios per run
- JSON result output
- Optional concurrency

### P4: Static HTML Report

Make failures easy to inspect and share as a CI artifact:

- Locale matrix
- Per-scenario detail
- Raw response view
- Tool call view
- Assertion failure explanations

### P5: Integrations

Integrate only after P1–P3 prove useful in real workflows:

- GitHub Action
- OpenAI / Anthropic direct model targets (no HTTP adapter needed)
- Vercel AI SDK adapter
- MCP server

---

## What To Avoid Early

- Hosted app or dashboard
- Accounts and permissions
- Translation management
- LLM-as-judge scoring
- Broad "agent quality" metrics
- Trace observability platform
