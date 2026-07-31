# Burmese (`my`) blog i18n

Describes what **shipped**. Verified against the code on 2026-08-01 — if something here contradicts the code, the code wins; fix this file in the same session.

An earlier version of this file proposed full-site locale routing with an `app/[locale]` segment, a `messages/` catalogue, locale-driven navigation, and a locale-switching `<html lang>`. **None of that was built, and it is not a backlog.** It was considered and rejected; the reasons are under [Traps](#traps--do-not-re-litigate) and [Out of scope](#out-of-scope).

## Scope: the blog, and nothing else

Burmese exists on the blog only. Home, projects, about, side quests, guest book, chat, and resume are English, as are the site navigation and footer on every route including Burmese ones. `<html lang>` stays `en` in `src/app/layout.tsx`.

This is a bilingual blog on an English site, not a bilingual site.

## Content layout

Posts live in `content/blog/<locale>/*.mdx` — `en` and `my`. `content/blog/` holds **nothing but locale directories**.

A translated pair is two files with the same filename in different locale directories. That is the entire link between them: no frontmatter field, nothing to maintain, nothing that can fall out of sync. Whether a counterpart exists is answered by asking the loader for that slug in the other locale.

Three kinds of post, all first-class:

| Shape | Reader sees |
| --- | --- |
| English only | `/blog/<slug>`. No language control. |
| Burmese only | `/my/blog/<slug>`. Absent from the English index. Not a translation of anything. |
| Both | Either address, each canonical to itself, a control between them. |

Slugs are ASCII in both languages. Burmese lives in the title, description, and body. Myanmar text has a long-standing encoding split between two incompatible schemes, and baking that into a permanent published identifier is a liability that cannot be fixed without breaking links.

## Loader configuration

`src/lib/i18n.ts` — every setting is load-bearing:

- `defaultLanguage: "en"`, `languages: ["en", "my"]`. `Locale` is inferred from `languages`, so adding a locale turns every unhandled `switch` and string table into a type error.
- `hideLocale: "default-locale"` — English keeps its bare, already-indexed URLs; Burmese gets a `/my` prefix. This is why moving existing posts into `content/blog/en/` changed no URL.
- `parser: "dir"` — the first directory under `content/blog` is the locale, stripped before the slug is computed.
- `fallbackLanguage: null` — a missing translation resolves to **nothing**, never the English post at a second address. Also what makes the content-loss guard in `src/lib/source.ts` work at all; give the locales a fallback and each inherits the other's files, the count can never drop, and the guard becomes a permanent no-op.

Nothing here touches routing. It only tells `loader()` how to read the content tree and what `page.url` should look like.

## Routes

Written at their real paths, not behind a `[lang]` segment, so they stay statically generated.

| Path | File |
| --- | --- |
| `/blog` | `src/app/(app)/(blog)/blog/page.tsx` |
| `/blog/<slug>` | `src/app/(app)/(blog)/blog/[slug]/page.tsx` |
| `/my/blog` | `src/app/(app)/(blog)/my/blog/page.tsx` |
| `/my/blog/<slug>` | `src/app/(app)/(blog)/my/blog/[slug]/page.tsx` |

`src/app/(app)/(blog)/my/layout.tsx` wraps the Burmese subtree and applies the Myanmar font variable. Both post routes render `BlogPostView`; both indexes render `BlogIndexView`, which takes a `locale`.

Both indexes are request-time rendered because they read `searchParams` for the category filter. That predates this work and is not caused by it.

`generateStaticParams` on the Burmese route lists only slugs that genuinely exist under `content/blog/my`, so a `/my` address for an untranslated post 404s.

## Strings, fonts, dates

**Strings.** `src/features/blog/lib/blog-strings.ts` is a plain keyed object, `satisfies Record<Locale, BlogStrings>` so a missing key is a build error. About a dozen strings; a translation framework would be more machinery than content.

Scope is the blog's own furniture — heading, intro, tab labels, empty state, read-more, photo credit, author label, category names, breadcrumb crumb. The rule is **chrome follows the destination, not the page**: text describing the Burmese post in front of the reader is Burmese; text leading to English pages stays English.

Category identity is unchanged: the underlying `series` keys stay as they are and only their display labels are translated. The English entries hold the raw frontmatter values, so introducing this table restyled nothing.

**Fonts.** Noto Sans Myanmar is declared in `src/lib/fonts.ts` and applied by the `/my` layout rather than the root layout, so it is not shipped to the whole site. It is **not** true that English readers never fetch it: `LanguageSwitch` inlines the font variable whenever its label is Burmese, and the English index always renders that control, so `/blog` and every translated post do fetch the woff2. `localeFontClass` in `blog-locale.ts` swaps the face in wherever the design pins Doto, Inter, or Gloria Hallelujah — none of which carry Myanmar glyphs. A `[lang=my]` rule in `globals.css` pulls the face back over the `.blog` prose rules, excluding `pre`/`code` so code stays Latin and monospace.

Do not set `font-feature-settings` on Burmese text. Myanmar shaping features are required features the browser applies automatically.

The `@font-face` rules themselves (~3 KB raw) do ship in the global CSS chunk, because the root layout imports `fonts.ts`. A separate font module would confine them to `/my`; that trade was made knowingly. The woff2 is what matters, and it is only fetched where a Burmese glyph is rendered.

**Dates.** `getDateLocale` maps content locale to BCP-47: `en` → **`en-GB`**, `my` → `my`. The `en-GB` is not cosmetic — the content locale `"en"` resolves to en-US in ICU, and this site has always formatted English dates as `26 July 2026`. Passing the content locale straight to `formatDate` silently restyles every English date on the site. `my` yields Burmese digits from the locale's own numbering system, which is what the major Burmese publications and Burmese Wikipedia do.

## Discovery surfaces

- **Canonical points at itself**, always, including Burmese. Pointing a Burmese page at its English counterpart would fold the two into one result.
- **`hreflang`** — `en`, `my`, `x-default` → English, from two functions in `blog-locale.ts`:
  - `postAlternates(slugs)` for posts, called by both post routes and the sitemap's post entries. It takes no locale — it asks the loader for both and lets the answer decide, so both ends of a pair emit the identical set by construction. Untranslated posts declare nothing, and drafts are excluded at both ends.
  - `localeAlternates({ en, my })` underneath it, called directly by both indexes and the sitemap's index entries with hardcoded paths. Their pair is unconditional: both indexes always exist, so it can never be half-present and never needs the loader.
- **Structured data** carries `inLanguage`, and a post's breadcrumb climbs to its own index, so a Burmese trail reaches `/my/blog`. The author name stays Latin in both languages so the author entity does not fragment across two spellings.
- **Sitemap** is deliberately unscoped so it spans both locales; `page.url` already carries the prefix.
- **Search is English-only.** The search library has no Burmese tokenizer.
- **Drafts** join no public surface: `noindex`, and absent from both indexes, the sitemap, the search index, and any `hreflang` cluster. Still reachable by direct link.

## Traps — do not re-litigate

Three findings that cost real research time. Each looks wrong from the outside.

**1. The preview-image renderer cannot shape Myanmar script.** `/og` uses a library carrying shaping support for Latin and Arabic only. This is *not* a missing-font problem: with no font you get boxes, and **supplying a Myanmar font makes it worse** — malformed Burmese with detached medials, visible viramas where consonants should stack, and unreordered prefix vowels. Malformed script reads as not knowing the language; absent script reads as a plain photo. Burmese posts therefore bypass `/og` entirely and use their cover image cropped to card size with no text on it. Do not "fix" this by adding a font.

**2. `parser: "dir"` silently drops files in unrecognised directories.** A post in `content/blog/draft/` does not error — it ceases to exist. `src/lib/source.ts` counts loaded pages against source files and throws. That guard is why the failure is loud. Do not remove it, and see `fallbackLanguage` above for what quietly disables it.

**3. The framework's own i18n guidance would break this site.** Fumadocs and Next both document a `[lang]` dynamic segment plus a rewriting proxy. Rejected twice over: it would make the blog routes dynamic, and the default proxy matcher rewrites every unprefixed path, which is the entire non-blog site. Following the docs here is not an improvement.

## Deliberate, and will look like bugs

Each of these has been considered. Read the reason before changing it.

- **No language control on an untranslated post.** There is no disabled or "coming soon" variant. A missing translation 404s, so a visible control leading nowhere would contradict that, and a post nobody intends to translate is not pending. Its absence needs no explanation.
- **English site navigation wrapped around a Burmese article.** The navigation leads to English pages, so it is English. The markup describes the truth: the nav really is English and the article really is Burmese.
- **The Burmese preview card has no text on it.** See trap 1.
- **`lang="my"` is set per element, not on the document root — and not on the `/my` layout either.** The layout only supplies the font variable; each component marks the elements that actually hold Burmese words (`blog-post-view.tsx`, `blog-index-view.tsx`, `blog-post-showcase.tsx`, `language-switch.tsx`). Do not go looking for it in the layout. Nearest-ancestor wins, so the English nav and footer correctly keep the document language; changing the root would need client-side mutation or multiple root layouts.
- **A Burmese label on an English route carries the font variable inline.** English routes sit outside `/my`, so nothing above them declares `--font-noto-sans-myanmar`. This is why an English reader fetches the woff2 on the blog index and on any translated post.
- **A translated post keeps the original's publication date.** The date field means "when this was written", and must keep meaning exactly that; a translation date would give one field two meanings depending on an invisible property of the post. If a newly translated older post ever needs to surface as new, add a separate optional field rather than overloading this one. (Note that neither index sorts today — order is whatever the loader returns — so this is a rule about what the field *means*, not about display order.)
- **`sitemap.ts` is unscoped while the English index and search are scoped.** Deliberate and asymmetric; there is a comment there saying not to add a locale argument.

## Out of scope

Not oversights — decided against:

- **Full-site i18n**, a translation framework, or a `messages/` catalogue. A dozen strings do not warrant one.
- **Automatic language detection or persistence.** No header sniffing, no cookie, no redirect. Header language is a weak signal — many Burmese speakers use English-locale devices — and locale redirects are a known cause of alternate-language pages never being indexed, since crawlers predominantly present English headers. The accepted consequence: `my` is a destination, not a mode.
- **Burmese search**, **Burmese comment interface** (threads split per language automatically, since the addresses differ), **Burmese-script slugs**, **RSS**, and **the AI chat's awareness of Burmese posts**.
- **Build-time social image generation.** The path forward if Burmese cards ever need real text, using the headless browser this project already runs for the resume PDF. Not now.
- **A suggestion banner** offering Burmese to likely Burmese readers. Deferred; revisit if the explicit control proves too quiet.

## Research provenance

The two research notes **stay as standalone references**. They carry source-level citations behind the decisions above and are far longer than this file; folding them in would bury the design, and deleting them would lose the receipts. They are historical records of what was verified and when — this file is the current design, and wins if they disagree.

- `research-i18n-fumadocs.md` — loader and routing mechanics
- `research-i18n-typography.md` — typography, date formatting, preview-image rendering
