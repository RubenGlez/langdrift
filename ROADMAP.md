# Roadmap

LangDrift starts as an experiment, but the product direction is broader: make multilingual agent behavior as easy to evaluate as a unit test. The roadmap below focuses on the path from research-backed harness to practical developer workflow.

## v0.1 Developer Loop

Goal: make the first run obvious and repeatable.

Current status: started. `langdrift init` and JSON run output are implemented.

- Package the CLI so teams can install and run `langdrift` directly.
- Add `langdrift init` to generate a starter config and scenario template.
- Add scenario templates for support, ecommerce, scheduling, and generic tool-calling agents.
- Add stable JSON output alongside the terminal report.
- Provide a fake local agent so the main demo runs without an API key.
- Document the minimum HTTP target contract with request and response examples.

## v0.2 Locale Matrix

Goal: make failures easy to scan, share, and debug.

- Add an aggregate locale matrix across scenarios and iterations.
- Include pass rate, failure mode, and first failing detail per locale.
- Save raw target responses for failed runs.
- Generate markdown reports suitable for PRs and QA review.
- Explore an HTML report once the markdown shape is stable.

## v0.3 CI Gate

Goal: let teams block regressions without making every locale failure fatal forever.

- Add threshold-based exits, such as minimum pass rate or required locales.
- Add baseline comparison against a previous checked-in run.
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

## v0.5 Rich Assertions

Goal: evaluate behavior beyond a single tool call.

- Add JSON schema assertions for structured output.
- Add response-language checks.
- Support ordered tool-call sequences.
- Support multiple valid tool calls for the same intent.
- Add placeholder preservation checks.
- Add policy and safety-oriented assertions.

## Longer Term

- Compare models, providers, prompts, and agent architectures on the same scenario set.
- Track drift over time as models or prompts change.
- Build a scenario library for common agent workflows.
- Integrate with observability data to turn production multilingual failures into eval scenarios.
