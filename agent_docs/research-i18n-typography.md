# Research: Burmese Typography and Date Formatting

Research notes for the planned `my` locale (see `agent_docs/i18n-burmese-english.md`, still unimplemented). Verified against the installed `next@16.0.10` and live primary sources on 2026-07-30. **Nothing here is implemented.** If something contradicts the code, the code wins — fix this file in the same session.

Scope was fixed before research started: the font is **Noto Sans Myanmar**, loaded only on `/my/*`, not globally.

## TL;DR

| Question | Answer |
| --- | --- |
| Noto Sans Myanmar via `next/font/google`? | **Yes.** `Noto_Sans_Myanmar`, `subsets: ["myanmar"]`, `weight` is **required** |
| Renders correctly in browsers? | **Yes.** No `font-feature-settings` needed |
| Renders correctly in OG images (satori)? | **No. Fundamentally broken.** See [the critical finding](#3-satori-cannot-shape-myanmar-critical) |
| `toLocaleDateString("my")` digits? | **Burmese digits** (`၂၀၂၆ ဇူလိုင် ၃၀`) — CLDR default is `mymr` |
| What do real Burmese sites do? | **Burmese digits in visible dates**, Latin in machine-readable attributes. 3 of 4 surveyed |
| Nested-layout font loading? | **Supported and preferred** — preload scopes to routes under that layout |

One unrelated but concrete finding fell out of this: [the OG route is currently uncacheable](#42-the-og-route-is-already-paying-for-every-crawler-hit), which is the cost problem the comment at the top of `src/app/og/route.tsx` is worried about.

---

## 1. Noto Sans Myanmar via `next/font/google`

**Available.** No self-hosting or `next/font/local` needed.

Verified in the installed declarations at `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts:11228`:

```ts
export declare function Noto_Sans_Myanmar<T extends CssVariable | undefined = undefined>(options: {
    weight: '100' | '200' | ... | '900' | Array<'100' | ... | '900'>;
    style?: 'normal' | Array<'normal'>;
    display?: Display;
    variable?: T;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
    subsets?: Array<'myanmar'>;
}): T extends undefined ? NextFont : NextFontWithVariable;
```

Backing metadata, `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`:

```json
"Noto Sans Myanmar": {
  "weights": ["100","200","300","400","500","600","700","800","900"],
  "styles": ["normal"],
  "subsets": ["myanmar"]
}
```

- **Import name:** `Noto_Sans_Myanmar` (underscores for spaces — [Next.js font docs](https://nextjs.org/docs/app/api-reference/components/font)).
- **Subset value:** `"myanmar"`. This is the only accepted value; the type is `Array<'myanmar'>`. `"burmese"` is not a subset name.
- **Weights:** 100–900, `normal` style only, no italic.
- **`weight` is required.** The property has no `?`, and there is no `'variable'` value in the union.

### Gotcha: Google serves a variable font, but the installed Next thinks it is static

The live [Google Fonts metadata endpoint](https://fonts.google.com/metadata/fonts/Noto%20Sans%20Myanmar) reports it as variable with two axes:

```
axes: [{tag: 'wdth', min: 62.5, max: 100}, {tag: 'wght', min: 100, max: 900}]
subsets (coverage): ['latin', 'latin-ext', 'myanmar']
license: ofl
```

and `https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@100..900` does return `font-weight: 100 900`.

But `font-data.json` above is a **build-time snapshot baked into next@16.0.10** and lists it as static with discrete weights. So with the installed version you must pass explicit weights. This is harmless — Google serves the *same* variable `.woff2` file for every requested weight (both the `wght@400` and `wght@700` blocks resolve to `AlZZ_y1ZtY3ymOryg38hOCSdOnFq0FP9_gnYM_ME0QeqLzzW6GJXXRE.woff2`), and `findFontFilesInCss` dedupes by URL (`node_modules/next/dist/compiled/@next/font/dist/google/find-font-files-in-css.js`). **Asking for 3 weights costs 1 file.**

### Gotcha: `subsets` controls preloading, not downloading

From `find-font-files-in-css.js`, every `@font-face` in the Google CSS response is downloaded and self-hosted; `subsets` only decides which get a `<link rel="preload">`:

```js
fontFiles.push({ googleFontFileUrl, preloadFontFile: !!subsetsToPreload?.includes(currentSubset) });
```

The CSS response for this family contains **three** blocks — `myanmar`, `latin-ext`, `latin` — so all three are self-hosted regardless. That is fine: each carries a `unicode-range`, so the browser only fetches what the page actually needs. Measured payloads:

| Subset | `unicode-range` | woff2 size |
| --- | --- | --- |
| `myanmar` | `U+1000-109F, U+200C-200D, U+25CC, U+A92E, U+A9E0-A9FE, U+AA60-AA7F, U+116D0-116E3` | **150.4 KB** (153,980 B) |
| `latin` | `U+0000-00FF, …` | 30.9 KB (31,596 B) |
| `latin-ext` | `U+0100-02BA, …` | UNVERIFIED (not downloaded) |

150 KB is the real cost of a Burmese page. It is a large script; that is unavoidable.

### Working snippet for `src/lib/fonts.ts`

Current file defines Inter, Gloria_Hallelujah, and Doto and exports a `fonts` array of CSS variables (spread onto `<body>` at `src/app/layout.tsx:94`). Add a **separate export** rather than pushing into `fonts` — see [§5](#5-scoping-the-font-to-my) for why.

```ts
import { Doto, Gloria_Hallelujah, Inter, Noto_Sans_Myanmar } from "next/font/google";

// ... existing fontInter / fontGloriaHallelujah / doto unchanged ...

// Not in the global `fonts` array — see agent_docs/research-i18n-typography.md.
// Loading this in the /my layout scopes the preload to Burmese routes only.
const fontNotoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-myanmar",
  display: "swap",
  fallback: ["Myanmar Text", "Myanmar Sangam MN", "Padauk", "sans-serif"],
});

export const burmeseFont = fontNotoSansMyanmar.variable;
```

Typechecked against the installed Next with `tsc --strict` (exit 0). The negative control — `subsets: ["burmese"]` — correctly fails with `Type '"burmese"' is not assignable to type '"myanmar"'`.

The `fallback` chain is the Unicode Consortium's own list of Unicode-correct Myanmar system fonts: *"Myanmar Text (included in Windows), Myanmar Sangam MN (included in macOS and iOS), and Noto Sans Myanmar (included in Android) … the best font as of early 2022 is Padauk, an open source font from SIL Global"* ([Unicode Myanmar FAQ](https://www.unicode.org/faq/myanmar.html)).

**Padauk is a viable alternative** and is also on Google Fonts with `subsets: ["latin", "latin-ext", "myanmar"]` and weights 400/700 (same `font-data.json`). It covers minority Myanmar-script languages better. Noto Sans Myanmar is the right call for Burmese and pairs better with Inter.

---

## 2. Myanmar rendering correctness in browsers

**No special CSS is needed.** Browsers shape Myanmar with HarfBuzz; the font ships the tables to drive it.

Measured directly from the downloaded TTF (`fontTools` 4.63.0):

```
total glyphs      : 942
cmap-mapped glyphs: 564
=> only reachable via GSUB substitution: 378

GSUB scripts: ['latn', 'mym2']     features: abvs blwf blws ccmp locl   (80 lookups)
GPOS scripts: ['DFLT','latn','mym2'] features: dist kern mark mkmk       (7 lookups)
```

`mym2` is the OpenType Myanmar-v2 shaping model. `blwf` builds stacked (subjoined) consonants, `abvs`/`blws` place above- and below-base marks, and `mark`/`mkmk` in GPOS position the vowel signs and medials. Reordering of the prefix vowel `ေ` is done by the shaper itself, not by a font feature.

Rendered `မြန်မာဘာသာ`, `ကျွန်တော်`, `ဗုဒ္ဓ`, `ကြေးမုံ`, and `၂၉ ဇူလိုင် ၂၀၂၆` in headless Chrome with only `font-family` set: **all correct.** Ya-yit wraps its base consonant, `ဓ` stacks beneath `ဒ` with no visible virama, and `ေ` reorders to the left of its cluster.

- **Do not set `font-feature-settings`.** The features above are *required* features that the shaper applies from the `mym2` script table automatically. Manually listing them in CSS risks disabling the ones you omit.
- **Do set `lang="my"`** on the Burmese subtree. It drives the `locl` feature and font fallback selection, and it is what `agent_docs/i18n-burmese-english.md` already plans for `<html lang>`.

### Zawgyi: a real risk, but not one this site should try to solve

Zawgyi is a legacy non-Unicode font hack that occupies the same U+1000–U+109F code points with different semantics. From the [Unicode Myanmar FAQ](https://www.unicode.org/faq/myanmar.html):

> "There are several *ad hoc* font encodings in common use, all needing specific fonts to render text. ZawgyiOne, Zawgyi 2008, and Myazedi are most commonly used."

Unicode assigns *"Unique code points for each consonant, vowel, and modifier, regardless of visual appearance"*; Zawgyi uses *"multiple code points for characters and combined renderings, leading to interchange chaos."* Zawgyi bytes in a Unicode font produce *"dotted characters or overlapping lines, and also incorrect characters."*

The FAQ also notes: *"Currently, much Myanmar-language text online still uses font encoding."*

This is not hypothetical. VOA Burmese's own byline renders as `၁၅ မတ္၊ ၂၀၂၅` — `မတ္` carries a trailing virama where correct Unicode is `မတ်`. RFA's masthead date reads `၂ဝ၂၆` using U+101D LETTER WA in place of U+1040 DIGIT ZERO.

Detection is possible but imperfect — *"Because some strings are valid in both Zawgyi and Unicode, it is not always possible to achieve 100% accuracy in distinguishing the two."* Google's [myanmar-tools](https://github.com/google/myanmar-tools) ships an ML detector (npm `myanmar-tools@1.2.0`, 243 KB unpacked, **last published 2020-07-29**).

**Recommendation: do nothing.** This site authors its own content, so it controls the encoding — just make sure the MDX is Unicode. Client-side Zawgyi detection only matters for user-submitted text, and the only such surface here is Giscus (`src/components/comment.tsx`), which renders inside a GitHub iframe this site does not style. Shipping a stale 243 KB detector to solve a problem the site does not have would be the wrong trade.

The one thing worth doing is free: **serve `lang="my"` and correct Unicode**, and let the reader's browser do the rest.

---

## 3. Satori cannot shape Myanmar (CRITICAL)

**This is the finding that should drive the design.** `ImageResponse` will not render Burmese correctly no matter which font is loaded, because satori does not implement Myanmar shaping.

### Evidence from the bundled source

Satori parses fonts with a fork of opentype.js — `@shuding/opentype.js@1.4.0-beta.0`, visible in the bundle path comment inside `node_modules/next/dist/compiled/@vercel/og/index.node.js`. There is **no HarfBuzz**: `grep -c harfbuzz` over that 721 KB bundle returns `0`. The strings `Myanmar`, `myanmar`, and `mymr` do not appear anywhere in it.

The complete set of shaping features opentype.js applies, from `Font.prototype.defaultRenderOptions` in that bundle:

```js
Font.prototype.defaultRenderOptions = {
  kerning: true,
  features: [
    /**
     * these 4 features are required to render Arabic text properly
     * and shouldn't be turned off when rendering arabic text.
     */
    { script: "arab", tags: ["init", "medi", "fina", "rlig"] },
    { script: "latn", tags: ["liga", "rlig"] }
  ]
};
```

Only `arab` and `latn`. And the context dispatcher confirms nothing else is reachable:

```js
Bidi.prototype.applyFeaturesToContexts = function() {
  if (this.checkContextReady("arabicWord")) { applyArabicPresentationForms.call(this); applyArabicRequireLigatures.call(this); }
  if (this.checkContextReady("latinWord")) { applyLatinLigatures.call(this); }
  if (this.checkContextReady("arabicSentence")) { reverseArabicSentences.call(this); }
};
```

For Myanmar, `stringToGlyphs` degrades to a per-codepoint `charToGlyphIndex` `cmap` lookup. **Zero of the font's 80 `mym2` GSUB lookups and 7 GPOS lookups execute.** Since 378 of the font's 942 glyphs are reachable *only* through GSUB, satori can never produce 40% of the glyph set Burmese needs — and with no GPOS `mark`/`mkmk`, every vowel sign and medial is drawn at the glyph origin instead of its anchor.

The satori README says the same thing in one line ([README.md:338–340](https://github.com/vercel/satori#language-and-typography)):

> "Advanced typography features such as kerning, ligatures and other OpenType features are not currently supported.
>
> RTL languages are not supported either."

Upstream is aware and has been for four years. [vercel/satori#83 "Switch to Harfbuzz"](https://github.com/vercel/satori/issues/83), opened by the project creator on 2022-07-27, is **still open**, because HarfBuzz *"supports a couple of more complex scripts and OpenType features"* — but it is *"pretty low priority at the moment as we need to improve the typography algorithm first."* The same root cause was reported for Devanagari in [vercel/satori#516](https://github.com/vercel/satori/issues/516) (2023-07-04, closed without a shaping fix).

### Evidence from actually rendering it

Rendered identical strings through the installed `next/og` with the real Noto Sans Myanmar TTF, and through headless Chrome as a reference. Reproduction scripts are in this session's scratchpad; re-derivable in ~20 lines.

| Input | Chrome (correct) | satori |
| --- | --- | --- |
| `မြန်မာဘာသာ` | ya-yit wraps `မ` | `ြ` drawn as a detached glyph colliding with `မ` |
| `ဗုဒ္ဓ` | `ဓ` stacked beneath `ဒ`, no virama shown | three separate letters with a **visible virama mark** below |
| `ကြေးမုံ` | `ေ` reordered to the **left** of the `ကြ` cluster | `ေ` left in logical order after `က`; `ြ` detached |
| `၂၉ ဇူလိုင် ၂၀၂၆` | correct | **digits correct**, `ဇူ`/`လိုင်` marks misplaced |

The one bright spot: **Burmese digits `၀-၉` survive satori intact.** They are simple non-combining glyphs with a direct `cmap` entry, so a date rendered as bare numerals is safe even though surrounding words are not.

### What the OG route does today

`src/app/og/route.tsx` passes no `fonts` option, so satori falls back to the bundled `noto-sans-v27-latin-regular.ttf` (27 KB), which has no Myanmar coverage. Rendering `မြန်မာဘာသာ ဘလော့ဂ်` today produces **a row of tofu boxes** — every Burmese character an empty rectangle. Confirmed by rendering it.

`@vercel/og` does ship a dynamic per-language font loader, but `languageFontMap` in `node_modules/next/dist/compiled/@vercel/og/language/index.d.ts` covers only `ja-JP, ko-KR, zh-CN, zh-TW, zh-HK, th-TH, bn-IN, ar-AR, ta-IN, ml-IN, he-IL, te-IN, devanagari, kannada`. **Myanmar is not in it.** Nothing rescues this automatically.

### Options, ranked

1. **Keep OG titles for `/my/*` in English/Latin.** Zero new code, zero new bytes, no broken glyphs shipped to Facebook and X. Burmese pages can still carry a Burmese `<title>` and `og:description` — only the *rasterized* text has to stay Latin.
2. **Generate Burmese OG images with the real browser at build time.** The repo already drives headless Chrome for `resume:pdf` in `package.json`. A build step that screenshots an HTML card gets correct shaping for free and removes the per-request function call entirely. This is the honest fix, and it also resolves the cost worry in the route's own comment.
3. **Pre-shape with harfbuzzjs and emit positioned SVG paths.** `harfbuzzjs@1.4.0` is 1.0 MB unpacked (`harfbuzz.wasm` alone is 381 KB). Satori has no glyph-run input, so you would shape to an SVG and embed it as an `<img>`. Correct, but a lot of machinery and it blows past Vercel's 500 KB bundle limit unless fetched at runtime.
4. **Load the font and ship it anyway.** Do not. Mangled Burmese in a social card is worse than English, and it is the kind of error a Burmese reader notices instantly.

**Recommendation: option 1 now, option 2 when the `/my` routes actually exist.**

---

## 4. `ImageResponse` font API, sizes, and Vercel cost

### 4.1 Exact API

Per [the Next.js docs](https://nextjs.org/docs/app/api-reference/functions/image-response):

```jsx
new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

The installed types agree. `node_modules/next/dist/server/og/image-response.d.ts:10` forwards `ConstructorParameters<OgModule['ImageResponse']>` to the compiled package, where `node_modules/next/dist/compiled/@vercel/og/types.d.ts:95-101` defines:

```ts
interface FontOptions {
    data: Buffer | ArrayBuffer;
    name: string;
    weight?: Weight;   // 100 | 200 | ... | 900
    style?: Style;     // 'normal' | 'italic'
    lang?: string;
}
```

Two things the prose docs understate: `data` also accepts a Node `Buffer` (so `readFile()` works with no conversion), and there is an undocumented `lang` field.

Format constraint, from both Next.js and [Vercel](https://vercel.com/docs/og-image-generation): *"Only `ttf`, `otf`, and `woff` font formats are supported. To maximize the font parsing speed, `ttf` or `otf` are preferred over `woff`."* Satori's README agrees: *"WOFF2 is not supported at the moment."*

**This rules out the 150 KB `.woff2` Google serves to modern browsers.** You must request the TTF (send a legacy `User-Agent` to the CSS API) or bundle a file.

### 4.2 The OG route is already paying for every crawler hit

Independent of i18n, and directly relevant to the comment at the top of `src/app/og/route.tsx`.

Vercel's docs claim: *"`@vercel/og` automatically adds the correct headers to cache computed images on the CDN, helping reduce cost and recomputation."* The compiled package does exactly that — from `index.node.js`:

```js
"cache-control": process.env.NODE_ENV === "development" ? "no-cache, no-store" : "public, immutable, no-transform, max-age=31536000"
```

But **Next.js's own wrapper overrides it.** `node_modules/next/dist/server/og/image-response.js`:

```js
const headers = new Headers({
  'content-type': 'image/png',
  'cache-control': process.env.NODE_ENV === 'development' ? 'no-cache, no-store' : 'public, max-age=0, must-revalidate'
});
if (options.headers) { /* caller's headers win */ }
```

Confirmed at runtime — constructing an `ImageResponse` yields `cache-control: public, max-age=0, must-revalidate`. **The route is uncacheable at the CDN as written**, so every crawler and every link preview is a fresh function invocation. That is the cost problem the comment is worried about, and it is one line to fix, since the wrapper lets caller headers win:

```tsx
return new ImageResponse(<div …/>, {
  width: 1200,
  height: 628,
  headers: { "cache-control": "public, immutable, no-transform, max-age=31536000" },
});
```

Worth raising as its own change, separate from any i18n work.

### 4.3 Measured font sizes

Real bytes, downloaded and measured:

| Artifact | Size | Glyphs | Notes |
| --- | --- | --- | --- |
| `notosansmyanmar` full TTF (w400) | **177.6 KB** (181,864 B) | 942 | what you get from the gstatic TTF URL |
| `notosansmyanmar` full TTF (w700) | 177.8 KB (182,048 B) | — | |
| `myanmar` subset woff2 | 150.4 KB (153,980 B) | — | **unusable in satori** |
| `pyftsubset` U+1000–109F + ASCII, layout kept | 119.6 KB (122,456 B) | 572 | |
| `pyftsubset` same, layout tables dropped | 32.9 KB (33,724 B) | 256 | ← all satori can ever reach |
| **Google Fonts `text=` subset** | **8.3 KB** (8,516 B) | 42 | see below |
| Google Fonts full-family download | 784,832 B | — | per the metadata endpoint |

The `text=` parameter is the sharpest tool. Vercel lists it as a supported feature (*"Ability to download the subset characters of the font from Google Fonts"*). Requesting exactly the characters in a title:

```
https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400&text=<uri-encoded title>
```

with a legacy `User-Agent` returns a `format('truetype')` URL for an **8.3 KB** font carrying only 42 glyphs — and it *does* preserve `GSUB`/`GPOS` with the `mym2` script (`abvs blws locl` / `kern mark`). So payload size is comfortably solved and stays far under the 500 KB bundle ceiling.

**It does not matter.** Satori still will not run those lookups. Verified by rendering with the 8.3 KB `text=` subset — identical breakage to the full font. The size problem was never the blocker.

### 4.4 Per-request fetch on Vercel

Measured locally (M-series Mac, warm):

- `fonts.gstatic.com` TTF fetch: **182 ms**, 181,864 bytes
- `ImageResponse` render, no custom font: 166 ms cold, then 4–6 ms
- `ImageResponse` render, +177 KB Myanmar TTF: 4–6 ms

Font parsing is not the cost; the **network round trip is**, and it lands on every uncached invocation. Combined with §4.2, a per-request font fetch on the free tier means every social crawler triggers a function call *and* an outbound fetch.

Mitigations, in order of preference: fix the cache header (§4.2) so the CDN absorbs repeat hits; then read the font from disk with `readFile` (Vercel: *"Local resources can be loaded directly using `fs.readFile`"*) rather than fetching; then hoist to module scope, which satori's own docs recommend — *"We recommend you define global fonts instead of creating a new object and pass it to satori for better performance"* ([satori#590](https://github.com/vercel/satori/issues/590)).

For Burmese specifically, none of this is needed if OG text stays Latin (§3, option 1).

---

## 5. Scoping the font to `/my`

**The nested-layout pattern is correct and is what the docs prescribe.** Preloading is route-scoped, not global. From [the Next.js font docs](https://nextjs.org/docs/app/api-reference/components/font):

> "When a font function is called on a page of your site, it is not globally available and preloaded on all routes. Rather, the font is only preloaded on the related routes based on the type of file where it is used:
>
> * If it's a **unique page**, it is preloaded on the unique route for that page.
> * If it's a **layout**, it is preloaded on all the routes wrapped by the layout.
> * If it's the **root layout**, it is preloaded on all routes."

So calling `Noto_Sans_Myanmar()` and applying its `.variable` in a `/my` layout gives exactly the desired behavior: self-hosted and preloaded on Burmese routes, absent everywhere else. Self-hosting is unconditional — *"CSS and font files are downloaded at build time and self-hosted with the rest of your static assets. No requests are sent to Google by the browser."*

The docs also explicitly bless applying a font variable to a nested container rather than the root:

```tsx
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

and note: *"You can add these variables to the `<html>` or `<body>` tag, depending on your preference, styling needs or project requirements."*

### Consequence for the current setup

`src/app/layout.tsx:94` spreads the `fonts` array from `src/lib/fonts.ts` onto `<body>`. **Do not add the Burmese variable to that array** — the root layout is precisely the case that preloads on all routes, which would ship 150 KB of Myanmar to every English visitor.

Shape it as: keep `fonts` as-is, export `burmeseFont` separately (§1), and apply it in the `/my` layout. Note that `src/lib/fonts.ts` evaluates all its font calls at module load, but that only makes the font *available*; the preload `<link>` still follows the layout that consumes the variable.

Tailwind v4 side: theme tokens live in `@theme` in `src/styles/globals.css`, not a config file. Register the family there and let a scoped class select it — do not hardcode `font-family` in a component.

UNVERIFIED: I did not run a build with a `/my` route to confirm the emitted preload tags, because no such route exists yet. The behavior above is the documented contract; confirm against the built HTML when the route lands.

---

## 6. Burmese numerals in dates

### What CLDR and the runtime actually do

CLDR sets Burmese digits as the default. [`common/main/my.xml:4700`](https://raw.githubusercontent.com/unicode-org/cldr/main/common/main/my.xml):

```xml
<defaultNumberingSystem>mymr</defaultNumberingSystem>
<otherNumberingSystems>
    <native>mymr</native>
</otherNumberingSystems>
```

and `common/supplemental/numberingSystems.xml` defines `mymr` as `digits="၀၁၂၃၄၅၆၇၈၉"`.

Node 24.15.0 / ICU 78.2 agrees:

```
my                   : ၂၀၂၆ ဇူလိုင် ၃၀
my (no options)      : ၃၀/၇/၂၀၂၆
my-u-nu-latn         : 2026 ဇူလိုင် 30
my-u-nu-mymr         : ၂၀၂၆ ဇူလိုင် ၃၀
resolvedOptions().numberingSystem for "my"  →  "mymr"
Intl.NumberFormat("my").format(1234567.89)  →  ၁,၂၃၄,၅၆၇.၈၉
Intl.RelativeTimeFormat("my").format(-3,"day") →  ပြီးခဲ့သည့် ၃ ရက်
```

So `toLocaleDateString("my")` gives Burmese digits with no extra work. Grouping separator and decimal point stay ASCII `,` and `.`.

### What real Burmese-language sites do

Surveyed 2026-07-30 by fetching the live pages and reading the rendered date markup.

| Site | Visible date | Machine-readable | Body numbers |
| --- | --- | --- | --- |
| **BBC Burmese** | `၂၉ ဇူလိုင် ၂၀၂၆` — Burmese | `<time dateTime="2026-07-29">` — ISO/Latin | Burmese (`၆၀၀ ကျော်`) |
| **VOA Burmese** | `၁၅ မတ္၊ ၂၀၂၅` — Burmese | `<time datetime="2025-03-15T11:33:27+06:30">` | Burmese |
| **Burmese Wikipedia** | `ဤစာမျက်နှာကို ၂၆ ဧပြီ ၂၀၂၆၊ ၁၆:၃၈ …` — Burmese | — | Burmese (`၁၉၉၇ ခုနှစ်`) |
| **RFA Burmese** | `2026.07.29` — **Latin** | `<time dateTime="2026-07-29T16:53:46.001Z">` | Burmese (`ဇူလိုင်လ ၂၈ ရက်နေ့`) |

The pattern is consistent and worth copying exactly:

> **Burmese digits in the human-visible date; Latin ISO-8601 in the `datetime` attribute.**

BBC and VOA implement this literally, with both forms on the same `<time>` element. RFA is the only outlier on the byline — and even RFA writes Burmese digits in its prose, so its Latin byline reads as a CMS artifact rather than an editorial choice. Burmese Wikipedia uses Burmese digits throughout including the timestamp.

The dual encoding matters beyond aesthetics: search engines and `schema.org` consumers parse the attribute, so the visible text is free to be fully localized.

### Guidance

I found **no W3C document that prescribes a numeral system for Burmese.** The W3C's relevant work is [Predefined Counter Styles](https://www.w3.org/TR/2015/WD-predefined-counter-styles-20150203/) (~120 counter styles across 30+ scripts, a catalogue rather than a recommendation) and the [Southeast Asian Language Enablement](https://www.w3.org/International/) group; neither issues a per-language digit ruling. The normative statement of intent is CLDR's `defaultNumberingSystem` — and for `my` that is unambiguously `mymr`. Mark as UNVERIFIED any claim that W3C mandates one or the other.

**Recommendation: use Burmese digits on `/my/*`, which means doing nothing special.** It matches CLDR, matches three of four major Burmese-language publishers, and is what `Intl` gives by default. Pair it with ISO in the attribute.

```tsx
// Burmese digits come from CLDR's mymr default for `my` — no -u-nu- needed.
const formatted = new Intl.DateTimeFormat("my", {
  year: "numeric", month: "long", day: "numeric",
}).format(date);

<time dateTime={date.toISOString()}>{formatted}</time>;
```

Forcing either system, if a specific surface needs it, uses the BCP 47 `-u-nu-` extension:

```ts
new Intl.DateTimeFormat("my-u-nu-latn", opts).format(date); // 2026 ဇူလိုင် 30
new Intl.DateTimeFormat("my-u-nu-mymr", opts).format(date); // ၂၀၂၆ ဇူလိုင် ၃၀
```

Two places to deliberately override to `latn`:

- **Anything satori rasterizes.** Burmese digits do survive satori (§3), so this is optional — but if a Burmese OG title is already falling back to Latin text, matching the digits keeps it coherent.
- **Version strings, code, and URLs.** Never localize those.

---

## Open questions

- Whether `pnpm build` emits the expected scoped `<link rel="preload">` for a `/my` layout — untestable until the route exists (§5).
- Whether the `latin-ext` subset is worth suppressing on Burmese pages. It is downloaded regardless and gated by `unicode-range`, so probably a non-issue; size unmeasured.
- If option 2 in §3 is taken, whether build-time OG generation should cover all routes or only `/my/*`. Doing all of them also fixes §4.2 permanently.

## Sources

- Installed types: `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts:11228`, `.../font-data.json`, `.../find-font-files-in-css.js`, `node_modules/next/dist/compiled/@vercel/og/types.d.ts:95-101`, `.../language/index.d.ts`, `.../index.node.js`, `node_modules/next/dist/server/og/image-response.js`, `node_modules/next/dist/server/og/image-response.d.ts:10`
- [Next.js `ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) · [Next.js Font Module](https://nextjs.org/docs/app/api-reference/components/font) · [Vercel OG image generation](https://vercel.com/docs/og-image-generation)
- [satori README](https://github.com/vercel/satori#language-and-typography) · [satori#83 Switch to Harfbuzz](https://github.com/vercel/satori/issues/83) · [satori#516 Devanagari](https://github.com/vercel/satori/issues/516) · [satori#590 global fonts](https://github.com/vercel/satori/issues/590)
- [Unicode Myanmar FAQ](https://www.unicode.org/faq/myanmar.html) · [UTN #11 Representing Myanmar in Unicode](https://www.unicode.org/notes/tn11/UTN11_4.pdf) · [google/myanmar-tools](https://github.com/google/myanmar-tools)
- [CLDR `common/main/my.xml`](https://raw.githubusercontent.com/unicode-org/cldr/main/common/main/my.xml) · [CLDR `numberingSystems.xml`](https://raw.githubusercontent.com/unicode-org/cldr/main/common/supplemental/numberingSystems.xml) · [UTS #35 Part 3: Numbers](https://www.unicode.org/reports/tr35/tr35-numbers.html)
- [Google Fonts metadata: Noto Sans Myanmar](https://fonts.google.com/metadata/fonts/Noto%20Sans%20Myanmar) · [W3C Predefined Counter Styles](https://www.w3.org/TR/2015/WD-predefined-counter-styles-20150203/)
- Live pages sampled 2026-07-30: [BBC Burmese](https://www.bbc.com/burmese) · [VOA Burmese](https://burmese.voanews.com/) · [RFA Burmese](https://www.rfa.org/burmese/) · [my.wikipedia.org](https://my.wikipedia.org/)
