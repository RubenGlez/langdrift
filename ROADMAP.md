# Roadmap

LangDrift starts as an experiment, but the product direction is broader: make multilingual agent behavior as easy to evaluate as a unit test. The roadmap below focuses on the path from research-backed harness to practical developer workflow.

## Product Principles

- Treat the current benchmark as an applied demonstration, not a scientific claim.
- Make failures debuggable before making the report prettier.
- Fit into the workflows developers already use: scenario files, local runs, CI checks, PR summaries, and baseline diffs.
- Keep locale evaluation behavior-first: tool calls, structured output, policy behavior, and language-specific regressions matter more than translated text alone.
- Prefer deterministic assertions first. LLM-as-judge may become useful later, but the core value should not depend on another model agreeing with the result.

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

- Add an aggregate locale matrix across scenarios and iterations.
- Include pass rate, failure mode, and first failing detail per locale.
- Save raw target responses for failed runs.
- Save enough request context for failed runs to reproduce a locale-specific failure.
- Include links or file paths from matrix rows to the raw failed responses.
- Generate markdown reports suitable for PRs and QA review.
- Keep HTML reports exploratory until the markdown and JSON artifacts are clearly useful.

## v0.3 Developer Integration and CI Gate

Goal: make LangDrift easy to connect to real agents and useful in CI without making every existing locale failure fatal forever.

- Add minimal integration examples for common HTTP agent shapes.
- Document adapter examples for OpenAI-style tool calls, Vercel AI SDK, LangChain/LangGraph, and plain Express/Fastify handlers.
- Add threshold-based exits, such as minimum pass rate or required locales.
- Add baseline comparison against a previous checked-in run.
- Show new failures, fixed failures, and unchanged known failures separately.
- Support known-failure allowlists with expiry notes.
- Provide a GitHub Actions example.
- Emit PR-friendly summaries and machine-readable artifacts.

## v0.4 Scenario Quality

Goal: make multilingual scenario authoring trustworthy.

- Add scenario linting for missing locales, duplicate IDs, and invalid assertions.
- Add metadata for source locale, translation method, reviewer, and review status.
- Document guidelines for writing equivalent prompts across languages.
- Support tags for domain, intent, risk level, and locale priority.
- Add warnings when locale coverage differs across related scenarios.
- Add documentation explaining that scenario results should not be read as a ranking of languages.
- Add a research limitations checklist covering model choice, prompt design, locale authoring, iteration count, and scenario coverage.

## v0.5 Rich Assertions

Goal: evaluate behavior beyond a single tool call.

- Add JSON schema assertions for structured output.
- Add response-language checks.
- Support ordered tool-call sequences.
- Support multiple valid tool calls for the same intent.
- Add placeholder preservation checks.
- Add policy and safety-oriented assertions once the deterministic behavior assertions are stable.

## v0.6 Comparisons and Drift Tracking

Goal: understand whether failures are caused by model choice, prompt changes, agent architecture, or locale-specific behavior drift over time.

- Compare models, providers, prompts, and agent architectures on the same scenario set.
- Track drift over time as models or prompts change.
- Support baseline history so teams can see whether a locale is improving, degrading, or stable.
- Add report sections that separate product regressions from exploratory benchmark comparisons.

## Longer Term

- Build a scenario library for common agent workflows.
- Integrate with observability data to turn production multilingual failures into eval scenarios.
- Explore richer safety and policy suites for multilingual agent behavior.

## Research Backlog

These items strengthen the study and the public narrative, but they are not all product features.

- Add a clear limitations or threats-to-validity section to `RESEARCH.md`.
- Preserve examples of failed raw responses so readers can inspect what the model did instead of calling a tool.
- Run at least one comparison model or prompt variant to show that the harness can distinguish model/prompt behavior from the general risk.
- Make the wording explicit that the experiment does not rank languages or make universal claims about model capability.
- Document how locale prompts were authored and reviewed: natural phrasing, translation assistance, reviewer language familiarity, and any known caveats.
