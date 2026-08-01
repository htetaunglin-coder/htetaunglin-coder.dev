# Portfolio Agent Guide

Cross-tool agent guide for `htetaunglin-coder.dev`. **`AGENTS.md` and `CLAUDE.md` are identical — edit one, mirror the other in the same commit.**

Keep this file short. Deep docs live in `agent_docs/`; load one only when the task touches it. The code wins over this file — if they disagree, say so instead of silently picking one.

## This is NOT the Next.js you know

This repo runs **Next.js 16**, which breaks things your training data predates. Before changing routing, layouts, metadata, images, fonts, CSS, caching, route handlers, server actions, or `next.config.mjs`, verify the current API — don't recall it. Heed deprecation notices in build output rather than silencing them.

Check, in order: the installed package's own types under `node_modules/next/` and the patterns already in `src/app`, then the Vercel plugin's `nextjs` skill (`next-upgrade` for version bumps), then <https://nextjs.org/docs>. This version ships **no** docs at `node_modules/next/dist/docs/` — don't go looking for that path.

Already caught here: `params` and `searchParams` page props are **promises** — `await` them.

## Project

Personal portfolio and writing site for Htet Aung Lin. Live and public on Vercel, deployed from `main`, no staging.

Next.js 16 (App Router, Turbopack dev) · React 19 · TypeScript strict · Tailwind v4 · Motion · Fumadocs MDX · AI SDK v6 + Groq · Resend · Upstash/Vercel KV · Cloudinary · Giscus · Biome + Ultracite · pnpm, Node 24.

Alias: `@/*` → `src/*`. Route map, boundaries, and env vars: `agent_docs/project-map.md`.

## Commands

`pnpm dev` · `build` · `start` · `preview` · `types:check` (`tsc --noEmit`) · `check` (Ultracite) · `fix` (Ultracite autofix) · `resume:pdf` (regenerates the committed resume PDF via headless Chrome — only when asked).

**There is no test runner.** No Vitest, no Playwright, no `pnpm test`. Don't invent one and never claim tests pass. Verification here is `types:check` + `check` + `build` + actually looking at the page.

CI (`.github/workflows/lint.yml`) runs `check`, `types:check`, and `build` on PRs to `main` and pushes to `main`. Run them locally first so green CI isn't a surprise.

## Workflow

1. Read only what the task needs; start at `agent_docs/project-map.md` for multi-file work.
2. Confirm the real target files and current behavior before editing.
3. For non-trivial or multi-file changes, present a short plan and wait for approval.
4. Make the smallest correct change. Extend what exists before adding an abstraction.
5. Check proportionally — any edit → `pnpm fix` + `pnpm types:check`; shared, `lib`, or config change → also `pnpm check`; route, metadata, content, or config change → also `pnpm build`.
6. Update the matching `agent_docs/` file when behavior changes.
7. Report unrelated cleanup as a recommendation, not as part of the diff.

Longer process: `agent_docs/implementation-playbook.md`.

## Rules

### Structure

- `must`: pages are Server Components unless the file opens with `"use client"`. Keep `page.tsx` to metadata and composition; behavior lives in `src/features/<domain>`.
- `prefer`: colocate first — promote to `src/hooks`, `src/lib`, or `src/components/ui` only on real reuse across 3+ features.
- `must not`: cross-feature imports (`features/a` reaching into `features/b`). Extract upward instead.
- `must`: kebab-case files, PascalCase components, `use-x.ts` hooks, no barrel `index.ts`.
- `must`: file order — imports → types → main export → secondary exports → private helpers → constants.

Layer ownership and import boundaries: `agent_docs/code-organization.md`.

### UI

- `must`: Tailwind v4 — theme tokens live in `@theme` in `src/styles/globals.css`, not a `tailwind.config`. Prefer the semantic tokens (`fg-default`, `bg-default`, `fg-brand`, …) over raw values. Compose with `cn()` from `src/lib/utils.ts`.
- `must`: `src/components/ui` is hand-maintained Radix wrappers in shadcn style. There is no `components.json`, so `npx shadcn add` is not wired up — write the file to match its neighbours.
- `must`: images go through `cloudinary-image.tsx` or `ui/theme-image.tsx` with explicit responsive `sizes`.
- `must`: support light and dark. For theme-dependent client UI, read `resolvedTheme` and render `null` until mounted (`src/components/comment.tsx`).
- `must`: motion is **calm and trustworthy** — long glide-to-rest, no snappy bounces. Use the `src/lib/motion.ts` tokens (`EASE`, `DURATION`, `SPRING`, `STAGGER`) and the wrappers in `src/components/animations/` instead of hand-written durations. Respect `prefers-reduced-motion`.
- `must not`: "clean up" the deliberate LCP tricks — hero text starts at non-zero opacity, and the contact form lazy-loads near viewport.

