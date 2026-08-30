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
  - Line animation preview: `src/app/(app)/(main)/line-animation/page.tsx` — unlinked, `noindex` preview of the main-text-coloured line reveal
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

  | id | model | reasoning effort | daily limit | cooldown |
  | --- | --- | --- | --- | --- |
  | `fast` (default) | `openai/gpt-oss-20b` | low | 10 | 3s |
  | `balanced` | `openai/gpt-oss-120b` | low | 6 | 18s |
  | `deep` | `openai/gpt-oss-120b` | medium | 3 | 43s |

  Groq decommissioned every Llama model in 2026; the roster moved to `gpt-oss`
  (open-weight, so Groq serves it on the free plan). `@ai-sdk/groq`'s
  `GroqChatModelId` union still lists the dead IDs and falls back to
  `string & {}`, so a decommissioned model is a runtime 404, never a type error.
  Verify against `GET https://api.groq.com/openai/v1/models` before changing it.

- Web analytics: `@vercel/analytics` — `<Analytics />` in `src/app/layout.tsx`
  - Hobby plan: 50,000 pageview events/month, 1-month reporting window, and **no custom
    events** (Pro-only). Pageviews only, by design — this is a portfolio, not a product.
  - Collects on Vercel deployments only; it no-ops in local dev.

