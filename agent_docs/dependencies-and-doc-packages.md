# Dependencies and Doc Packages

This file is for planned package updates (including docs-related packages) and how agents should execute them.

## Update goals

- Keep core framework and tooling current without breaking runtime features.
- Prefer incremental updates over large multi-package jumps.
- Ensure docs/build pipelines keep working after updates.

## Packages with higher change risk in this repo

- Framework/runtime:
  - `next`, `react`, `react-dom`, `typescript`
- AI stack:
  - `ai`, `@ai-sdk/*`
- Content/docs stack:
  - `fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`, `marked`, `react-markdown`, `remark-*`, `shiki`
- Tooling:
  - `@biomejs/biome`, `ultracite`, `tailwindcss`

## Safe update process

1. Update one risk group at a time.
2. Run:
   - `pnpm types:check`
   - `pnpm check`
   - `pnpm build`
3. If content/docs packages changed, verify:
   - blog list page
   - blog post page
   - any markdown rendering in chat
4. Record notable breaking changes in this file.

## Pull request checklist for dependency updates

- Version changes are intentional and scoped.
- Lockfile updated.
- Build and typecheck status recorded.
- Any required code migration applied.
- New env var or config requirements documented in `.env.example` or relevant docs.

## Documentation package notes

- Fumadocs config source:
  - `source.config.ts`
  - `src/lib/source.ts`
- If upgrading Fumadocs major versions, verify frontmatter schema behavior and generated source imports.

## Rollback policy

- If update causes runtime regression, revert the specific package group instead of mixing more changes.
- Keep update commits focused so rollback is straightforward.

## Notable breaking changes log

- 2026-04-04: AI SDK stack upgraded from v5-line to v6-line:
  - `ai`: `^5.0.83` -> `^6.0.146`
  - `@ai-sdk/react`: `^2.0.83` -> `^3.0.148`
  - `@ai-sdk/groq`: `^2.0.27` -> `^3.0.33`
  - `@ai-sdk/google`: `^2.0.25` -> `^3.0.58`
  - Required code migration: `convertToModelMessages` is async in AI SDK 6, so the chat route now awaits it before calling `streamText`.
