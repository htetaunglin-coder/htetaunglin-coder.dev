# Research: Burmese (`my`) blog i18n with Fumadocs

Implementation mechanics for `/blog/[slug]` (en) + `/my/blog/[slug]` (my). Verified against the installed packages and the `.next` build output on 2026-07-30 — `fumadocs-core@16.0.8`, `fumadocs-mdx@13.0.5`, `fumadocs-ui@16.0.8`, `next@16.0.10`. If something here contradicts the code, the code wins; fix this file in the same session.

Nothing here is implemented. This is research for a decided design, not a description of shipped behavior.

## Answers up front

1. **`hideLocale` does not require the middleware.** It is read in exactly one place — `createGetUrl` — and only affects the string written into `page.url`. The middleware is a separate, opt-in export you would only need if you route through a `[lang]` dynamic segment.
2. **Recommended structure: a literal `my/` folder** inside the existing `(blog)` route group. No proxy file, no `[lang]` segment, both branches prerendered.
3. **`fallbackLanguage: null` gives exactly the requested 404 behavior** — per-locale storages are constructed independently, verified by running the installed loader.
4. **`source.config.ts` needs no i18n flag.** `fumadocs-mdx@13` has no `i18n` option at all; locale parsing happens entirely in `loader()`.
5. **The TOC heading is overridable** via `RootProvider`'s `i18n.translations`, using `defineI18nUI` from `fumadocs-ui/i18n`. `DocsPage`/`DocsLayout` take no locale prop.
6. **One premise in the brief is wrong and one design goal is not reachable as stated** — see [Things that break](#6-things-that-break).

---

## 0. Correction: the site is *not* fully statically generated today

From the committed build output (`.next/prerender-manifest.json`, built 2026-07-29):

- prerendered routes include `/`, `/about`, `/chat`, `/resume`, `/side-quests`, `/guest-book`, `/blog/<slug>` × 6, `/sitemap.xml`, `/robots.txt`, `/api/search`
- `/blog` is **absent**, and there is no `.next/server/app/blog.html`
- `/projects` is **absent** too

Both list pages read `searchParams` (`src/app/(app)/(blog)/blog/page.tsx:54`, `src/app/(app)/(main)/projects/page.tsx:58`), which opts them into request-time rendering. So `/blog` is already a dynamic route.

This does not change the recommendation — it just means "keep it static" applies to the post pages and the rest of the site, and the Burmese index will inherit the same dynamic behavior as the English index unless the category filter moves to a static route segment. Worth knowing before anyone reads a build log and blames i18n.

## 1. Does `hideLocale: 'default-locale'` require the middleware?

**No.** These are two independent mechanisms that the docs happen to describe together.

### `hideLocale` in URL generation

`node_modules/fumadocs-core/dist/source/index.js:516-530`:

```js
function createGetUrl(baseUrl, i18n) {
  const baseSlugs = baseUrl.split("/");
  return (slugs, locale) => {
    const hideLocale = i18n?.hideLocale ?? "never";
    let urlLocale;
    if (hideLocale === "never") {
      urlLocale = locale;
    } else if (hideLocale === "default-locale" && locale !== i18n?.defaultLanguage) {
      urlLocale = locale;
    }
    const paths = [...baseSlugs, ...slugs];
    if (urlLocale) paths.unshift(urlLocale);
    return `/${paths.filter((v) => v.length > 0).join("/")}`;
  };
}
```

That is the *entire* consumer of `hideLocale` inside the loader. It is a pure string function with no request context. Its output feeds `page.url` (`index.js:686`) and page-tree node URLs (`index.js:203`). Grep confirms no other read of `hideLocale` in `fumadocs-core/dist/source/`.

Verified by running the installed loader (see §3): with `hideLocale: 'default-locale'`, `en` pages get `/blog/alpha` and `my` pages get `/my/blog/alpha`.

### What the middleware actually does

`node_modules/fumadocs-core/dist/i18n/middleware.js`:

```js
return (request) => {
  const url = request.nextUrl;
  const pathLocale = languages.find(
    (locale) => url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  );
  if (!pathLocale) {
    if (hideLocale === "default-locale") {
      return NextResponse.rewrite(getLocaleUrl(request, defaultLanguage));
    }
    ...
  }
  if (hideLocale === "always" || hideLocale === "default-locale" && pathLocale === defaultLanguage) {
    const res = NextResponse.redirect(
      new URL(forceSlashPrefix(url.pathname.slice(`/${pathLocale}`.length)), request.url)
    );
    res.cookies.set(COOKIE, pathLocale);
    return res;
  }
  return NextResponse.next();
};
```

Its only job is to translate between *prefix-less public URLs* and a *`[lang]`-prefixed app directory*. `/blog/x` → rewrite to `/en/blog/x` so `app/[lang]/blog/[slug]` can serve it; `/en/blog/x` → redirect back to `/blog/x` so the canonical URL is the prefix-less one.

**If the route files live at the real public paths (`app/.../blog/[slug]` and `app/.../my/blog/[slug]`), there is nothing to translate and the middleware is dead weight.** Skip it.

Two consequences of skipping it, both acceptable:

- `/en/blog/x` will 404 rather than redirect to `/blog/x`. Since nothing ever generates that URL, no duplicate exists to consolidate.
- No `FD_LOCALE` cookie and no `Accept-Language` negotiation. Irrelevant with `hideLocale: 'default-locale'`, where the default locale is never auto-detected anyway (the `!pathLocale` branch short-circuits to `defaultLanguage` before `getLocale` is called).

### Why avoiding it matters here

- In Next 16 the file is `proxy.ts`, not `middleware.ts` — `node_modules/next/dist/lib/constants.js:277-280` defines both `MIDDLEWARE_FILENAME = 'middleware'` and `PROXY_FILENAME = 'proxy'`, and [nextjs.org/docs/app/api-reference/file-conventions/proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) states: *"The `middleware` file convention is deprecated and has been renamed to `proxy`."* Fumadocs' own Next guide already uses `proxy.ts` ([fumadocs.dev/docs/internationalization/next](https://www.fumadocs.dev/docs/internationalization/next)).
- Same page, version history: *"`v16.0.0` — Middleware is deprecated and renamed to Proxy. Proxy defaults to the Node.js runtime."* A proxy does not change a page's render mode (the execution-order list puts Proxy at step 3, before "Filesystem routes" at step 5), but every matched request now invokes a Node function ahead of the CDN hit. For a personal site that is fully prerendered today, that is a real regression for zero benefit.
- Same page: *"We recommend users avoid relying on Middleware unless no other options exist."*
- **Landmine if you do wire it up:** the `!pathLocale` branch rewrites *every* matched prefix-less path to `/en{path}`. With the matcher fumadocs documents (`'/((?!api|_next/static|_next/image|favicon.ico).*)'`), `/about` would be rewritten to `/en/about`, which does not exist — the entire non-blog site 404s. Any proxy here must be scoped to `matcher: ['/blog', '/blog/:path*']`.

## 2. Route file structure

### (a) Literal `my/` folder — **recommended**

```
src/app/(app)/(blog)/
├── api/search/route.ts
├── blog/
│   ├── layout.tsx        [new]  RootProvider, en translations
│   ├── page.tsx                 getPages("en")
│   └── [slug]/page.tsx          getPage([slug], "en")
└── my/
    └── blog/
        ├── layout.tsx    [new]  RootProvider, my translations
        ├── page.tsx      [new]
        └── [slug]/page.tsx [new]
```

`src/app/(app)/(blog)/layout.tsx` (currently just `<RootProvider>`) moves down into the two locale branches so each can carry its own translations. The `(blog)` group stays, purely for grouping.

- **Static:** yes. `/my/blog/[slug]` is an ordinary dynamic segment with `generateStaticParams`, prerendered exactly like `/blog/[slug]` is today.
- **Route groups:** fine. `.next/app-path-routes-manifest.json` shows the existing group mapping works (`"/(app)/(blog)/blog/[slug]/page": "/blog/[slug]"`), and [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) *"should not be included in the route's URL path."* `my` is a plain folder, so it does appear.
- **`hideLocale` asymmetry:** matches perfectly. `createGetUrl` emits `/blog/x` and `/my/blog/x`; the file tree provides exactly those two paths.
- **Duplication:** four small route files. Mitigate by extracting the rendering into `src/features/blog/components/` per the repo's own layering rule, leaving `page.tsx` as metadata + composition.

### (b) `[lang]` dynamic segment — **rejected**

`src/app/(app)/(blog)/[lang]/blog/[slug]/page.tsx` produces `/en/blog/x` and `/my/blog/x`. **There is no way to serve prefix-less `/blog/x` from a `[lang]` segment** — a dynamic segment always consumes one path segment. You would need the proxy rewrite from §1, which means: a Node function on every blog request, a hand-narrowed matcher to avoid 404ing the rest of the site, and `/blog` losing its literal route file. It also generates `lang: "en"` params that produce `/en/blog/*` prerendered pages whose only purpose is to be redirect targets.

The asymmetry the brief flags is real and disqualifying: `[lang]` cannot express "one locale has no prefix."

### (c) Fumadocs' own recommendation — **is (b)**

[fumadocs.dev/docs/internationalization/next](https://www.fumadocs.dev/docs/internationalization/next) prescribes `app/[lang]` plus `proxy.ts`:

```ts
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { i18n } from '@/lib/i18n';

export default createI18nMiddleware(i18n);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

That guide assumes the whole app is i18n'd under one dynamic segment. This repo is i18n'ing one branch of a mostly-English site, so it does not apply cleanly. Deviating is the right call — but it means the fumadocs docs will not describe your setup, which is worth a comment in `src/lib/i18n.ts`.

## 3. Per-locale `generateStaticParams`

### Loader semantics, confirmed from source

`node_modules/fumadocs-core/dist/source/index.js:385-418`:

```js
function buildContentStorage(files, buildFile, plugins, i18n) {
  const parser = parsers[i18n.parser ?? "dot"];
  const storages = {};
  ...
  const fallbackLang = i18n.fallbackLanguage !== null ? i18n.fallbackLanguage ?? i18n.defaultLanguage : null;
  function scan(lang) {
    if (storages[lang]) return;
    let storage;
    if (fallbackLang && fallbackLang !== lang) {
      scan(fallbackLang);
      storage = new FileSystem(storages[fallbackLang]);   // ← inherits
    } else {
      storage = new FileSystem();                          // ← independent
    }
    for (const item of normalized) {
      const [path, locale = i18n.defaultLanguage] = parser(item.path);
      if (locale === lang) storage.write(path, item);
    }
    ...
  }
  for (const lang of i18n.languages) scan(lang);
  return storages;
}
```

With `fallbackLanguage: null`, `fallbackLang` is `null`, the `if` is never taken, and every locale gets a fresh `FileSystem`. **No inheritance.** (`FileSystem`'s constructor copies the parent's files when given one — `index.js:296-310` — which is the inheritance mechanism.)

The `dir` parser, `index.js:366-371`:

```js
dir(path) {
  const [locale, ...segs] = path.split("/");
  if (locale && segs.length > 0 && isLocaleValid(locale))
    return [segs.join("/"), locale];
  return [path];
}
```

### Verified empirically

Ran the installed `fumadocs-core/dist/source/index.js` against synthetic files with the exact decided config (`defaultLanguage: 'en'`, `languages: ['en','my']`, `hideLocale: 'default-locale'`, `parser: 'dir'`, `fallbackLanguage: null`, `baseUrl: '/blog'`):

| input path | result |
| --- | --- |
| `en/alpha.mdx`, `my/alpha.mdx` | `/blog/alpha` (en) and `/my/blog/alpha` (my) |
| `en/beta.mdx` only | `/blog/beta`; `getPage(['beta'], 'my')` → `undefined` |
| `my/burmese-only.mdx` only | `/my/blog/burmese-only`; `getPage(['burmese-only'])` → `undefined` |
| `loose.mdx` (no locale dir) | treated as `en` → `/blog/loose` |
| `series-x/nested.mdx` | **silently dropped from every locale** |

Also confirmed: `getPages()` with no argument returns **both** locales' pages; `pageTree` becomes `{ en, my }`; `generateParams()` emits `{ slug, lang }` for *both* locales including `lang: 'en'`, so it is unusable with the asymmetric route tree. Flipping `fallbackLanguage` back to the default made `my` return all four English posts — the exact behavior the design rejects.

The `series-x/nested.mdx` row is the sharp edge: under `parser: 'dir'`, **any** top-level subdirectory of `content/blog` is read as a locale name (`isLocaleValid` only rejects empty strings and anything containing a digit — `index.js:362-364`), and files under a directory that is not in `languages` vanish without a warning. `content/blog/` must contain nothing but `en/` and `my/`.

### API signatures, from the installed `.d.ts`

`node_modules/fumadocs-core/dist/builder-BynMF2Pa.d.ts:107,120,111,129`:

```ts
getPages: (language?: string) => Page<Config['source']['pageData']>[];
getPage: (slugs: string[] | undefined, language?: string) => Page<Config['source']['pageData']> | undefined;
getLanguages: () => { language: string; pages: Page<...>[] }[];
generateParams: <TSlug extends string = 'slug', TLang extends string = 'lang'>(slug?: TSlug, lang?: TLang) => (Record<TSlug, string[]> & Record<TLang, string>)[];
```

Locale is the **second positional argument** to `getPage`, the **first and only** to `getPages`. Both default to `defaultLanguage` / all-locales respectively (`index.js:620`, `index.js:640`).

### Concrete code

```ts
// src/app/(app)/(blog)/blog/[slug]/page.tsx
export function generateStaticParams(): { slug: string }[] {
  return blogSource.getPages("en").map((page) => ({ slug: page.slugs[0] }));
}

// Structural 404 for anything not enumerated above, instead of relying on notFound().
export const dynamicParams = false;
```

```ts
// src/app/(app)/(blog)/my/blog/[slug]/page.tsx
export function generateStaticParams(): { slug: string }[] {
  return blogSource.getPages("my").map((page) => ({ slug: page.slugs[0] }));
}

export const dynamicParams = false;
```

`dynamicParams` defaults to `true` ([route segment config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)), which is why the current build shows `/blog/[slug]` under `dynamicRoutes` with `"fallback": null` — unlisted slugs are rendered on demand and then `notFound()`. Setting it to `false` makes the 404 a routing fact rather than a render-time one, and guarantees the route is prerender-only. Trade-off: new posts require a rebuild, which is already true here since content is committed. Note the version-history entry on that page — `dynamicParams` is removed when Cache Components is enabled; this repo does not enable `cacheComponents`, so it is available.

Keep the `notFound()` guards in the page and `generateMetadata` regardless — `getPage` still returns `undefined` for a slug that exists in the other locale.

## 4. `source.config.ts` changes

**None required.** `fumadocs-mdx@13.0.5` has no i18n surface. `node_modules/fumadocs-mdx/dist/core-DB7TdlyC.d.ts` defines `BaseCollection` as `{ dir, files? }`, `DocCollection` adds `{ type: 'doc', postprocess?, mdxOptions?, async?, schema? }`, and `GlobalConfig` is `{ collections?, plugins?, mdxOptions?, lastModifiedTime?, experimentalBuildCache? }`. There is no `i18n` key anywhere in the file. (Older majors exposed `defineDocs({ i18n: true })`; that is gone.)

Locale handling is 100% a `loader()` concern, and it works identically for `defineCollections({ type: 'doc' })` with a custom zod schema as it does for `defineDocs` — the collection only produces `{ info: { path, fullPath }, data }` entries, and the loader parses `info.path`.

`info.path` is documented as *"virtualized path for Source API"* (`node_modules/fumadocs-mdx/dist/index.d.ts:15-19`) and is relative to the collection `dir`. Confirmed against the currently generated `.source/index.ts`, where `dir: "content/blog"` yields `{"path":"banner-prompt-spec.mdx","fullPath":"content/blog/banner-prompt-spec.mdx"}`. The default glob is recursive — `node_modules/fumadocs-mdx/dist/chunk-2HXTGJBI.js:20`:

```js
const patterns = files ?? [`**/*.{${supportedFormats.join(",")}}`];
```

so `content/blog/en/foo.mdx` is picked up and emits `path: "en/foo.mdx"`, which the `dir` parser splits into `["foo.mdx", "en"]`.

So `source.config.ts` stays byte-identical. The layout matches the official example at [fumadocs.dev/docs/page-conventions](https://www.fumadocs.dev/docs/page-conventions):

```
content/docs
├── en
│   ├── meta.json
│   └── get-started.mdx
└── cn
    ├── meta.json
    └── get-started.mdx
```

One nuance worth knowing: leaving English files at `content/blog/*.mdx` (no `en/` folder) *also* works — the `dir` parser falls through to `defaultLanguage` for a path with no directory component, verified above with `loose.mdx`. Moving them into `en/` is still the right call for symmetry and to make the "no stray subdirectories" rule obvious.

The only file that changes is `src/lib/source.ts`:

```ts
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx/runtime/next";
import { blog } from "@/.source";
import { i18n } from "@/lib/i18n";

export const blogSource = loader({
  baseUrl: "/blog",
  i18n,
  source: createMDXSource(blog),
});
```

```ts
// src/lib/i18n.ts  [new]
import { defineI18n } from "fumadocs-core/i18n";

// Deliberately NOT the setup fumadocs documents: we hand-write the route files at
// /blog and /my/blog instead of using app/[lang] + proxy.ts, so `hideLocale` here
// only shapes page.url — no rewrite layer is involved.
export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: ["en", "my"],
  hideLocale: "default-locale",
  parser: "dir",
  fallbackLanguage: null,
});

export type Locale = (typeof i18n.languages)[number];
```

The existing destructured re-exports in `src/lib/source.ts` (`getBlogPost`, `getBlogPosts`, `pageBlogTree`, `type BlogPost`) have no consumers anywhere in `src/`. Note that `pageTree`'s type changes from `Root` to `Record<string, Root>` once `i18n` is passed (`builder-BynMF2Pa.d.ts:86`) — deleting the dead exports is cleaner than fixing them, but that is a separate recommendation, not part of this diff.

## 5. fumadocs-ui: `DocsLayout`, `DocsPage`, TOC

### Neither component takes a locale

- `DocsPageProps` (`node_modules/fumadocs-ui/dist/page.d.ts:67`) destructures `editOnGithub, breadcrumb, footer, lastUpdate, container, full, tableOfContentPopover, tableOfContent, toc, article, children`. No locale, no i18n.
- `DocsLayoutProps` (`node_modules/fumadocs-ui/dist/layouts/docs/index.d.ts:8-15`) extends `BaseLayoutProps` and adds `tree`, `sidebar`, `tabMode`, `containerProps`.
- `BaseLayoutProps` does have `i18n?: boolean | I18nConfig` (`node_modules/fumadocs-ui/dist/layouts/shared/index.d.ts:33`), but it is **only a visibility flag for the language toggle** — `layouts/docs/index.js:44` and `:58` use it as `i18n ? <LanguageToggle .../> : null`. It carries no locale into rendering. This repo sets `nav: { enabled: false }` and `sidebar: { enabled: false }`, so the toggle never mounts regardless. A language switcher must be hand-built.

### Where "On this page" comes from

`node_modules/fumadocs-ui/dist/layouts/docs/page.js:9`:

```js
return (_jsxs("h3", { id: "toc-title", ...props, className: cn(...), children: [_jsx(Text, { className: "size-4" }), _jsx(I18nLabel, { label: "toc" })] }));
```

`I18nLabel` reads `I18nContext` (`node_modules/fumadocs-ui/dist/contexts/i18n.js`), whose default is:

```js
export const defaultTranslations = {
    search: 'Search',
    searchNoResult: 'No results found',
    toc: 'On this page',
    tocNoHeadings: 'No Headings',
    lastUpdate: 'Last updated on',
    chooseLanguage: 'Choose a language',
    nextPage: 'Next Page',
    previousPage: 'Previous Page',
    chooseTheme: 'Theme',
    editOnGithub: 'Edit on GitHub',
};
```

The context is only populated when `RootProvider` receives an `i18n` prop — `node_modules/fumadocs-ui/dist/provider/base.js`:

```js
if (i18n) {
  body = _jsx(I18nProvider, { ...i18n, children: body });
}
```

and `I18nProvider` merges `{ ...defaultTranslations, ...translations }`. So overriding is a partial merge — supply only the keys you want in Burmese.

`RootProviderProps.i18n` is `Omit<I18nProviderProps, 'children'>` = `{ locale, onLocaleChange?, translations?, locales? }` (`node_modules/fumadocs-ui/dist/provider/base.d.ts`).

### `defineI18nUI`

`node_modules/fumadocs-ui/dist/i18n.js`:

```js
export function defineI18nUI(config, options) {
    const { translations } = options;
    return {
        provider(locale = config.defaultLanguage) {
            return {
                locale,
                translations: translations[locale],
                locales: config.languages.map((locale) => ({
                    locale,
                    name: translations[locale]?.displayName ?? locale,
                })),
            };
        },
    };
}
```

The returned object is `{ locale: string, translations?: object, locales: {locale,name}[] }` — fully serializable, so it can be spread from a Server Component layout. `onLocaleChange` is a function and therefore *cannot* be passed from a server layout; you do not need it here, because the only consumer is fumadocs' own `LanguageToggle`, which this repo never renders. (Its default `onChange` in `provider/base.js` pushes `/${value}/...` unconditionally, which would produce a 404 `/en/blog/x` under this design — another reason not to use it.)

```ts
// src/lib/i18n.ts  (continued)
import { defineI18nUI } from "fumadocs-ui/i18n";

export const { provider: fumadocsI18nProvider } = defineI18nUI(i18n, {
  translations: {
    en: { displayName: "English" },
    my: {
      displayName: "မြန်မာ",
      // TODO: owner to write the Burmese copy — these keys map to
      //   toc → the "On this page" heading above the clerk TOC
      //   tocNoHeadings, search, searchNoResult, lastUpdate,
      //   chooseLanguage, nextPage, previousPage, chooseTheme, editOnGithub
      toc: "…",
      tocNoHeadings: "…",
    },
  },
});
```

Do not ship machine-guessed Burmese here. The four keys this design actually surfaces are `toc` and `tocNoHeadings` (clerk TOC), plus `search`/`searchNoResult` if search is ever wired up; the rest are dead with `nav`, `sidebar`, and `footer` disabled.

```tsx
// src/app/(app)/(blog)/my/blog/layout.tsx  [new]
import { RootProvider } from "fumadocs-ui/provider/next";
import type React from "react";
import { fumadocsI18nProvider } from "@/lib/i18n";

const MyBlogLayout = ({ children }: { children: React.ReactNode }) => (
  <RootProvider i18n={fumadocsI18nProvider("my")}>{children}</RootProvider>
);

export default MyBlogLayout;
```

`src/app/(app)/(blog)/blog/layout.tsx` is the same with `"en"`, and `src/app/(app)/(blog)/layout.tsx` is deleted.

## 6. Things that break

Ordered by how much they cost.

### 6a. `<html lang>` cannot be `my` on `/my/blog/*` without restructuring — real limitation

`src/app/layout.tsx:90` hardcodes `<html lang="en">`. A nested layout cannot change it, and the root layout has no way to learn the pathname without `headers()`, which forces the whole tree dynamic — disqualified by the static requirement.

Three options, none free:

1. **Accept `lang="en"` initially.** Wrong for screen readers and for hreflang consistency, but nothing else breaks. Fastest.
2. **Set it client-side** — a tiny `"use client"` component in the Burmese layout doing `document.documentElement.lang = "my"` in an effect. Correct after hydration; the prerendered HTML still says `en`.
3. **Multiple root layouts** via top-level route groups — `src/app/(en)/layout.tsx` and `src/app/(my)/layout.tsx`, each rendering its own `<html lang>`, with no `src/app/layout.tsx`. Fully static and fully correct. [Route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) documents this use case, with two caveats that apply: *"If you navigate between routes that use different root layouts, it'll trigger a full page reload"* (fine for a language switch) and *"make sure your home route (/) is defined within one of the route groups"*. Cost: every existing route moves under `(en)/`, and the root shell is duplicated.

Recommend (1) for the first landing, (3) as a follow-up if the Burmese content grows past a few posts. Do not let this block the routing work.

### 6b. `getPages()` with no argument now returns both locales — three call sites

Verified above. Every existing no-arg call silently changes meaning:

- `src/app/(app)/(blog)/blog/page.tsx:56` — the English index would list Burmese posts. Must become `getPages("en")`.
- `src/app/(app)/(blog)/api/search/route.ts:9` — both locales collapse into one Orama index. Either scope to `getPages("en")` or switch to `createI18nSearchAPI('advanced', { i18n, indexes: [...withLocale] })` (`node_modules/fumadocs-core/dist/search/server.d.ts`), which also exposes `localeMap` for per-locale tokenizers. Orama has no Burmese tokenizer, so `localeMap` for `my` would be UNVERIFIED territory — leaving search English-only is the low-risk choice. (Aside: the search dialog does not appear to be wired to the static index today — `RootProvider` is called with no `search` options while the route uses `staticGET`. Pre-existing, out of scope.)
- `src/app/sitemap.ts:12` — here the new behavior is *desirable*: `/my/blog/*` entries appear for free with correct URLs, since `page.url` already carries the prefix. Add hreflang while you are there; `MetadataRoute.Sitemap` entries accept `alternates: { languages }` (`node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts:567-569`).

### 6c. `generateParams()` is unusable — do not reach for it

`index.js:660-672` emits `{ slug, lang }` for every locale including `lang: "en"`. With no `[lang]` segment there is no param to bind it to. Use the explicit per-locale `getPages(locale)` form from §3.

### 6d. `content/blog/` becomes locale-only

Covered in §3. Any non-locale subdirectory silently loses its files. If a `series/` or `drafts/` folder is ever added under `content/blog/`, posts disappear from the build with no error. Consider a one-line guard in `src/lib/source.ts` that throws when `blogSource.getPages().length` is less than the raw `blog.length` from `@/.source`.

### 6e. `next/font` is latin-only

`src/lib/fonts.ts` loads Inter, Gloria Hallelujah, and Doto with `subsets: ["latin"]` (Doto has no Myanmar coverage at all). Burmese text will fall back to whatever the OS provides — unreliable, and on Windows it renders as boxes without a Myanmar font installed.

From `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`:

| family | weights | subsets |
| --- | --- | --- |
| `Padauk` | 400, 700 | latin, latin-ext, **myanmar** |
| `Noto_Sans_Myanmar` | 100–900 | **myanmar** |
| `Noto_Serif_Myanmar` | 100–900 | **myanmar** |

Add one with `subsets: ["myanmar"], variable: "--font-myanmar", preload: false` (matching the existing `Gloria_Hallelujah` / `Doto` pattern) and apply the variable on the Burmese layout wrapper. `preload: false` keeps it off English pages. Note `next/font` calls must be at module scope, so this goes in `src/lib/fonts.ts` and the class is applied where the locale is known — not in `<body>`.

### 6f. Route groups: no conflicts

`(app)`, `(blog)`, and the literal `my` folder coexist. The build manifest confirms group stripping works, and there is no path collision — `(blog)/blog/*` → `/blog/*`, `(blog)/my/blog/*` → `/my/blog/*`.

### 6g. hreflang and canonical

`page.url` already carries the right prefix, so `alternates.canonical: absoluteUrl(page.url)` keeps working unchanged in both routes. Add reciprocal `languages` only for translations that exist:

```ts
const en = blogSource.getPage([slug], "en");
const my = blogSource.getPage([slug], "my");
const languages: Record<string, string> = {};
if (en) languages.en = absoluteUrl(en.url);
if (my) languages.my = absoluteUrl(my.url);

return {
  alternates: { canonical: absoluteUrl(page.url), languages },
  // ...
};
```

Also update `openGraph.locale` — `src/app/layout.tsx:47` hardcodes `"en_US"`; the Burmese post route should override with `"my_MM"`.

### 6h. Duplication, and where the shared code goes

Four route files render two near-identical pages. Per this repo's own rule (`page.tsx` = metadata + composition, behavior in `src/features/<domain>`), extract:

- `src/features/blog/components/blog-post-view.tsx` — everything currently inside the `BlogPage` return, taking `{ page }`
- `src/features/blog/components/blog-index-view.tsx` — the list body, taking `{ posts, activeCategory, basePath }`

`basePath` matters: the category tab links in `blog/page.tsx:100` are hardcoded to `/blog` and must become `/my/blog` on the Burmese index.

### 6i. Verification

There is no test runner. Verify with `pnpm types:check`, `pnpm check`, `pnpm build`, then read `.next/prerender-manifest.json` and confirm `/my/blog/<slug>` appears under `routes` (not `dynamicRoutes`), and that `/my/blog/<slug-with-no-burmese-file>` 404s.

## Unverified

- That `info.path` includes the subdirectory for `content/blog/en/foo.mdx` is inferred from the documented "virtualized path relative to `dir`" semantics, the recursive default glob, and the currently generated `.source/index.ts`. It is not directly observed, because no file has been moved yet. Confirm by moving one post and re-running `pnpm postinstall`.
- Orama tokenizer behavior for Burmese (`localeMap` in `createI18nSearchAPI`) — UNVERIFIED. Burmese has no whitespace word boundaries; assume the default tokenizer performs poorly and keep search English-only until measured.
- Whether Vercel's CDN behavior changes measurably with a scoped `proxy.ts` — UNVERIFIED. The Next docs establish the execution order and that Proxy runs on the Node.js runtime, but not the per-request latency cost. Moot under the recommended design, which has no proxy.
