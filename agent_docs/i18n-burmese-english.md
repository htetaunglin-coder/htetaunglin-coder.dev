# i18n Plan (Burmese + English)

This file defines the expected implementation direction for **site-wide** Burmese/English internationalization. **None of what follows is implemented** — there is no i18n framework, no `messages/` directory, and no locale routing outside the blog. Treat this as a plan, not as a description of the code.

The blog is the exception and does not follow this plan. Burmese *posts* already ship at `/my/blog/<slug>`, driven by the Fumadocs loader's own locale config (`src/lib/i18n.ts`) rather than an `app/[locale]` segment — the routes are hand-written at their real paths so they stay statically generated. See the "i18n status" section of `project-map.md` for what actually exists. Do not restructure the blog to match the sketch below without reconciling the two.

## Scope goals

- Support at least two locales: `en`, `my`.
- Keep URL strategy explicit and SEO-friendly.
- Avoid scattering strings across components.

## Recommended routing strategy

Use locale segment routing in App Router:
- `src/app/[locale]/...`
- Keep existing route groups (`(app)`, `(main)`, `(blog)`, `(chat)`) under locale.

Example shape:
- `/en/projects`
- `/my/projects`

## Translation storage

Current status:
- No `messages/` directory exists yet. Nothing here is implemented.

Recommended structure:
- `messages/en/common.json`
- `messages/my/common.json`
- Optional per-feature split (`home.json`, `chat.json`, etc.) once size grows.

## String ownership rules

- No hardcoded user-facing copy in feature components when i18n is active.
- Use stable translation keys (avoid keys tied to current English sentence text).
- Keep navigation labels (`src/constants/navigation.ts`) locale-driven.

## Key files likely impacted

- `src/app/layout.tsx`
  - `<html lang>` should reflect active locale.
  - metadata locale/alternates should be locale-aware.
- `src/constants/navigation.ts`
  - avoid fixed English labels.
- `src/features/*`
  - move visible text to translation keys progressively.
- blog pipeline
  - decide whether to duplicate MDX content by locale or keep blog English-only initially.

## Migration order (recommended)

1. Add locale routing and locale detection/fallback.
2. Internationalize global layout/header/footer/navigation.
3. Internationalize home/about/projects pages.
4. Internationalize chat UI chrome.
5. Decide blog localization strategy.

## SEO notes

- Generate locale-specific canonical/alternate links (`hreflang`).
- Keep sitemap locale-aware if both locales are indexable.

## Quality bar

- Locale switch does not break route navigation.
- No mixed-language UI within the same page view (except intentionally untranslated content).
- Missing key behavior is explicit (fallback locale or error logging).
