# Roadmap

LangDrift starts as an experiment, but the product direction is broader: make multilingual agent behavior as easy to evaluate as a unit test. The roadmap below focuses on the path from research-backed harness to practical developer workflow.

## Product Principles

- Treat the current benchmark as an applied demonstration, not a scientific claim.
- Make failures debuggable before making the report prettier.
- Fit into the workflows developers already use: scenario files, local runs, CI checks, PR summaries, and baseline diffs.
- Keep locale evaluation behavior-first: tool calls, structured output, policy behavior, and language-specific regressions matter more than translated text alone.
- Prefer deterministic assertions first. LLM-as-judge may become useful later, but the core value should not depend on another model agreeing with the result.

## Now

One thing remaining:

1. **Strengthen the experiment.** Re-run all six scenarios with an OpenAI model and increase iterations from 3 to at least 10. This is the credibility foundation: without it, the benchmark results are interesting but easy to dismiss. See the Research Backlog for specifics.

The locale matrix (v0.2) is done. The experiment re-run is the remaining blocker before moving on.

## v0.1 Developer Loop

Goal: make the first run obvious and repeatable.

Current status: complete.

- Package the CLI so teams can install and run `langdrift` directly. Done.
- Add `langdrift init` to generate a starter config and scenario template. Done.
- Add scenario templates for support, ecommerce, scheduling, and generic tool-calling agents. Done.
- Add stable JSON output alongside the terminal report. Done.
- Provide a fake local agent so the main demo runs without an API key. Done.
- Document the minimum HTTP target contract with request and response examples. Done.

## v0.2 Debuggable Locale Matrix

Goal: make failures easy to scan, share, and debug.

Current status: core complete.

- Add an aggregate locale matrix across scenarios and iterations. Done.
- Include pass rate, failure mode, and first failing detail per locale. Done.
- Generate markdown reports suitable for PRs and QA review. Done.
- Save raw target responses for failed runs. Deferred to v0.2 follow-up.
- Save enough request context for failed runs to reproduce a locale-specific failure. Deferred.
- Include links or file paths from matrix rows to the raw failed responses. Deferred.
- Keep HTML reports exploratory until the markdown and JSON artifacts are clearly useful.

## v0.3 Low-friction Integration

Goal: make it easy to plug any existing agent into LangDrift with minimal code changes. Adoption dies at integration cost; this comes before CI features.

- Add minimal integration examples for common HTTP agent shapes.
- Document adapter examples for OpenAI-style tool calls, Vercel AI SDK, LangChain/LangGraph, and plain Express/Fastify handlers.
- Make the HTTP contract feel like a thin wrapper, not a rewrite.

## v0.4 CI Gate

Goal: let teams block regressions without making every existing locale failure fatal forever. Keep it simple: threshold and a GitHub Actions example, nothing more.

- Add threshold-based exits: minimum pass rate or required locales must pass.
- Support a known-failure allowlist so teams can accept specific locale failures explicitly.
- Provide a GitHub Actions example.
- Emit a PR-friendly summary alongside the JSON artifact.

## v0.5 Scenario Quality and Authoring

Goal: reduce the cost of writing and maintaining multilingual scenarios. Authoring is the main adoption barrier; teams that can't write good scenarios get false confidence.

- Add scenario linting for missing locales, duplicate IDs, and invalid assertions.
- Add LLM-assisted locale generation: given an English input, suggest equivalent phrasings for selected locales as a starting point. This won't replace native review but lowers the cost of a first draft significantly.
- Document the authoring limitation: generated phrasings are unreviewed and may introduce phrasing gaps that are indistinguishable from model failures. Users should treat them as drafts.
- Support tags for domain, intent, risk level, and locale priority.
- Add warnings when locale coverage differs across related scenarios.

## v0.6 Rich Assertions

Goal: evaluate behavior beyond a single tool call.

- Add JSON schema assertions for structured output.
- Add response-language checks.
- Support ordered tool-call sequences.
- Support multiple valid tool calls for the same intent.
- Add placeholder preservation checks.
- Add policy and safety-oriented assertions once the deterministic behavior assertions are stable.

## Longer Term

- Build a scenario library for common agent workflows.
- Integrate with observability data to turn production multilingual failures into eval scenarios.
- Explore richer safety and policy suites for multilingual agent behavior.
- Compare models, providers, prompts, and agent architectures on the same scenario set.
- Track drift over time as models or prompts change.

## Research Backlog

These items strengthen the study and the public narrative. They are not product features; they improve the credibility and reach of the underlying experiment.

- Re-run all six scenarios with an OpenAI model (gpt-4o-mini is cheap enough) and compare pass rates side by side. This is the single most important credibility improvement: if similar patterns appear on a different model, the finding is less likely to be only deepseek-chat-specific.
- Increase iterations per locale from 3 to at least 10. This makes the pass rate numbers meaningful and reduces the chance that any individual result is noise.
- Preserve raw failed responses in the benchmark output so readers can see what the model actually returned instead of calling a tool.
- Locale prompt authoring without native review is acknowledged as a limitation in `RESEARCH.md`. It is deferred: native review at scale is not practical for a solo project. The limitation is documented; it should be disclosed wherever the results are shared.
- Make the wording explicit everywhere that the experiment does not rank languages and makes no universal claims about model capability.
