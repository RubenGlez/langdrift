# LangDrift

## What it is

LangDrift is a locale-aware eval harness for AI agent workflows. It checks whether an agent preserves correct tool-calling behavior when the same user intent arrives in different languages — French, Arabic, Chinese, Swahili, or any other locale. It is a CLI tool that runs YAML scenarios, POSTs to any HTTP agent endpoint, and runs deterministic assertions against the response. It has zero runtime dependencies and integrates into CI as a gate.

The project serves a dual purpose: it solves a real, undernamed problem in production AI systems, and it is a career showcase demonstrating original research, practical tooling, and clear technical communication in the AI engineering field.

## Audience

The primary user is a backend or ML engineer at a SaaS company that ships multilingual AI agents. They already run evals in English, have no visibility into non-English behavior, and only discover locale failures reactively — from production complaints, not from a test suite.

The early adopter is an engineer at a company serving French, Arabic, Japanese, or Spanish markets with a tool-calling agent who has already felt the pain of silent behavioral drift and would recognize the demo as "exactly the problem I have."

In parallel, the intended audience for the project as a showcase is hiring managers, technical recruiters, and the AI engineering community — people who can validate the combination of research, working tool, and clear framing as a signal of strong AI engineering judgment.

## Positioning

LangDrift competes in the AI evals category, alongside tools like PromptFoo and Braintrust. The key differentiator is that locale is a first-class behavioral dimension, not an afterthought. The positioning is: the eval harness for teams who already test in English and want to know what breaks in every other language.

The research backing — a reproducible benchmark showing tool-call drift across 12 languages and multiple models — separates this from "someone built a YAML test runner." It frames a failure mode, quantifies it, and provides a tool to catch it in CI.

## Direction Assessment

**Conditional go.**

The technical foundation is solid. The research is real. The CLI works. The condition: the career goal is not served by more engineering right now. The project is strong as a technical artifact but has minimal visibility. The next phase should be 70% content and distribution, 30% feature work.

What needs to be true before committing to deeper product development:
- At least one real adoption story: a team uses LangDrift on their own agent and finds a real failure
- A public post that creates the category in people's minds and drives inbound interest
- Signal that the AI engineering community recognizes the problem when it's named

## Key Risks

**1. Nobody feels the pain proactively.** Locale drift is a known-unknown. Teams don't add evals for problems they haven't named. The tool needs content or a compelling failure story to make the problem visible before adoption can happen. Test cheaply: one "Show HN" post, measure whether engineers recognize the problem or shrug.

**2. The showcase stays invisible.** A well-built tool nobody sees does nothing for career positioning. The research plus working demo is a compelling combination, but it requires active distribution. This is the highest-leverage next action, ahead of any feature work.

**3. Scope creep delays the story.** Every week spent on roadmap features is a week the visibility work isn't happening. The career goal is better served by a polished, visible current version than an invisible future version with richer assertions.
