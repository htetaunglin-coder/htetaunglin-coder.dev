# Implementation Playbook

Use this process for non-trivial changes.

## 1) Research phase

- Identify exact files, not broad folders.
- Capture constraints first:
  - UX/behavior constraints
  - API/runtime constraints
  - Existing limits/rate limits
  - Env var requirements
- If task touches AI routes or prompts, read `src/lib/ai.ts` and `src/app/(chat)/api/chat/route.ts` first.

## 2) Plan phase

- Pick the smallest end-to-end slice that delivers value.
- Keep a clear boundary between:
  - deterministic app logic
  - model-driven logic (prompt/model call/output handling)
- For feature work, include a short rollback path.

## 3) Implement phase

- Follow colocation pattern already used in this repo:
  - route in `src/app/*`
  - feature logic in `src/features/*`
  - shared utilities in `src/lib/*` and `src/components/*`
- Prefer extending existing modules over introducing new framework-level abstractions.
- Keep prompts and model config in dedicated files (`src/lib/ai.ts` or nearby task-specific file).

## 4) Verify phase

Run checks proportional to change size:

1. `pnpm types:check`
2. `pnpm check`
3. `pnpm build` (for route-level or config-level changes)

If a check fails:
- Fix actual issue when possible.
- If intentionally deferred, document:
  - exact failure
  - why deferred
  - follow-up action

## 5) Document phase

When behavior changes, update one relevant doc file:
- Architecture/location changes: `project-map.md`
- i18n behavior: `i18n-burmese-english.md`
- AI behavior/model/tooling: `generative-ai-extension.md`
- Package/doc tooling changes: `dependencies-and-doc-packages.md`

## Failure patterns to avoid

- Over-loading prompts with static, always-on instructions.
- Running broad expensive checks after tiny changes when targeted checks are enough.
- Mixing business logic and chat prompt behavior in one large file.
- Adding unverified dependencies without clear need and version rationale.
