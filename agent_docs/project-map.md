# Project Map

Architecture and route map for `htetaunglin-coder.dev`. Verified against the code on 2026-07-29 — if something here contradicts the code, the code wins; fix this file in the same session.

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
  - Burmese post: `src/app/(app)/(blog)/my/blog/[slug]/page.tsx` under `src/app/(app)/(blog)/my/layout.tsx`. Both post routes render `src/features/blog/components/blog-post-view.tsx`; there is no Burmese index yet
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

**The blog only.** There is no i18n framework and no `messages/` directory; site navigation and the footer are English on every route, including Burmese ones, because they lead to English pages. `<html lang>` stays `en` in `src/app/layout.tsx`.

What ships today:

- Burmese posts live at `/my/blog/<slug>`, generated from `content/blog/my/` by `generateStaticParams`. A `/my` address for a post with no Burmese file 404s — `i18n.fallbackLanguage` is `null`, so `getPage(slugs, "my")` never returns the English post.
- A Burmese index at `/my/blog` lists Burmese posts only, with the same category tabs. `BlogIndexView` serves both locales; `src/lib/i18n.ts` exports `Locale` (`"en" | "my"`, inferred from `languages`).
- Blog furniture is a plain per-locale object in `src/features/blog/lib/blog-strings.ts` — heading, intro, tab labels, empty state, read-more, photo credit, author label, category names. `satisfies Record<Locale, BlogStrings>` makes a missing key a build error. English entries hold the raw frontmatter values for `series`, so English pages render as they always did.
- `src/features/blog/lib/blog-locale.ts` maps a locale to its date tag, font class, and blog path. The date mapping is load-bearing: the content locale `"en"` resolves to en-US in ICU, and this site formats English dates as en-GB (`26 July 2026`), so passing the content locale straight to `formatDate` silently restyles every English date. Burmese needs no such distinction — `"my"` already yields Burmese digits from the locale's own numbering system. Doto, Inter and Gloria Hallelujah carry no Myanmar glyphs, so Burmese routes swap the Myanmar face in wherever those are pinned.
- `lang="my"` sits on the subtrees holding Burmese words. The author name stays `lang="en"` in both locales so the structured-data author entity does not fragment across two spellings.
- `LanguageSwitch` (`src/features/blog/components/language-switch.tsx`) links between counterparts. On a post it renders only when `blogSource.getPage(post.slugs, otherLocale)` returns something — matching slugs are the only link between a pair, there is no frontmatter field, and there is deliberately no disabled or "coming soon" state. On an index it always renders, since both indexes exist. A Burmese-labelled control carries `myanmarFont` on the element itself, because English routes have no `/my` layout above them to declare the variable.
- Noto Sans Myanmar is declared in `src/lib/fonts.ts` and applied by `src/app/(app)/(blog)/my/layout.tsx`, not by the root layout. `/blog` is otherwise free of it — the one exception is the `LanguageSwitch` label above, which is why an English reader now fetches the woff2 on the blog index and on any post that has a translation. Its `@font-face` rules (~3 KB raw) do ship in the global CSS chunk, since the root layout imports `fonts.ts`; a separate font module would confine them to `/my`, and that trade was made knowingly.
- `[lang=my] :not(pre, pre *, code, code *) { font-family: inherit !important }` in `globals.css` pulls the face back over the `.blog` prose rules, which otherwise pin Latin faces on headings, links and quotes. `pre`/`code` are excluded so code stays Latin and monospace.
- Nothing is automatic: no header sniffing, no cookie, no redirect. Language does not persist across the site — `my` is a destination, not a mode.
- Every canonical points at itself, including Burmese ones. Pointing a Burmese page at its English counterpart would fold the two into one result and undo the reason for giving Burmese its own addresses.
- `postAlternates(slugs)` in `blog-locale.ts` builds a post's `hreflang` set: `en`, `my`, and `x-default` → English. It takes no locale — it asks the loader for *both* and lets the answer decide, so a pair emits the identical set from either end by construction rather than by two call sites agreeing. Used by both post routes and `sitemap.ts`; `localeAlternates({ en, my })` underneath it serves the two indexes, whose pair is unconditional. An untranslated post declares nothing at all.
- Entry to a cluster is gated on `!draft`, at **both** ends, because an `hreflang` advertises a URL to a crawler. Narrower than `LanguageSwitch`'s test on purpose: a draft translation is still worth linking to for a reader looking straight at it.
- Article JSON-LD carries `inLanguage`, from the content locale rather than `getDateLocale` — that one's regional subtag exists for date formatting and says nothing about the writing. `getArticleStructuredData` requires the field so a new caller cannot silently inherit the site's language.
- A post's breadcrumb climbs to its own index (`localeBlogPath`), so a Burmese post's trail reaches `/my/blog`. The blog crumb's label is a per-locale string; the Home crumb stays "Home" in both, because it leads to the English home page. English breadcrumb output is unchanged.
- Burmese share cards skip `/og` entirely: `getCldOgImageUrl` (already a dependency, used by `/og` itself) crops the post's own cover image to 1200×630 with no text drawn on it. `/og` renders the title into the card and its shaper handles Latin and Arabic only, so Burmese would arrive as boxes — or, given a Myanmar font, as malformed script with detached medials and unreordered prefix vowels, which reads worse than no text at all. English posts still use `/og` and are untouched. The Burmese index has no card of its own and inherits the site's static one; nothing renders Burmese through the generator.

`i18n-burmese-english.md` describes a wider site-level plan that is still unimplemented.

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
