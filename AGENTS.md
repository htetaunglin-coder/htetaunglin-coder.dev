# AGENTS.md

This file is the root context for coding agents working in this repository.
Keep this file concise and universally applicable. Load deeper docs from `agent_docs/` only when needed.

## Why this project exists

Personal portfolio for Htet Aung Lin, built with Next.js App Router.
Primary goals:
- Present projects, writing, and profile content.
- Provide an AI chat experience about the portfolio owner.
- Stay maintainable, fast, and easy to extend.

## Core stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Fumadocs MDX for blog content
- Vercel AI SDK (`ai`) + Groq chat model in API route
- Resend for contact email
- Upstash/Vercel KV for rate limiting
- Biome + Ultracite for lint/format checks

## Working agreement for agents

1. Research first, then change code.
2. Keep context focused: read only the files needed for the task.
3. Prefer deterministic validation (`check`, `types:check`, targeted build/test) over style-only prompt rules.
4. Do not invent architecture. Follow existing patterns in `src/features/*`, `src/components/*`, and `src/app/*`.
5. Keep changes minimal and reversible. Avoid large refactors unless explicitly requested.
6. If a task touches future roadmap areas (i18n, advanced AI), load related docs in `agent_docs/`.

## Default workflow

1. Research: identify exact files and constraints.
2. Plan: choose minimal implementation path.
3. Implement: modify only relevant files.
4. Verify: run smallest meaningful checks first.
5. Report: summarize changes, risks, and next steps.

## Verification commands

- Install: `pnpm install`
- Dev server: `pnpm dev`
- Lint/format check: `pnpm check`
- Auto-fix: `pnpm fix`
- Type check: `pnpm types:check`
- Production build: `pnpm build`

## Progressive-disclosure docs

Read only what is relevant to the active task:

- `agent_docs/project-map.md`
  - Architecture map, routes, feature boundaries, key files.
- `agent_docs/implementation-playbook.md`
  - Task workflow, validation strategy, and failure handling.
- `agent_docs/code-organization.md`
  - Colocation-first file/folder conventions tailored to this repository.
- `agent_docs/i18n-burmese-english.md`
  - Planned Burmese/English internationalization approach.
- `agent_docs/generative-ai-extension.md`
  - Planned AI feature expansion and guardrails.
- `agent_docs/dependencies-and-doc-packages.md`
  - Dependency/doc package update playbook.
- `agent_docs/context-engineering-principles.md`
  - Principles adapted from referenced HumanLayer posts.

## Definition of done

A task is complete only when:
- Code and docs are consistent.
- Relevant checks pass (or failures are clearly reported).
- Any new behavior has updated documentation in the smallest relevant `agent_docs/*` file.