- Error tracking: `@sentry/nextjs` — `src/instrumentation-client.ts` (browser),
  `src/sentry.server.config.ts` (Node), registered by `src/instrumentation.ts`, and
  `next.config.mjs` wrapped in `withSentryConfig`
  - **Errors only.** `tracesSampleRate` and both replay rates are `0`; tracing and replay
    are what burn the 5,000-errors/month free tier.
  - No `sentry.edge.config.ts` — this app has no edge runtime and no middleware.
  - `sentry.server.config.ts` keeps Sentry's dotted filename on purpose (see the naming
    exception in `CLAUDE.md`). Nothing auto-detects it — `instrumentation.ts` imports it by
    path — but matching the vendor docs beats matching local kebab-case here.
  - No-ops when `NEXT_PUBLIC_SENTRY_DSN` is unset, so forks build without a Sentry account.
  - `import-in-the-middle` and `require-in-the-middle` are direct dependencies on purpose.
    pnpm's layout leaves Sentry's OpenTelemetry transitive deps unresolvable from the
    project root, which Turbopack warns about and which can fail at runtime on Vercel.
  - Source maps upload only when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`
    are present at build time; without them production stack traces stay minified.
  - `src/app/api/sentry-check/route.ts` throws on purpose to verify the pipeline end to end.
    It is gated by `CRON_SECRET` (same pattern as the KV keepalive route) because an open
    error route lets crawlers burn the 5,000-errors/month free tier. Locally it returns 500
    without reporting, since the DSN is deliberately absent outside Vercel.

- Route execution and limits: `src/app/(chat)/api/chat/route.ts`
  - Provider: Groq (`@ai-sdk/groq`), streamed through the AI SDK UI message stream
  - `providerOptions.groq.reasoningFormat: "hidden"` — `gpt-oss` always reasons, and
    `message.tsx` renders only `text` parts, so reasoning is suppressed at the source
  - Stream errors are returned as a `{ error }` JSON envelope, matching
    `createErrorResponse`, so the client never renders raw provider text
  - Groq free plan ceiling: 1,000 requests/day and 200,000 tokens/day, shared
    across agents; the ~1,240-token system prompt makes tokens the real limit
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
- **One post embeds a tool.** `banner-prompt-spec` renders `<BannerPrompt />` (`src/features/blog/components/banner-prompt/`) — Radix `Tabs` with a **Build it** form and a **Raw prompt** panel (`raw-prompt.tsx`: no card, no syntax theme — the spec is wrapped prose on the page surface, with `STEP` lines and list markers carried by `fg-default` and `fg-brand`). The spec text lives in `src/features/blog/lib/banner-prompt/spec.ts`, split into four regions; `compile.ts` reuses the generation rules and self-check without the interview step, so the two tabs never drift. Do **not** paste the spec back into the MDX.
  - The form is English in both locales. The Burmese post already leaves option IDs and names untranslated (`M marble sculpture`, `E0 clean cutout`), and the prompt it produces is English regardless, so a Burmese wrapper would be half a translation. It carries `not-prose` because it renders inside the post's typography styles.
  - **The shape is a step run** (`step-flow.tsx`), and it departs from the research on purpose. `agent_docs/research-prompt-builder-ux.md` argued for one `<details>` over all eight groups and against a stepper (the NYT stopped shipping them because readers do not finish); the owner chose the run anyway. So read that doc for the **option** rules it still governs — pre-selected defaults, no accordion per group, two disclosure levels counting the tabs — not for the container. Nothing gates navigation: every step is reachable at any time, and only copy and download wait on the required answers, with the review step linking back to whatever is missing.
    - **The accent phrase is picked, not typed** (`headline-field.tsx`). It must be a literal substring of the headline or `preview.tsx` silently drops the accent colour and the model prints an accent nobody sees, so the words under the field are toggle buttons and `accentPhrase` is sliced out of the headline by character offset. `findSpan` derives the selection back from the stored string, which keeps `answers.accentPhrase` the only state; editing the headline out from under a stale accent clears it, so the required check stays honest. The run is contiguous by construction — a click past either end extends it, a click inside collapses to that word, and clicking a lone selected word clears it.
    - Six free-text fields were cut from the form without changing a byte of the compiled prompt: kicker, sub-line, and social proof were banner jargon that every reader left blank, and work/role duplicated the headline while prop is a choice the spec already makes better. Their brief lines are still emitted, now as constants — an absent line reads to the model as an omission to fill in, where `dropped` is an instruction. Adding a field back means a UI control **and** replacing its constant.
  - **The widget uses bounded, content-driven height.** The control surface has a modest responsive floor, grows with typical steps, and scrolls only after reaching its viewport-relative cap. The open step keeps its natural height and the fade ramp under it absorbs remaining floor space. Two traps, both of which read as tidying: the open step must stay `shrink-0`, or flex squashes its box while the controls keep their real height and spill over the ramp; and the ramp's fade is a mask on the container, not an opacity ladder per row — a ladder has to guess how many rows there is room for, and every row past its last entry renders invisible while still taking space.
    - **The preview and step navigation are the stable anchors, not every outer edge.** Short steps do not reserve the tallest step's empty space; long steps grow until their cap and then scroll. The Raw prompt tab keeps a separate compact height because it is an excerpted document, not a control step.
    - **The ramp has no minimum height, and that is the fix, not an oversight.** It yields to a long active step and disappears on the last step rather than preserving an empty floor.
  - **`preview.tsx` is a fit check, not a render**, and the caption says so. It composites the crop ratio, the palette hex, the background finish, the reader's own headline with the accent phrase picked out, and each platform's dead zone — LinkedIn's left profile rail, X's bottom-left quadrant. That last part is what earns it: a reader sees their headline collide with the avatar before spending a generation. The frame opens through `react-photo-view` using its custom DOM renderer, so the large viewer stays live as answers change and supports the same zoom, pan, pull-to-close, and Escape behavior as the examples gallery.
    - **It drops in the direction's own reference render, never a drawn figure.** An earlier version drew one, with a silhouette and CSS edge masks, and it read as a wireframe next to the real banners further down the post — the examples gallery answers *what will the art look like*, and a schematic cannot beat it at that. All twelve directions now carry a cutout (`ArtDirection.image`), so the dashed "artwork" box is a fallback that no longer fires; keep it, because a direction added without a render would otherwise render nothing at all. `image.mask` fades an edge the source frame cut through — A1 only, and it is per-image, not the reader's chosen edge effect.
    - Geometry comes from the spec, not from taste: 55/45 text-to-art split, headline cap height ≈10% of banner height per line, copy inside ~45% × ~45%. Keep them in step with `spec.ts` or the preview quietly starts lying.
    - **The inline box keeps a constant responsive height, and every platform letterboxes into it.** `--preview-h` is 7.5rem on mobile and 11.25rem from `sm`; the banner takes `width: min(100%, --preview-h × ratio)`, so it is height-bound until it is wider than the box and width-bound after. That keeps a platform change from moving the controls out from under the pointer. `w-full` would square the ratio off against the fixed height and squash every platform but the widest.
  - **The review step is a check-answers list, not the compiled text.** `buildAnswerRows()` in `review-step.tsx` lists only the reader's own choices, each with a Change link back to the step that set it; `buildBriefLines()` is deliberately not reused, because it also carries house rules nobody picked and those must not be presented as changeable. Copy and download still hand over the full `compileBannerPrompt()` (~21k characters). Review is one of the deliberately long steps that reaches the control surface's scroll cap.
  - **Four steps answer with a thumbnail instead of a sentence** — platform ratio, palette, background finish, lettering. They use `OptionField`'s media-card shape (`visuals.tsx` draws the thumbnails), which stacks the picture over a one-line label and moves the description to a single live caption under the group. The platform glyph draws every ratio inside one fixed-height stage on purpose: sizing each to its own ratio pads the whole grid row to the tallest. Lettering sets the reader's actual headline in the face it names.
  - **Art family is a tab strip, and the art note lives under it.** The two families are a set the directions belong to, so `Tabs variant="line"` draws that boundary; the family description line is gone because the tab already names it. Both families use the `tile` variant now that Painted has renders — the variant used to switch to `card` for whichever family lacked them, because an empty tile is worse than a card. One closed `<details>` under the tabs, "Fine-tune the artwork", holds both optional refinements: the edge effect and the free-text art note. NN/g's ceiling is one or two optional fields, and one that costs a whole step is worse than one that costs a disclosure. Those two demotions took the run from nine steps to seven.
    - **The edge effect is deliberately not a step of its own.** It was one, and it was the only control in the run the preview cannot draw — every other choice changes what you see, so a peer step that changes nothing reads as broken. Demoting it changed **no byte** of the compiled prompt: `compile.ts` still reads `answers.effectId`, and `DEFAULT_ANSWERS` still resolves it to E1. Verified by diffing the compiled output over 49 answer combinations before and after; same SHA. Letting the model pick the effect instead was rejected — `GENERATION_STEP` says "apply ONLY the selected effect", and an unlocked effect makes the same brief render differently twice.
    - The disclosure sits **outside** the tab panels. Inside them, switching family unmounts the panel and collapses whatever the reader just opened, and neither control is family-specific anyway.
    - The review step's "Edge effect" row links back to `art`, not to a step id that no longer exists — a stale one resolves to no step and silently bounces the reader to step one.
  - Option cards mark selection three ways — `fg-brand` border, tinted fill, and a check glyph. `outline-brand` measured 2.35:1 against the checked fill, under WCAG 1.4.11's 3:1, and colour alone fails 1.4.1. Do not revert any of the three.
  - This replaced a build-time fetch from a public Gist. The Gist stayed the source of truth so readers could fork it, which cost a network call, a fallback branch, `Revalidate 1h` on that one route, and a second comment surface next to Giscus. The repo is already public on GitHub, so fork-and-PR beats a Gist. The Gist still exists as a pointer at the post because its URL was shared.

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
