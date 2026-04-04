# Project Map

## High-level architecture

- Framework: Next.js App Router (`src/app`)
- Feature modules: `src/features/*`
- Shared UI and primitives: `src/components/*`
- Shared utilities/config: `src/lib/*`, `src/constants/*`
- Blog content: `content/blog/*.mdx` via Fumadocs (`source.config.ts`)

## Route map

- Main app shell:
  - `src/app/layout.tsx`
  - `src/app/(app)/layout.tsx`
  - `src/app/(app)/(main)/layout.tsx`
- Pages:
  - Home: `src/app/(app)/(main)/(home)/page.tsx`
  - Projects list/detail: `src/app/(app)/(main)/projects/page.tsx`, `src/app/(app)/(main)/projects/[id]/page.tsx`
  - About: `src/app/(app)/(main)/about/page.tsx`
  - Side quests: `src/app/(app)/(main)/side-quests/page.tsx`
  - Guest book: `src/app/(app)/(main)/guest-book/page.tsx`
  - Blog list/post: `src/app/(app)/(blog)/blog/page.tsx`, `src/app/(app)/(blog)/blog/[slug]/page.tsx`
  - Resume: `src/app/resume/page.tsx`
  - Chat page: `src/app/(chat)/chat/page.tsx`
- APIs:
  - Chat streaming API: `src/app/(chat)/api/chat/route.ts`
  - Blog search API: `src/app/(app)/(blog)/api/search/route.ts`

## AI and chat boundary

- System prompt and Google provider setup:
  - `src/lib/ai.ts`
- Chat model execution and limits:
  - `src/app/(chat)/api/chat/route.ts`
  - Current behavior:
    - Groq model: `llama-3.1-8b-instant`
    - Daily rate limit per IP: 10 messages
    - Max user message length: 200 chars
    - History window sent to model: last 5 user/assistant pairs
- Chat UI:
  - `src/features/chat/chat-view.tsx`
  - Components in `src/features/chat/components/*`

## Contact/email boundary

- Contact action:
  - `src/features/home/actions/email.ts`
  - Daily email rate limit per IP: 3 messages
- Environment and rate limit keys are documented in `.env.example`.

## Content boundary (blog)

- Content source definitions:
  - `source.config.ts`
  - `src/lib/source.ts`
- Blog content files:
  - `content/blog/*.mdx`

## Metadata and SEO boundary

- Site config:
  - `src/lib/site-config.ts`
- Global metadata/OG:
  - `src/app/layout.tsx`
- Sitemap/robots:
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`

## Current i18n status

- No full i18n framework is wired yet.
- `messages/` directory exists but is currently empty.
- `<html lang>` is currently hardcoded to `en` in `src/app/layout.tsx`.

## Common env vars in use

From `.env.example` and runtime code:
- `NEXT_PUBLIC_APP_URL`
- `GROQ_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY` (provider initialized in `src/lib/ai.ts`)
- `RESEND_API_KEY`, `RESEND_TO_EMAIL_ADDRESS`
- `NEXT_PUBLIC_GISCUS_REPO`, `NEXT_PUBLIC_GISCUS_REPO_ID`
- `GOOGLE_SITE_VERIFICATION_ID`
- KV/Upstash variables for rate limiting
