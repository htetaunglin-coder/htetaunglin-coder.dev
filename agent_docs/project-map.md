# Project Map

Architecture and route map for `htetaunglin-coder.dev`. Verified against the code on 2026-08-01 — if something here contradicts the code, the code wins; fix this file in the same session.

## High-level architecture

- Framework: Next.js App Router (`src/app`)
- Feature modules: `src/features/*`
- Shared UI and primitives: `src/components/*` (`ui/`, `animations/`, `decorations/`, `icons/`)
- Shared utilities/config: `src/lib/*`, `src/constants/*`
- Global styles and Tailwind v4 theme tokens: `src/styles/globals.css`
- Blog content: `content/blog/<locale>/*.mdx` via Fumadocs (`source.config.ts`)

## Route map

- Shells:
  - `src/app/layout.tsx` — root shell, global metadata/OG
  - `src/app/(app)/layout.tsx`
  - `src/app/(app)/(main)/layout.tsx`
  - `src/app/(app)/(blog)/layout.tsx`
- Pages:
  - Home: `src/app/(app)/(main)/(home)/page.tsx`
    - Name pronunciation sound initializes `AudioContext` only after user interaction to satisfy autoplay policies
    - Entrance reveals use the Motion wrappers in `src/components/animations/fade-animation.tsx`; hero text starts at non-zero opacity so desktop LCP still resolves, and below-the-fold contact code loads near viewport via `src/features/home/components/lazy-contact.tsx`
    - Selected project imagery passes explicit responsive `sizes` through `src/components/ui/theme-image.tsx` to avoid oversized Cloudinary downloads
  - Projects list/detail: `src/app/(app)/(main)/projects/page.tsx`, `src/app/(app)/(main)/projects/[id]/page.tsx`
    - Project content is static data in `src/features/projects/data.ts`; detail pages are SSG via `generateStaticParams`
    - Year filtering via query param: `year=all|before-2025|2025|2026`
    - Cover in-view animation runs once per page visit (resets on refresh/revisit), then is disabled after first user interaction (for example, changing year tabs)
    - Implementation note: the `projects_cover_interacted` cookie is intentionally short-lived and exists only to bridge client interaction state back to the server-rendered page during tab/query navigation
  - About: `src/app/(app)/(main)/about/page.tsx` (age derived from `NEXT_PUBLIC_DOB` in `src/features/about/utils.ts`)
  - Side quests: `src/app/(app)/(main)/side-quests/page.tsx`
  - Guest book: `src/app/(app)/(main)/guest-book/page.tsx` — Giscus thread via `src/components/comment.tsx`; `robots: noindex`
  - Blog list/post: `src/app/(app)/(blog)/blog/page.tsx`, `src/app/(app)/(blog)/blog/[slug]/page.tsx`
  - Burmese list/post: `src/app/(app)/(blog)/my/blog/page.tsx`, `src/app/(app)/(blog)/my/blog/[slug]/page.tsx` — both under `src/app/(app)/(blog)/my/layout.tsx`, which applies the Myanmar font to the subtree. Both post routes render `blog-post-view.tsx` and both indexes render `blog-index-view.tsx`, each taking a `locale`. Both indexes are request-time rendered because they read `searchParams`
  - Resume: `src/app/resume/page.tsx` (the printable source for the PDF is the standalone `resume/resume.html`, rendered by `pnpm resume:pdf`)
  - Chat page: `src/app/(chat)/chat/page.tsx`
