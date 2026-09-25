# Code Organization (Project-Specific)

The `frontend-standards` skill owns code shape: colocation, file order, comments, literals, conditionals, and class composition. This file holds only the repo facts it leaves open: which folders fill its scopes, how imports are written, and naming.

## Directory map (actual repo)

```text
src/
  app/                -> Next.js routing, layout, metadata, route handlers
    (app)/            -> main website routes (home/projects/about/blog/... )
      (main)/         -> most pages; layout adds the 4xl footer
      (narrow)/       -> 3xl reading pages; layout sets --content-max-width for column and footer
      (blog)/         -> blog routes; each view renders its own footer
    (chat)/           -> chat page + chat API route
  features/           -> feature/domain UI and logic
    about/
    blog/
    chat/
    home/
    projects/
    side-quests/
    workshop/
  components/
    ui/               -> reusable UI primitives
    animations/       -> shared animation primitives
    decorations/      -> shared decorative visuals
  hooks/              -> cross-feature hooks only
  lib/                -> pure/shared utilities and config
  constants/          -> shared static constants, including the route map in navigation.ts

content/blog/<locale>/ -> MDX blog content, one directory per locale (`en`, `my`)
messages/             -> reserved for upcoming i18n messages
```

## Layer ownership

| Layer                   | Owns                                              | Does not own                               |
| ----------------------- | ------------------------------------------------- | ------------------------------------------ |
| `src/app`               | routing, layout, metadata, thin route composition | reusable feature internals                 |
| `src/features`          | domain logic + feature UI                         | global app shell, generic UI primitives    |
| `src/components/ui`     | reusable primitives                               | business/domain logic                      |
| `src/components` (root) | app-wide shared components                        | feature-specific business UI               |
| `src/hooks`             | truly cross-feature hooks                         | one-feature-only hooks                     |
| `src/lib`               | pure helpers/config utilities                     | React components and feature orchestration |
| `src/constants`         | app-wide static data, route paths                 | feature-owned data                         |
| `content/blog`          | blog documents                                    | runtime app logic                          |

Global app shell components (`header`, `footer`, theme provider) stay in `src/components`.

## Feature folder conventions

For each `src/features/<feature>/`:

- `components/` for the feature's components.
- `api/` for server-side data fetchers, `actions/` for server actions.
- `lib/` for the feature's pure functions and concept modules.

Example from current repo:

- `src/features/home/components/*`
- `src/features/home/actions/email.ts`
- `src/features/home/api/contribution.ts`

## Route handlers

Route handlers live under `src/app/**/api/**/route.ts`.

- Chat API: `src/app/(chat)/api/chat/route.ts`
- Blog search API: `src/app/(app)/(blog)/api/search/route.ts`

## Imports

- Within the same feature, use relative imports.
- Across layers and features, use `@/` alias imports.
- `src/lib` stays framework-agnostic where possible.

## Naming conventions used in this repo

- Folders/files: `kebab-case`
- React components: `PascalCase`
- Hooks: `useXxx` in files like `use-screen-size.ts`
- Next.js routes: `page.tsx`, `layout.tsx`, `route.ts`
- No barrel `index.ts` files: they hide ownership and dependency paths.
