# i18n Plan (Burmese + English)

This file defines the expected implementation direction for Burmese/English internationalization.

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
- `messages/` exists and is empty.

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