- Route handlers:
  - Chat streaming API: `src/app/(chat)/api/chat/route.ts`
  - Blog search API: `src/app/(app)/(blog)/api/search/route.ts`
  - OG image generation: `src/app/og/route.tsx` — dynamic `ImageResponse`; reads Cloudinary at module scope, so `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is required at **build** time
  - KV keepalive cron: `src/app/api/cron/kv-keepalive/route.ts` — `Bearer ${CRON_SECRET}` gated, scheduled in `vercel.json` (`0 3 */3 * *`) to stop the free-tier KV database being deprovisioned

## AI and chat boundary

- Prompt and provider config: `src/lib/ai.ts`
  - `systemPrompt` is the owner's own first-person voice — tone changes there are a content decision
  - Also exports a `gemini` provider (`@ai-sdk/google`) that the chat route does **not** currently use; `GOOGLE_GENERATIVE_AI_API_KEY` is not in `.env.example`
- Agent roster (single source of truth): `src/features/chat/lib/agents.ts`

  | id | model | daily limit | cooldown |
  | --- | --- | --- | --- |
  | `fast` (default) | `llama-3.1-8b-instant` | 10 | 3s |
  | `balanced` | `openai/gpt-oss-20b` | 6 | 18s |
  | `deep` | `llama-3.3-70b-versatile` | 3 | 43s |

- Route execution and limits: `src/app/(chat)/api/chat/route.ts`
  - Provider: Groq (`@ai-sdk/groq`), streamed through the AI SDK UI message stream
  - Global per-IP cap of 10 messages/day **on top of** the per-agent daily limit above
  - Per-agent, per-IP cooldown stored in KV between requests
  - Max user message length: 200 chars
  - History window sent to the model: last 5 user/assistant pairs
  - `maxDuration = 30`, `stopWhen: stepCountIs(2)`
  - Rate-limit, cooldown, and KV failures **fail open** with a logged error — never a crash
  - The stream emits `data-agent-selection` and `data-rate-limit` parts the UI reads
- Chat UI: `src/features/chat/chat-view.tsx` and `src/features/chat/components/*` (streaming markdown handled in `components/markdown/`)

## Contact/email boundary

- Contact server action: `src/features/home/actions/email.ts` (`"use server"`)
  - Daily email rate limit per IP: 3, prefix overridable via `KV_RATELIMIT_PREFIX`
  - Sends via Resend; missing `RESEND_API_KEY` / `RESEND_TO_EMAIL_ADDRESS` returns a user-facing error rather than throwing
- GitHub contribution graph data: `src/features/home/api/contribution.ts`

## Content boundary (blog)

- Collection definition and frontmatter schema: `source.config.ts`; loader in `src/lib/source.ts`; locale config in `src/lib/i18n.ts`
- Content files: `content/blog/<locale>/*.mdx` — `en` and `my`. `content/blog/` holds **nothing but locale directories**: the loader's `parser: "dir"` reads the first directory as a locale and silently discards files under any other name. `src/lib/source.ts` counts loaded pages against source files and throws if any went missing.
- Locale scoping: the English index, the English post route, and the search index call `getPages("en")` / `getPage(slugs, "en")`. `src/app/sitemap.ts` is deliberately unscoped so it spans every locale; `page.url` already carries the `/my` prefix.
- Required frontmatter: `title`, `description`, `author`, `date`, `image` (`url`, `author_name`, `author_link`), `series` (1–2 of `technology` | `thoughts`). Optional: `tags`, `draft`. A malformed field fails the build.
- `draft: true` means unpublished, and every public surface honours it: the post still renders at its real URL so the author can read it, but carries `robots: noindex, follow`, and it is absent from both blog indexes, the sitemap, the search index, and any `hreflang` cluster. It is deliberately still reachable by direct link, and `LanguageSwitch` still points at a draft counterpart. Add a new surface that lists posts and you must filter it too — the field was introduced wired into one place only, and the gap went unnoticed for months.
- Blog list filtering: `src/app/(app)/(blog)/blog/page.tsx`
  - Query param `category` supports `all` (default), `tech`, `life`
  - Mapping: `tech -> series: technology`, `life -> series: thoughts`

## Metadata and SEO boundary

- Site config: `src/lib/site-config.ts` (`appUrl` falls back to `http://localhost:3000`)
- Global metadata/OG: `src/app/layout.tsx`; JSON-LD helpers in `src/lib/structured-data.ts`
- Sitemap/robots: `src/app/sitemap.ts`, `src/app/robots.ts`

## i18n status

**Shipped, and blog-only.** English at `/blog`, Burmese at `/my/blog`, both with posts and an index. No i18n framework, no `messages/` directory; site navigation and the footer stay English on every route, and `<html lang>` stays `en` in `src/app/layout.tsx`.

Where it lives:

- `src/lib/i18n.ts` — loader locale config and the `Locale` type (`"en" | "my"`, inferred from `languages`)
- `src/lib/source.ts` — the loader, plus a build guard that throws if the locale parser silently dropped a post
- `content/blog/<locale>/` — one directory per locale; a translated pair is two files sharing a filename, with no linking metadata
- `src/features/blog/lib/blog-strings.ts` — `INDEX_STRINGS` (English on both indexes, not per-locale) and `BLOG_STRINGS` (per-locale, post page only); `blog-locale.ts` — date tag, font class, blog path, `hreflang` sets
- `src/features/blog/components/language-switch.tsx` — the control between counterparts

**Read `i18n-burmese-english.md` before changing any of it.** Several behaviours here look like bugs and are not — the absent language control on untranslated posts, the English nav around a Burmese article, the text-free Burmese share card — and three findings in that file will otherwise be re-litigated at real cost.

## Environment variables

Documented in `.env.example`:

- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DOB`, `NEXT_PUBLIC_GITHUB_REPO_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — **required at build time**; `next-cloudinary` throws without it
- `NEXT_PUBLIC_GISCUS_REPO`, `NEXT_PUBLIC_GISCUS_REPO_ID`
- `GROQ_API_KEY`
- `RESEND_API_KEY`, `RESEND_TO_EMAIL_ADDRESS`
- `CRON_SECRET`
- `GOOGLE_SITE_VERIFICATION_ID`
- KV/Upstash: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

Read by code but **missing from `.env.example`**:

- `GOOGLE_GENERATIVE_AI_API_KEY` (`src/lib/ai.ts`, currently unused path)
- `KV_RATELIMIT_PREFIX` (optional override in `src/features/home/actions/email.ts`)

## CI

`.github/workflows/lint.yml` runs `pnpm check`, `pnpm types:check`, and `pnpm build` on pull requests to `main` and pushes to `main`. The build step supplies placeholder `NEXT_PUBLIC_*` values because a few are read at module scope; real values live in Vercel. There is no test runner in this repo.
