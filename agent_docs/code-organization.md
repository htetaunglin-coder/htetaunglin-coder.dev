# Code Organization (Project-Specific)

Guiding principle: place code as close to where it is used as possible.
Things that change together should live together.

Reference: https://kentcdodds.com/blog/colocation

## Why this matters here

- Maintainability: feature-local code is easier to remove/refactor without orphans.
- Discoverability: contributors find behavior where routes/features live.
- Ease of change: less context-switching between distant folders.

## Directory map (actual repo)

```text
src/
  app/                -> Next.js routing, layout, metadata, route handlers
    (app)/            -> main website routes (home/projects/about/blog/... )
    (chat)/           -> chat page + chat API route
  features/           -> feature/domain UI and logic
    about/
    blog/
    chat/
    home/
    projects/
    side-quests/
  components/
    ui/               -> reusable UI primitives
    animations/       -> shared animation primitives
    decorations/      -> shared decorative visuals
  hooks/              -> cross-feature hooks only
  lib/                -> pure/shared utilities and config
  constants/          -> shared static constants

content/blog/         -> MDX blog content
messages/             -> reserved for upcoming i18n messages
```

## Layer ownership

| Layer | Owns | Does not own |
| --- | --- | --- |
| `src/app` | routing, layout, metadata, thin route composition | reusable feature internals |
| `src/features` | domain logic + feature UI | global app shell, generic UI primitives |
| `src/components/ui` | reusable primitives | business/domain logic |
| `src/components` (root) | app-wide shared components | feature-specific business UI |
| `src/hooks` | truly cross-feature hooks | one-feature-only hooks |
| `src/lib` | pure helpers/config utilities | React components and feature orchestration |
| `content/blog` | blog documents | runtime app logic |

## Decision flow for new code

1. Used by one component only:
   - Keep it in that component file.
2. Used by 2-3 files in one feature:
   - Move to `src/features/<feature>/components` or feature-local helper file.
3. Used across 3+ features:
   - Hook -> `src/hooks`
   - Pure utility -> `src/lib`
   - UI primitive -> `src/components/ui`
4. Truly app-wide structure:
   - Put in shared root component/config location.

Start local, then promote only when real reuse appears.

## Feature folder conventions

For each `src/features/<feature>/`:

- `components/` for reusable sub-components within that feature.
- `api/` and `actions/` for feature-scoped data boundaries (already used in `home`).
- Local utility/type files when specific to the feature.
- Keep feature internals out of `src/app` route files.

Example from current repo:
- `src/features/home/components/*`
- `src/features/home/actions/email.ts`
- `src/features/home/api/contribution.ts`

## App route conventions

- `src/app/**/page.tsx` files should focus on route metadata/composition.
- Keep business behavior in feature modules when reasonable.
- Route handlers live under `src/app/**/api/**/route.ts`.

Examples:
- Chat API: `src/app/(chat)/api/chat/route.ts`
- Blog search API: `src/app/(app)/(blog)/api/search/route.ts`

## Import boundaries

- `src/app` can import from features/components/hooks/lib/constants.
- `src/features` can import from components/ui, shared components, hooks, lib, constants.
- `src/components/ui` should depend on `src/lib` (and other UI primitives) only.
- `src/lib` should remain framework-agnostic where possible.

Rules:
- Within the same feature, prefer relative imports.
- Across layers/features, use `@/` alias imports.
- Avoid feature-to-feature direct imports; extract shared logic upward.

## Naming conventions used in this repo

- Folders/files: `kebab-case`
- React components: `PascalCase`
- Hooks: `useXxx` in files like `use-screen-size.ts`
- Utilities/constants: descriptive camelCase or UPPER_SNAKE_CASE constants
- Next.js routes: `page.tsx`, `layout.tsx`, `route.ts`

## File ordering convention

Keep highest-signal code near the top:

1. Imports
2. Types/props
3. Main exported component/function
4. Secondary exports
5. Private helpers
6. Constants

This makes review and scanning faster.

## Anti-patterns to avoid

- Large global grab-bag utility files.
- Feature logic moved into route pages unnecessarily.
- Cross-feature coupling (`features/a` importing internals from `features/b`).
- Premature shared abstractions before proven reuse.
- Barrel exports that hide ownership and dependency paths.

## Practical exceptions

- Global app shell components (`header`, `footer`, theme provider) stay in shared locations.
- Design-system primitives stay in `src/components/ui`.
- Blog content remains in `content/blog` and follows Fumadocs conventions.
