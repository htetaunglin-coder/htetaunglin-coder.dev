# Context Engineering Principles

This repository follows these practical rules for coding-agent reliability.
They are adapted from the referenced HumanLayer materials and translated into repo-specific guidance.

## Core principles

1. Keep root instructions short and high-signal.
2. Use progressive disclosure: only load deep docs when task-relevant.
3. Prioritize context quality over context quantity.
4. Keep tasks small and focused.
5. Use deterministic back-pressure (checks/build/tests) so the agent can verify work.
6. Separate orchestration logic from model-facing prompt text.
7. Add harness complexity only after observing real failure modes.

## What this means in this repo

- Root guidance lives in `AGENTS.md`.
- Deep docs live in `agent_docs/*`.
- Architecture mapping is explicit (`project-map.md`) to reduce repeated exploration.
- Feature-specific plans (i18n, AI extensions, deps) are documented as focused files.
- Validation commands are standardized in one place.

## Anti-patterns

- Dumping all instructions and every project detail into one giant file.
- Running expensive full validation for every tiny edit.
- Changing prompt text to solve deterministic code issues.
- Adding many tools/skills/dependencies before proving need.

## Sources

- https://www.humanlayer.dev/blog/writing-a-good-claude-md
- https://www.humanlayer.dev/blog/long-context-isnt-the-answer
- https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents
- https://www.humanlayer.dev/blog/advanced-context-engineering
- https://www.humanlayer.dev/blog/12-factor-agents