### Server and data

- `must`: server actions carry `"use server"` and live in `src/features/<feature>/actions/`.
- `must`: anything that costs money or sends mail is rate-limited per IP through Upstash/KV, following `src/app/(chat)/api/chat/route.ts` and `src/features/home/actions/email.ts`.
- `must`: rate-limit and KV failures **fail open** with a logged error, never a crash.
- `must`: user-facing errors are plain, actionable sentences. Never surface a provider error, a stack trace, or a raw `error.message`.
- `must`: guard missing env keys with a friendly error, and add every new key to `.env.example`. Never commit secrets — `.env` is gitignored and holds real values.

### AI chat

- `must`: the agent roster — model, daily limit, cooldown, instruction — lives in `src/features/chat/lib/agents.ts`. Add or tune agents there, never inline in the route.
- `must`: keep guardrails in code, not in the prompt — 200-char message cap, 5-pair history window, per-IP limits.
- `must`: `systemPrompt` in `src/lib/ai.ts` is the owner's own voice. Tone changes are a content decision — confirm first.

### Content

- `must`: blog posts are MDX in `content/blog/<locale>/` — `en` and `my`, both live — and must satisfy the frontmatter schema in `source.config.ts` — `title`, `description`, `author`, `date`, `image` (`url`, `author_name`, `author_link`), `series`. A malformed field fails the build. A post in any other directory is silently dropped, so the loader throws instead; see `agent_docs/i18n-burmese-english.md`.
- `must not`: touch `JOB_SEARCH.md`, `__ONLY_ME__/`, or `resume/` unless asked.

### Style

- `must`: prefer readable, self-documenting code—clear domain names and straightforward structure—over comments that narrate mechanics. When code is unclear, improve it first; use comments for context the code cannot express clearly, such as rationale, constraints, invariants, tradeoffs, workarounds, or surprising behavior. Do not restate the next line or signature, and keep comments current.
- `must`: pushback over flattery — cite the code or the convention, not vibes. When the user is right, say so briefly and move on.

## Git

- Conventional Commits, enforced by commitlint. Husky pre-commit runs Ultracite on staged files and re-stages them, so formatting-only diffs are expected.
- Messages stay terse, with **no employer, client, or NDA detail** — this repo is public.
- **Never add AI attribution** — no `Co-Authored-By: Claude`, no "Generated with Claude Code", no robot emoji — in commits, PR titles, or PR bodies.
- Don't commit or push unless asked. Branch first if on `main`.

## Docs

- `agent_docs/project-map.md` — architecture, routes, boundaries, env vars, CI
- `agent_docs/code-organization.md` — layout, ownership, naming, imports
- `agent_docs/implementation-playbook.md` — research → plan → implement → verify → document
- `agent_docs/generative-ai-extension.md` — extending the AI surface
- `agent_docs/dependencies-and-doc-packages.md` — upgrade risk groups
- `agent_docs/context-engineering-principles.md` — why this doc set is shaped the way it is
- `agent_docs/i18n-burmese-english.md` — the shipped `en`/`my` blog i18n. **Read before touching Burmese routes, blog metadata, or `content/blog/`** — it records three traps and several deliberate behaviours that read as bugs
- `agent_docs/research-i18n-fumadocs.md`, `agent_docs/research-i18n-typography.md` — cited research behind the above, kept as historical record

## Agent skills

- Issue tracker: GitHub issues on `htetaunglin-coder/htetaunglin-coder.dev` via the `gh` CLI — `docs/agents/issue-tracker.md`
- Triage labels: the five canonical roles, each label equal to its name — `docs/agents/triage-labels.md`
- Domain docs: single-context (`CONTEXT.md` + `docs/adr/` at the root) — `docs/agents/domain.md`
