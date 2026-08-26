# Research: Border radius — rounded vs sharp

Every source below was fetched on **2026-08-14** and quoted from the page itself; where a page could not be fetched, it says so and the claim is dropped rather than softened. This is a record of what was checked and when — **if the shipped code disagrees, the code wins.**

**The question asked:** the site currently uses **sharp (0-radius) corners for images and for elements meant to grab attention instantly**, and rounded corners everywhere else. Is there real evidence behind "sharp catches the eye"? What do the design systems that own this decision actually say? And what is the concrete rule to apply going forward in this codebase?

## TL;DR

| Question | Verdict |
| --- | --- |
| Do curved and angular shapes differ in **preference**? | **Yes, evidence.** Curved is liked more: 62.9% vs 47.2% of trials, *t*(15) = −4.82, *p* < .0005 ([§1.1](#11-bar--neta--the-origin-of-the-whole-literature)) |
| Do sharp corners **capture attention faster**? | **Folklore.** No primary source in the visual-search literature says this. Wolfe's current model never mentions curvature at all ([§1.5](#15-the-attention-claim-the-search-literature-does-not-support-it)) |
| Do sharp corners read as **threatening**? | **Partly.** Amygdala responds more to sharp (*t*(14) = 2.19, *p* < .03) — but the behavioural avoidance response **failed to replicate** ([§1.1](#11-bar--neta--the-origin-of-the-whole-literature), [§1.3](#13-palumbo-ruta--bertamini--the-replication-that-broke-the-threat-story)) |
| Does curvature preference reach **real design**? | **Once, weakly.** Vartanian's architecture study: beauty yes (*Z* = −2.13, *p* < .05), approach-avoidance **no** (*p* = .21) ([§1.4](#14-vartanian-et-al-2013--the-only-study-on-real-built-environments)) |
| Does **processing fluency** explain it? | **No source.** Reber/Schwarz/Winkielman never discuss contour curvature ([§1.6](#16-processing-fluency-a-verified-absence)) |
| Does any design system recommend **sharp** corners? | **Yes, three, for three different reasons** — and they do not all agree with each other ([§2](#2-what-the-design-systems-actually-say)) |
| Does any design system tie radius to **emphasis**? | **One: Material 3.** "using sharp shapes, thereby adding tension … drawing attention to an element" ([§2.1](#21-material-3--the-only-system-that-endorses-sharp-for-emphasis)) |
| Is the **nested radius** rule real? | **Yes, and it is in the CSS spec itself**, not just blogs ([§3.1](#31-the-formula-is-normative-css-not-folklore)) |
| Is `corner-shape: superellipse()` usable? | **No.** Chromium-only since 2025-08-05. Firefox: no. Safari: no ([§3.3](#33-corner-shape-and-superellipse--real-spec-one-engine)) |
| Should this repo add **semantic radius tokens**? | **Yes — but fix the broken primitive scale first** ([§4](#4-radius-as-tokens-primitive-vs-semantic)) |
| Is there a real **accessibility** cost to radius? | **Yes, one, and it is in the CSS spec:** radius clips pointer events ([§5](#5-accessibility-and-practical-caveats)) |
| Is the "sharp = attention" instinct defensible? | **Half of it.** Sharp-for-media is good convention; sharp-for-attention is folklore with a defensible replacement ([§6](#6-what-this-implies-for-this-site)) |
| **Is there a live bug in the radius scale?** | **Yes.** `rounded-md` — the most-used radius in the repo, 26 uses — is not part of this project's scale at all ([§0.2](#02-the-bug-rounded-md-is-not-yours)) |

### Fetching notes

Four of the primary sources cannot be fetched normally. Every quote below came from the vendor's **own** same-origin API or the author's own copy, so the text is exactly what the page renders.

- **Material 3** (`m3.material.io`, Angular SPA — returns only a `<title>`): content API is `https://m3.material.io/_dsm/content/m3/<version>/<exportedCarbonFileId>.json`. Live version on this date is **`2026-08-12_10-00-15`** (the `2026-08-05_09-00-19` recorded in `research-prompt-builder-ux.md` is now stale — re-derive from `main.*.js` each time). The shape doc is one file, `5e04e8f6-7da6-475e-a1b0-3818021c0cea.json`, rendered as three tabs. Human-readable URLs cited throughout.
- **Apple HIG** (Vue SPA): `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`. 171 pages crawled. The `/tutorials/data/documentation/swiftui/<symbol>.json` path also works (contrary to the note in the earlier research file — `containerrelativeshape.json` and `concentricrectangle.json` both return 200).
- **Apple WWDC transcripts**: server-rendered in the page HTML at `developer.apple.com/videos/play/wwdc2025/<id>/`. Plain `curl` works. **The strongest concentricity statement Apple has published is in a session transcript, not the HIG.**
- **PubMed abstracts**: NCBI E-utilities (`efetch.fcgi?db=pubmed&id=<pmid>&rettype=abstract`), which returns the abstract as plain text and cannot paraphrase.

**Could not fetch, and therefore not cited anywhere below:**

- **Silvia & Barona 2009** (*Empirical Studies of the Arts* 27(1) 25–42, doi `10.2190/EM.27.1.b`) — Unpaywall reports `is_oa: false`; SAGE returns 403; the UNCG institutional copy at `libres.uncg.edu` 301-redirects to a repository landing page that returns an empty body. **Not one word of it is quoted here.** [§1.2](#12-individual-differences-the-preference-is-not-universal) uses Cotter et al. 2017 instead, which is CC-BY and has Silvia as second author on the same question.
- **Wolfe & Horowitz 2004** (*Nature Reviews Neuroscience*, doi `10.1038/nrn1411`) — the paper with the famous "undoubted / probable / possible / doubtful" table of guiding attributes. Paywalled (Semantic Scholar: `openAccessPdf: CLOSED`), nature.com bounces to an IdP, and the Harvard lab mirror `search.bwh.harvard.edu` timed out on every attempt. **PubMed carries no abstract for it.** The attention claim in [§1.5](#15-the-attention-claim-the-search-literature-does-not-support-it) rests on Wolfe's 2021 *Guided Search 6.0* instead, which is open access — and which is arguably the better citation anyway, being current.
- **`caniuse.com/corner-shape`** — 302 with a zero-byte body. Browser support in [§3.3](#33-corner-shape-and-superellipse--real-spec-one-engine) comes from webstatus.dev and MDN's browser-compat-data raw JSON instead.
- **Shopify Polaris** — `polaris.shopify.com/tokens/border` and `polaris-react.shopify.com/design/border` both **301 to `shopify.dev/docs/api/polaris`**, which carries no radius content. Polaris is not cited anywhere below.
- **Adobe Spectrum** — `spectrum.adobe.com/page/design-tokens/` returns a `<title>` and no body to a plain fetch, and no first-party content API was found for it. **Not cited.** Spectrum 2's rounder shapes are widely discussed second-hand; none of that is quotable here.

---

## 0. What this codebase does today

Read this first: three of the recommendations later only make sense against it.

### 0.1 The declared scale

`src/styles/globals.css:91-98`, inside `@theme`:

```css
--radius-2xs: 0.125rem; /* 2px */
--radius-xs:  0.25rem;  /* 4px */
--radius-sm:  0.375rem; /* 6px */
--radius-base:0.5rem;   /* 8px */
--radius-lg:  0.75rem;  /* 12px */
--radius-xl:  1rem;     /* 16px */
--radius-2xl: 1.25rem;  /* 20px */
--radius-full:9999px;
```

Eight entries. Confirmed present and unchanged.

### 0.2 The bug: `rounded-md` is not yours

> **Resolved 2026-08-14.** `@theme` now opens with `--radius-*: initial`, `--radius-base` was renamed `--radius-md` (8px), and the 25 repo `rounded-md` call sites were codemodded to `rounded-sm` so no pixel moved. The compiled CSS now emits exactly eight radius utilities plus `rounded-none`. **`rounded-md` survives in the build only because `fumadocs-ui` uses it 12 times** (its `dist` is scanned via `@source` in `css/preset.css`), and those sites shifted 6px → 8px. The section below is kept as the record of what was wrong and why it was invisible.

Tailwind v4 ships its own `--radius-*` namespace. From the **installed** package, `node_modules/tailwindcss/theme.css:349-356`:

```css
--radius-xs: 0.125rem;  --radius-sm:  0.25rem;  --radius-md: 0.375rem;  --radius-lg: 0.5rem;
--radius-xl: 0.75rem;   --radius-2xl: 1rem;     --radius-3xl: 1.5rem;   --radius-4xl: 2rem;
```

and a separate `/* Deprecated */` block at `theme.css:460` still defines `--radius: 0.25rem`, which is what the bare `rounded` class resolves to.

Defining *some* variables in a namespace **merges** with Tailwind's defaults; it does not replace them. [Tailwind v4, "Theme variables"](https://tailwindcss.com/docs/theme):

> "To completely override an entire namespace in the default theme, set the entire namespace to `initial` using the special asterisk syntax"

`globals.css` never does that. So the two scales coexist. Compiled with the installed `tailwindcss@4.1.13` against this repo's exact `@theme` block, the resolved `:root` is:

| Class | Value | Comes from |
| --- | --- | --- |
| `rounded-none` | `0` | static utility |
| `rounded-2xs` | 2px | **repo** |
| `rounded-xs` | 4px | **repo** (overrides Tailwind's 2px) |
| `rounded-sm` | 6px | **repo** (overrides Tailwind's 4px) |
| **`rounded-md`** | **6px** | **Tailwind default — unclaimed, and a duplicate of `rounded-sm`** |
| `rounded-base` | 8px | **repo** — *zero usages* |
| `rounded-lg` | 12px | **repo** (overrides 8px) |
| `rounded-xl` | 16px | **repo** (overrides 12px) |
| `rounded-2xl` | 20px | **repo** (overrides 16px) |
| `rounded-3xl` | 24px | Tailwind default — unclaimed, unused |
| `rounded-4xl` | 32px | **Tailwind default — unclaimed, used once** |
| `rounded-full` | 9999px | **repo** |
| `rounded` (bare) | 4px | Tailwind's *deprecated* `--radius` |

Three consequences, all live:

1. **`rounded-md` and `rounded-sm` render identically at 6px.** The repo shifted every step up by one notch — `xs` 2→4, `sm` 4→6, `lg` 8→12, `xl` 12→16, `2xl` 16→20 — but left `md` alone, so `md` collided with the new `sm`.
2. **`--radius-base` is dead.** It is clearly the intended default step (8px, the value Tailwind calls `lg`), and **nothing in `src/` or `content/` uses `rounded-base`.** Meanwhile `rounded-md` is the single most-used radius in the project at 26 occurrences. The default the scale declares and the default the code uses are different numbers, and the code's default is the one nobody chose.
3. **`rounded-4xl` (32px) and `rounded-3xl` (24px) still exist** and sit outside the declared scale entirely. `about.tsx:101` uses `rounded-4xl` — 32px, 60% larger than the largest declared token.

This is not a rendering failure and nothing looks broken. It is a **provenance** failure: the most common radius in the codebase is not one this project chose.

### 0.3 Census

Counted across `src/**` and `content/**` (`.tsx`, `.ts`, `.css`, `.mdx`), excluding prose occurrences of the English word "rounded" inside `spec.ts` and `options.ts`:

| Class | Resolves to | Count |
| --- | --- | --- |
| `rounded-md` | 6px | 26 |
| `rounded-full` | 9999px | 25 |
| `rounded-lg` | 12px | 16 |
| `rounded-none` | 0 | 10 (+2 `!rounded-none`) |
| `rounded-sm` | 6px | 9 |
| `rounded-xl` | 16px | 6 |
| `rounded-2xl` | 20px | 3 |
| `rounded` (bare) | 4px | 3 |
| `rounded-[inherit]` | inherited | 2 |
| `rounded-xs` | 4px | 1 |
| `rounded-br-xl` | 16px, one corner | 1 |
| `rounded-4xl` | 32px | 1 |
| `rounded-[11px]` | 11px | 1 |

**Nine distinct radius values in use** (0, 4, 6, 11, 12, 16, 20, 32, 9999) across a scale that declares eight — and two of the nine (11px, 32px) are not in the scale.

### 0.4 The outliers, located

- **`rounded-none` × 10.** `testimonial.tsx:262,264,265` and `:478,480,481` (avatar image + fallback in two places — square portraits, deliberate); `prompt-area.tsx:111` (chat textarea, sits inside a rounded shell); `mdx-components.tsx:44` (the MDX `Accordion` wrapper); `blog-post-view.tsx:184` (the post's tag chips — sharp, and they are the "attention" case the owner means); `globals.css:379` (`.prose :not(pre) > code` — inline code in blog posts). Plus `!rounded-none` in both `content/blog/{en,my}/banner-prompt-spec.mdx:17`, on the article's hero `CloudinaryImage`.
- **`rounded-[11px]`** — `src/components/header.tsx:175`. A gradient scrim at `absolute inset-0` inside a `NavLink` that is `overflow-hidden rounded-lg` (**12px**). Padding is zero, so the concentric answer is 12px, not 11px ([§3.1](#31-the-formula-is-normative-css-not-folklore)). **And the radius is redundant anyway** — the parent already clips it. Two bugs in one magic number.
- **`rounded-[inherit]` × 2** — `header.tsx:207` (animated gradient border on the `/chat` pill) and `animations/light-rays-animation.tsx:106`. Both are zero-inset overlays, and `inherit` is exactly right for that case. **The correct idiom and the wrong idiom sit 32 lines apart in the same file.**
- **`rounded-4xl`** — `src/features/about/components/about.tsx:101`, the "HangOut" photo container. 32px, from Tailwind's defaults, not the repo's scale.
- **`rounded` (bare) × 3** — `home/components/lazy-contact.tsx:58` and `:62` (skeleton placeholder bars) and `components/image-viewer.tsx:170` (a zoom-percentage chip). Resolves through Tailwind's **deprecated** `--radius`.
- **`rounded-br-xl`** — `chat/components/prompt-area.tsx:143`, on the send button: `rounded-lg rounded-br-xl`, i.e. 12px on three corners and 16px on the bottom-right, nesting into the composer's own corner. Deliberate asymmetry, and the only place in the repo that does it.

  > **Resolved 2026-08-16.** The asymmetry was flared, not concentric: the button sits at a 12px inset inside a `rounded-xl` (16px) shell, so the shell-facing corner is 16 − 12 = **4px**. Now `rounded-br-xs`, with a mirrored `rounded-bl-xs` on the agent switcher (`agent-switcher.tsx:36`), which faces the opposite shell corner at the same inset and previously had no corner treatment at all. Same pass: the limit banner moved `m-1.5` → `m-1` so 16 − 4 lands on `rounded-lg`; the textarea moved `rounded-none` → `rounded-[inherit]` ([§3.5](#35-css-has-no-native-concentricity-and-probably-wont-soon), zero-inset child); the chat code block and YouTube embed moved 6px → `rounded-md` (8px) per [§6.2](#62-the-decision-table); and chat inline code moved to `rounded-none`, matching blog inline code at `globals.css:384`.
- **`rounded-xs`** — `banner-prompt/step-flow.tsx:412`, a 20px colour swatch.

### 0.5 Images are sharp by default, and that is structural

`src/components/cloudinary-image.tsx` is a five-line pass-through to `CldImage`. `src/components/ui/theme-image.tsx` adds theme swapping and forwards `className`. **Neither sets a radius.** Radius on an image is always the caller's decision, and today most callers decline:

| Call site | Radius |
| --- | --- |
| `blog-post-view.tsx:87` (post banner) | none — `object-cover object-bottom` in a full-width `<figure>` |
| `page-hero-image.tsx:54` | none |
| `home/components/selected-project.tsx:34` | none on the container |
| `about.tsx:60` (profile square) | `rounded-md` |
| `about.tsx:101` (hangout photo) | `rounded-4xl` |
| `blog-post-showcase.tsx:91` | `rounded-xl` / `sm:rounded-lg` / `md:rounded-xl` |
| `image-stack.tsx:58` | `rounded-xl` |
| `header.tsx:171` | `rounded-lg` |
| MDX `<CloudinaryImage>` in `banner-prompt-spec.mdx:17` | `!rounded-none` |

So "sharp for images" is **half true**: the full-bleed and in-article images are sharp; the card thumbnails are rounded. That split is defensible and [§6](#6-what-this-implies-for-this-site) keeps it.

### 0.6 `src/components/ui/*` is nearly consistent already

| Component | Radius |
| --- | --- |
| `button.tsx` | `rounded-md` (sm, md) · `rounded-lg` (lg) |
| `input.tsx`, `textarea.tsx` | `rounded-md` |
| `popover.tsx`, `dropdown-menu.tsx` | `rounded-md` |
| `radio-group.tsx` (card, chip) | `rounded-md` |
| `tabs.tsx` | list `rounded-md`, trigger `rounded-sm` |
| `tooltip.tsx`, `toast.tsx` | `rounded-sm` |
| `badge.tsx` | `radius: { default: "rounded-sm", full: "rounded-full" }` |
| `avatar.tsx` | `rounded-full` |
| `step-indicator.tsx` | `rounded-full` |

Two things worth naming. First, **`tabs.tsx` is the one place the repo already does concentric nesting** — a `rounded-md` (6px) list wrapping `rounded-sm` (6px) triggers with `p-[3px]`. The correct inner value is 6 − 3 = **3px**; both are 6px, so the trigger's corner pokes into the list's. Second, **`badge.tsx` already ships a role-named radius API** (`radius="default" | "full"`) rather than a raw class. That is the semantic-token pattern of [§4](#4-radius-as-tokens-primitive-vs-semantic), invented locally, in one component. It should be the house style, not an accident.

### 0.7 In-flight: `banner-prompt/*`

Radius decisions here are live and uncommitted (`git status` shows `step-flow.tsx`, `option-field.tsx`, `preview.tsx` modified/added):

- `step-flow.tsx:221` `rounded-sm` (breadcrumb chip) · `:412` `rounded-xs` (colour swatch) · `:626` `rounded-sm` (the compiled-prompt `<pre>`)
- `preview.tsx:45` `rounded-sm` (the preview frame) · `:105` `rounded-sm` (dashed placeholder) · `:162` `rounded-full`
- `option-field.tsx:43` `rounded-full` (check indicator)
- the option cards themselves come from `radio-group.tsx` → `rounded-md` (6px)

**Inside a `rounded-md` card with `p-3` (12px), any nested element must be sharp** — 6 − 12 is negative, and the CSS spec clamps it to zero ([§3.1](#31-the-formula-is-normative-css-not-folklore)). Worth knowing before more radii get added in there.

---

## 1. The perception evidence

Everything in this section is **lab work on abstract shapes or photographs**, judged by undergraduates, with no interface, no task, and no comparison to any other design variable. Not one study in this literature tested a user interface. That is the single most important caveat and it applies to every line below.

### 1.1 Bar & Neta — the origin of the whole literature

Two papers, and they are about **preference and threat**, not attention.

[**Bar & Neta 2006**, "Humans prefer curved visual objects", *Psychological Science* 17(8):645-8](https://pubmed.ncbi.nlm.nih.gov/16913943/) — abstract verbatim, via NCBI E-utilities:

> "People constantly make snap judgments about objects encountered in the environment. Such rapid judgments must be based on the physical properties of the targets, but the nature of these properties is yet unknown. We hypothesized that sharp transitions in contour might convey a sense of threat, and therefore trigger a negative bias. Our results were consistent with this hypothesis. The type of contour a visual object possesses--whether the contour is sharp angled or curved--has a critical influence on people's attitude toward that object."

Note what that says: a **negative bias** toward sharp. Not "sharp is noticed first" — "sharp is liked less". The abstract publishes no N and no effect size.

[**Bar & Neta 2007**, "Visual elements of subjective preference modulate amygdala activation", *Neuropsychologia* 45(10):2191-200](https://pubmed.ncbi.nlm.nih.gov/17462678/) — abstract verbatim:

> "We previously showed that a highly potent cue is the nature of the object's contour: people generally like objects with a curved contour compared with objects that have pointed features and a sharp-angled contour. This bias is hypothesized here to stem from an implicit perception of potential threat conveyed by sharp elements. Using human neuroimaging to test this hypothesis, we report that the amygdala … is significantly more active for everyday sharp objects (e.g., a sofa with sharp corners) compared with their curved contour counterparts."

Full text ([PMC4024389](https://pmc.ncbi.nlm.nih.gov/articles/PMC4024389/)) gives the numbers:

| | |
| --- | --- |
| **N** | Exp. 1: 16 (8 female). Exp. 2: 32. Exp. 3: 2 × 11. Pilot: 26. |
| **Stimuli** | "We collected 140 pairs of real objects and 140 pairs of novel meaningless patterns for which the critical difference between the items in each pair was the curvature of their contour." Real objects were "tools, furniture, clothes, and plants"; the curved/sharp variants were made in Photoshop. |
| **Preference** | sharp = 47.2% ± 3.5, curved = 62.9% ± 2.6, control = 57.4 ± 2.7 of trials liked. Sharp vs curved real objects *t*(15) = −4.82, *p* < .0005 |
| **Amygdala** | right, sharp > curved: *t*(14) = 2.19, *p* < .03 (real objects); *t*(14) = 2.09, *p* < .03 (patterns) |

**The paper makes no claim about attention capture, visual search, or detection speed.** That is a verified absence in the source that every "sharp grabs attention" post cites.

And the authors flag their own soft spot:

> "That the sharp-angled objects were not rated as more threatening than the control objects is somewhat puzzling, and will require further experiments to be fully explained."

**Scope, plainly:** 16 people, photographs of sofas and tools, a like/dislike button, and a 15-percentage-point gap. Every corner in a UI is a rounded rectangle at 0–20px. None of these stimuli were that.

### 1.2 Individual differences: the preference is not universal

[**Cotter, Silvia, Bertamini, Palumbo & Vartanian 2017**, "Curve Appeal", *i-Perception* 8(2), CC-BY](https://pubmed.ncbi.nlm.nih.gov/28491269/) — abstract verbatim:

> "A preference for smooth curvature, as opposed to angularity, is a well-established finding for lines, two-dimensional shapes, and complex objects, but little is known about individual differences. … As expected, people preferred curved over angular stimuli, and people's degree of curvature preference correlated across the two sets of shapes. Multilevel models showed varying patterns of interaction between shape and individual differences. For the irregular polygons, people higher in artistic expertise or openness to experience showed a greater preference for curvature. This pattern was not evident for the arrays of circles and hexagons. … we conclude that individual differences do play a role in moderating the preference for smooth curvature."

From [the full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC5405906/): **119 undergraduates** after exclusions (132 recruited, 13 dropped), two stimulus sets — randomly generated irregular polygons with 10/18/26 vertices, and arrays of circles vs hexagons.

The effects are small and one of them is not significant:

> "participants reported liking the curved polygons more than the angular ones (*b* = .27, *SE* = .10, *p* = .005)"

> "people again showed a preference for curvature … higher for the arrays of curved circles than the angular hexagons (*b* = .19, *SE* = .10, *p* = .070)"

And the moderation story does not transfer between stimulus sets:

> "For one stimulus set—the irregular polygons…the evidence for moderation was plentiful and consistent…But for the other stimulus set—the arrays of circles and hexagons…only a handful of effects appeared, and none were the same."

> "It thus appears that there were consistent between-person differences in curvature preference: People who preferred curved objects in one stimulus set were likely to prefer the curved objects in the other stimulus set."

**Read that honestly.** The curvature preference is a real group-average effect that (a) shrinks to *p* = .07 when the stimulus changes from a polygon to a grid of circles, and (b) varies enough between people that "between-person differences" is the paper's headline. It is not a law you can design against.

> ⚠️ **Silvia & Barona 2009 is the paper usually cited for prototypicality as a moderator, and it is paywalled.** Unpaywall says `is_oa: false`; SAGE 403s; the UNCG repository copy redirects to an empty landing page. **Nothing from it is quoted here.** Cotter et al. above is by the same second author on the same question and is CC-BY, so use that. If you ever need the prototypicality claim specifically, it is currently **uncited in this file**.

### 1.3 Palumbo, Ruta & Bertamini — the replication that broke the threat story

This is the most important paper in the section for the owner's question, because it tests the threat mechanism directly and **the sharp half does not hold**.

[**Palumbo, Ruta & Bertamini 2015**, "Comparing Angular and Curved Shapes in Terms of Implicit Associations and Approach/Avoidance Responses", *PLOS ONE*, doi `10.1371/journal.pone.0140043`](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0140043) — abstract verbatim:

> "In Experiment 1 we used a multidimensional Implicit Association Test (IAT) … Results showed that curved polygons were associated with safe and positive concepts and with female names, whereas angular polygons were associated with danger and negative concepts and with male names. Experiment 2 used a different implicit measure, which avoided any need to categorise the stimuli. … **We found that RTs for approaching vs. avoiding angular polygons did not differ, even in the condition where the angles were more pronounced.** By contrast participants were faster and more accurate when moving the manikin towards curved shapes. **Experiment 2 suggests that preference for curvature cannot derive entirely from an association of angles with threat.**"

N = 24 (Exp. 1) and 36 (Exp. 2). Stimuli: irregular polygons from 22 vertices sampled around a circle, smoothed with a cubic spline for the curved version.

| Measure | Result |
| --- | --- |
| IAT, danger dimension | *t*(23) = 5.59, *p* = .000, *d* = 2.33 |
| IAT, valence | *t*(23) = 5.41, *p* = .000, *d* = 2.26 |
| SRC, **curved** compatible vs incompatible | *t*(34) = −3.05, *p* = .004, *d* = −1.05 — **approach** |
| SRC, **angular** compatible vs incompatible | *t*(34) = .302, *p* = .765, *d* = .10 — **nothing** |

> "Participants did not move the manikin away from the angular polygons faster (M = .83; SD = .19) than towards them (M = .82; SD = .25)."

The authors' own caveat on the IAT:

> "Unfortunately given the structure of the IAT it cannot be established whether the associations are driven more (or exclusively) by the curved shapes or by the angular shapes."

**So:** when you ask people to *categorise*, angular associates with danger. When you measure what they actually *do*, angular produces no avoidance at all — only curved produces approach. The effect is a **pull toward curved**, not a **push away from sharp**. That distinction is fatal to "sharp corners create urgency/alarm/attention", which needs the push half.

### 1.4 Vartanian et al. 2013 — the only study on real built environments

[**Vartanian et al. 2013**, "Impact of contour on aesthetic judgments and approach-avoidance decisions in architecture", *PNAS* 110(supp 2), full text at PMC3690611](https://pmc.ncbi.nlm.nih.gov/articles/PMC3690611/). (The pnas.org DOI page 403s; PMC serves the same article.) Abstract verbatim:

> "As predicted, participants were more likely to judge spaces as beautiful if they were curvilinear than rectilinear. … Complementing this finding, pleasantness—the valence dimension of the affect circumplex—accounted for nearly 60% of the variance in beauty ratings. … **In contrast, contour did not affect approach-avoidance decisions**, although curvilinear spaces activated the visual cortex."

| | |
| --- | --- |
| **N** | "We recruited 18 (12 females, 6 males) neurologically healthy participants (M = 23.39 y, SD = 4.49)" |
| **Stimuli** | "200 photographs of architectural spaces", half curvilinear / half rectilinear, balanced for ceiling height and openness |
| **Beauty** | *Z* = −2.13, *P* < 0.05 |
| **Approach-avoidance** | *Z* = −1.27, **P = 0.21** |
| **Pleasantness → beauty** | "Pleasantness ratings accounted for 58% of the observed variance in beauty ratings." |

The authors' own limitations, verbatim:

> "There could be a number of reasons for this result. First, the risk associated with judging a space as beautiful is less than the risk associated with the decision to enter that space, however hypothetical."

> "It is therefore possible that our design might have lacked the degree of fidelity necessary to simulate approach-avoidance decisions that determine behavioral choices in real-life settings."

> "Methodologically, we opted to use a binary response format for both beauty judgments and approach-avoidance decisions … our design could not incorporate tasks that, when used in isolation, would appear more ecologically valid for investigating approach-avoidance behavior, such as a visual navigation task."

**18 people, and the behavioural measure came back null.** This is the study most often waved at "curves in design" arguments and it is one of the smallest.

### 1.5 The attention claim: the search literature does not support it

This is the sub-question that actually bears on "catches attention instantly", and the honest answer is that **no primary source says it.**

The current authoritative model is [**Wolfe 2021, "Guided Search 6.0", *Psychonomic Bulletin & Review* 28(4):1060-1092**](https://pmc.ncbi.nlm.nih.gov/articles/PMC8965574/), open access. Its definition:

> "A preattentive feature is a property capable of guiding the deployment of attention."

Its five guidance sources, from the abstract:

> "In GS6, this guidance comes from five sources of preattentive information: (1) top-down and (2) bottom-up feature guidance, (3) prior history (e.g., priming), (4) reward, and (5) scene syntax and semantics."

On features:

> "A large body of work describes the evidence that different stimulus features can guide search (e.g. color, motion, etc.). Other work documents that there are plausible features that do not guide search: e.g. intersection type…or surface material."

**The word "curvature" does not appear in the paper.** Wolfe does not classify it as a guiding attribute, does not classify it as a non-guiding attribute, and does not raise it. The paper is also blunt that object shape is a poor guide:

> "Search for a distinctive real-world object in a varied set of other objects seems to be essentially unguided."

[Treisman & Gormican 1988, "Feature analysis in early vision: evidence from search asymmetries", *Psychological Review* 95(1):15-48](https://pubmed.ncbi.nlm.nih.gov/3353475/) is the classic study that did test curvature — **but PubMed carries no abstract for it**, the Iowa PDF mirror 404s, and it is paywalled. It is listed here so nobody thinks it was overlooked; **nothing is quoted from it.**

> ⚠️ **This is the finding, and it is a negative one.** "Sharp corners pop out / catch the eye instantly" has **no primary source behind it in either direction** at UI scale. The nearest real evidence runs the *other* way: sharp is disliked (§1.1) and produces no behavioural avoidance (§1.3). Anyone asserting that angular UI elements are detected faster is asserting something the visual-search literature has not published. **Label it folklore.** The defensible replacement is in [§6](#6-what-this-implies-for-this-site).

### 1.6 Processing fluency: a verified absence

[Reber, Schwarz & Winkielman 2004, "Processing Fluency and Aesthetic Pleasure: Is Beauty in the Perceiver's Processing Experience?", *Personality and Social Psychology Review* 8:364-382](https://pages.ucsd.edu/~pwinkiel/reber-schwarz-winkielman-beauty-PSPR-2004.pdf) — the authors' own hosted copy, read in full (19 pages, text extracted).

The paper's variables are, in its own list: "figural goodness, figure–ground contrast, stimulus repetition, symmetry, and prototypicality". **Corner curvature is not among them.** Every occurrence of "contour" in the paper is about *priming with degraded contours*, a different phenomenon entirely.

**So processing fluency is not a source for the radius question.** It is frequently invoked as the mechanism ("rounded is easier to process"); the founding paper of that literature does not make the claim.

### 1.7 Summary of the evidence layer

| Claim | Status |
| --- | --- |
| Curved shapes are preferred, on average | **Evidence** — replicated (Bar & Neta, Cotter, Vartanian, Palumbo) |
| The preference varies substantially between people | **Evidence** (Cotter) |
| Sharp shapes associate with danger when categorised | **Evidence** (Palumbo IAT, *d* = 2.33) |
| Sharp shapes produce behavioural avoidance | **Failed to replicate** (Palumbo SRC *p* = .765; Vartanian *P* = .21) |
| Curved contour makes real spaces judged more beautiful | **Evidence, N = 18** (Vartanian) |
| Sharp corners capture attention faster | **Folklore.** No primary source |
| Processing fluency explains contour preference | **No source.** The fluency literature does not address contour |
| Any of this measured on a web UI | **None.** Zero studies |

---

## 2. What the design systems actually say

Everything in this section is **convention** — vendor doctrine, no studies cited by any of them. It is still the most useful material available, because these are the organisations that own the decision.

### 2.1 Material 3 — the only system that endorses sharp for emphasis

Scale, from [m3.material.io/styles/shape/corner-radius-scale](https://m3.material.io/styles/shape/corner-radius-scale):

> "The Material 3 shape system uses a size-based scale with ten styles. Styles are assigned to components based on the desired amount of roundedness.
> - None - 0dp
> - Extra small - 4dp
> - Small - 8dp
> - Medium - 12dp
> - Large - 16dp
> - Large increased - 20dp
> - Extra large - 28dp
> - Extra large increased - 32dp
> - Extra extra large - 48dp
> - Full - fully rounded corners"

Tokens are `md.sys.shape.corner.{none,extra-small,…,full}` plus per-corner `md.sys.shape.corner-value.*` and directional variants (`corner.large.top`, `corner.large.start`, `corner.large.end`). The May 2025 M3 Expressive update added `large-increased` (20dp), `extra-large-increased` (32dp) and `extra-extra-large` (48dp), and:

> "Updated fully rounded corners to use full. Previously, this was defined using 50% of the component size."

**The money quote**, from [m3.material.io/styles/shape/overview-principles](https://m3.material.io/styles/shape/overview-principles) — verified verbatim against the content API:

> "**Be bold and dare to embrace tension** — Tension happens when the shape story changes unexpectedly, such as when contrasting shapes are used. This can be created using both square and rounded shapes, unconventional shapes, and other contrasting elements.
> Material historically focused on rounded shapes. However, using sharp shapes, thereby adding tension, creates more dynamic design, one that's more memorable and expressive.
> This tension can be used in many ways, like conveying states, **drawing attention to an element**, or to improve the visual aesthetic."

**This is the closest thing to a source for the owner's instinct that exists anywhere.** Read it precisely, though: the mechanism M3 names is **contrast against a rounded norm** ("the shape story changes unexpectedly", "contrasting shapes"), not sharpness as an intrinsic property. Sharp draws attention *in a system that is otherwise round.* That is a relative claim, and it has a direct consequence for this repo ([§6](#6-what-this-implies-for-this-site)).

M3 on emphasis and restraint:

> "Shapes should be used sparingly to provide a stronger emphasis and moments of delight."

> "Use abstract shapes sparingly — Be intentional when using shapes in product UI. Don't compromise clarity for the sake of visual design."

> "Shape is versatile, not semantic — Avoid making shapes literal or assigning a specific function or meaning to a single shape."

M3 against large radii on dense surfaces:

> "Add extra padding to avoid cutting off content in information-dense components. For example, a large cut corner on a card will clip content and images in the area more than a rounded corner of the same size."

> "Be careful not to apply large or full corners to information-dense components, such as cards" *(image caption, verbatim)*

> "Use the shape library for mostly visual elements. Avoid applying unconventional shapes to text-heavy containers."

And on remapping, which is the licence to have a house scale at all:

> "Generally, products should consistently use the Material 3 shape styles. However, customization is sometimes necessary, and even encouraged, for hero moments or custom components."

> "For example, by default, buttons are mapped to the full corner radius shape style. If your product needs a less rounded shape, remap the token to another style in the shape scale, such as small or medium."

Shape morphing is Android-only for now — [m3.material.io/styles/shape/shape-morph](https://m3.material.io/styles/shape/shape-morph): "For Android, use the Shapes in Compose API. **Web is not currently available.**"

### 2.2 Fluent 2 — the cleanest statement of "sharp at the edge"

[fluent2.microsoft.design/shapes](https://fluent2.microsoft.design/shapes/) is a static Astro site; plain `curl` returns the full prose. Opening claim:

> "Shapes help make UI personable, easier to process, and recognizable at a glance. Selecting the correct shape for components builds consistent visual vocabulary and narrative."

The ramp:

> "In most cases, corner radiuses on rectangle shapes are 4 pixels by default. For shapes smaller than 32 pixels, the corner angle is reduced to 2 pixels. For large and extra-large components, 8 pixel and 12 pixel angles are used."

| Token | Usage | Value |
| --- | --- | --- |
| None | Navigation bars, tab bars | 0 pixels |
| Small | Small badges | 2 pixels |
| Medium | Buttons, dropdown | 4 pixels |
| Large | Large buttons | 8 pixels |
| X-Large | Button sheets, popovers | 12 pixels |
| Circle | Personas | 50% |

*(table verbatim from the page)* — note that the "Usage" column **is** a semantic layer: the token names are t-shirt sizes but the documented mapping is by role.

The explicit sharp rule:

> "**When to avoid rounded corners** — There are instances by default when the corner of a component should not be rounded, like when it would result in awkward gaps.
> **Avoid unnecessary spaces** — Be sure to exclude space between multiple UI elements in a single container. For example, both parts of a split button.
> **Skip rounded corners at the screen's edge** — Rounded corners are not necessary for components that reach the edge of the screen."

And on forms:

> "The rectangle is the basic shape for most common components and containers, like buttons, textareas, menus, cards, and images."

> "Circles are used for avatars and other components displaying or representing people."

**Fluent ties radius to nothing hierarchical.** Its rationale is size-proportionality (small components get small radii) and situational (avoid gaps, avoid at edges). Emphasis is attributed to fill, not radius: "Fill styles can define and emphasize a shape."

### 2.3 IBM Carbon — sharp for eight years, rounding right now

Carbon is the interesting case because it is mid-reversal, in public.

**Shipped v11 has no radius token layer at all.** Verified three ways: `carbondesignsystem.com/sitemap-0.xml` lists eight `elements/` pages (`2x-grid`, `color`, `icons`, `motion`, `pictograms`, `spacing`, `themes`, `typography`) and no shape page; `/elements/shape/overview/` and `/guidelines/shape/` both 404; and `npm pack @carbon/layout@11.57.0` + `@carbon/styles@1.113.0` (both `latest` on 2026-08-14) contain **zero** `border-radius` occurrences.

The historical stance, from [carbon-design-system/carbon#285](https://github.com/carbon-design-system/carbon/issues/285) (2017), maintainer `@hellobrian`:

> "Okay, so we actually do set the `border-radius` to `0`. First it's set in a mixin that's used in all buttons and the mixin is used in the `.bx--btn` class selector so as long as the `bx--btn` class is on the HTML, the border-radius will always be set to `0` by default."

Backed by a run of cleanup PRs holding the line: #2001 and #2007 "remove border radius for input fields" (2019), #8198/#8259 "fix(date-picker): remove border radius" (2021).

**v12 is adding radius tokens.** [PR #22814, "chore(v12): setup border-radius tokens"](https://github.com/carbon-design-system/carbon/pull/22814) (opened 2026-07-29):

> "Adds new border-radius tokens — 'border-radius-00', 'border-radius-02', 'border-radius-04', 'border-radius-08', 'border-radius-16', 'border-radius-24', 'border-radius-max'"

> "the border-radius token names *could* be subject to change (e.g. `border-radius-input`), so this approach makes future name changes much easier."

Values on `main` ([packages/layout/src/index.ts](https://github.com/carbon-design-system/carbon/blob/main/packages/layout/src/index.ts)): `0px / 2 / 4 / 8 / 16 / 24 / 999999px`.

The intended semantic grouping, from the spike [PR #22511](https://github.com/carbon-design-system/carbon/pull/22511):

> "Tokenizes border radius for 3 main categories. and tests the centralized border radius system on some components. 1. box 2. button 3. input"

> ⚠️ **Carbon has published no rationale for the reversal.** `carbondesignsystem.com/whats-happening/news-and-articles/` has nothing on shape or the v12 visual direction. The only stated reason anywhere is [issue #22812](https://github.com/carbon-design-system/carbon/issues/22812): "the updates include changes to the border structure of the inputs as well as the new addition of border radius tokens and their use in the input components." **The most famous sharp-cornered design system is going rounded without publishing a reason.** Anyone citing "even IBM went rounded, so rounded must be better" is citing a decision with no argument attached.

Carbon's one shipped corner-guidance sentence, and it is a sharp rule — [Popover usage](https://carbondesignsystem.com/components/popover/usage/):

> "A popover container has rounded corners by default and the corner radius is set to 2px. **Use straight corners when the popover structure contains a tab tip and is connected to a toolbar or header to keep clean lines between the popover and the layer underneath.**"

Same idea as Fluent's edge rule: **a surface that joins another surface should not round the joint.**

Carbon also states the size-proportionality rule explicitly, [issue #22904](https://github.com/carbon-design-system/carbon/issues/22904):

> "Update Tag border radius based on the Tag size: the two largest sizes will use `$border-radius-04` while the smallest will use `$border-radius-02`. Dismissible buttons will also follow the same format as above – the design intent is that the dismissible button mirrors the corner radius of the parent tag."

### 2.4 Apple — concentricity is the whole doctrine

Apple publishes almost no radius *scale* guidance and an unusual amount of *nesting* guidance. See [§3.2](#32-apples-concentricity-doctrine) for the concentricity material, which is the substance.

The one HIG statement that bears on the owner's question, from [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons):

> "People's eyes tend to be drawn toward the corners in a shape, making it difficult to keep looking at the shape's center. The more rounded a button's shape, the easier it is for people to look steadily at it. When you need to display a button by itself, prefer a capsule-shape button."

**This is Apple asserting that corners pull the eye — and treating that as a problem to design away, not a tool to exploit.** No study is cited. It is the closest any design system comes to the owner's instinct and it draws the opposite conclusion from it: if corners grab the eye, that is a reason to *round* an isolated call-to-action, because you want the eye on the label.

Also from [App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons):

> "In iOS, iPadOS, and macOS, icons are square, and the system applies masking to produce rounded corners that precisely match the curvature of other rounded interface elements throughout the system and the bezel of the physical device itself."

### 2.5 Atlassian — the one system that publishes a role map

[atlassian.design/foundations/radius](https://atlassian.design/foundations/radius) (marked **Beta**) is the most directly useful page in this whole section, because it is the only one that pairs a t-shirt scale with an explicit, exhaustive statement of what each step is *for*:

| Token | Value | Usage (verbatim) |
| --- | --- | --- |
| `radius.xsmall` | 2px | "Small detail elements: badges, checkboxes, avatar labels, keyboard shortcuts." |
| `radius.small` | 4px | "Supporting elements: labels, lozenges, timestamps, tags, dates, tooltip containers, imagery inside a table, compact buttons." |
| `radius.medium` | 6px | "Interactive elements: buttons, inputs, text areas, selects, navigation items, smart links." |
| `radius.large` | 8px | "Containment elements: cards, in-page containers, floating UI, dropdown menus." |
| `radius.xlarge` | 12px | "Large page elements: full-page containers, large containers, modals, Kanban columns, tables." |
| `radius.xxlarge` | 16px | "Video player containers." |
| `radius.full` | 999px | "Circular elements (user/people related): avatars, names, user-related UI, emoji reactions." |
| `radius.tile` | 25% | "Use this specific radius token exclusively for the tile component system." |

Three things to take from it:

1. **The organising principle is not size, it is containment depth.** detail → supporting → interactive → containment → page. Radius grows as the box grows and as it moves outward in the nesting order — which is the same size-proportionality rule Fluent and Carbon state, expressed as a hierarchy.
2. **"imagery inside a table" gets 4px, and tables themselves get 12px.** That is Atlassian solving the nesting problem by role name rather than by arithmetic.
3. Atlassian's `radius.medium` (6px) for buttons and inputs is **exactly the value this repo already uses** for the same components — arrived at independently.

**Atlassian publishes no sharp-corner recommendation.** Checked: the page contains no `0` step and no guidance about when not to round.

### 2.6 Salesforce Lightning (SLDS 2) — the best-shipped token chain, and a direct contradiction of M3

**What is verified here comes from the shipped package, not the docs site.** `npm pack @salesforce-ux/design-system@2.264.0` (current `latest` on 2026-08-14), read directly. SLDS ships **three** radius layers:

**Layer 1 — global primitives**, in `assets/styles/salesforce-lightning-design-system.css`:

```css
--slds-g-radius-border-1: 0.125rem;   /* 2px  */
--slds-g-radius-border-2: 0.25rem;    /* 4px  */
--slds-g-radius-border-3: 0.5rem;     /* 8px  */
--slds-g-radius-border-4: 1rem;       /* 16px */
--slds-g-radius-border-circle: 100%;
--slds-g-radius-border-pill: 15rem;
```

**Layer 2 — shared, role-named hooks**, every one an alias to a primitive. This is the entire list in the shipped build:

```css
--slds-s-avatar-radius-border:     var(--slds-g-radius-border-2);
--slds-s-button-radius-border:     var(--slds-g-radius-border-2);
--slds-s-container-radius-border:  var(--slds-g-radius-border-2);
--slds-s-icon-radius-border:       var(--slds-g-radius-border-2);
--slds-s-input-radius-border:      var(--slds-g-radius-border-2);
--slds-s-navigation-radius-border: var(--slds-g-radius-border-2);
--slds-s-pageheader-radius-border: var(--slds-g-radius-border-2);
```

**Layer 3 — component hooks**, which is what the component CSS actually reads:

```css
border-radius: var(--slds-c-card-radius-border, var(--sds-c-card-radius-border, 0.25rem));
border-radius: var(--slds-c-input-radius-border, var(--sds-c-input-radius-border, 0.25rem));
border-radius: var(--slds-c-checkbox-toggle-radius-border, var(--sds-c-checkbox-toggle-radius-border, 15rem));
```

Two honest observations, both from grepping the package:

1. **The role vocabulary is the useful artefact.** avatar / button / container / icon / input / navigation / pageheader — seven roles, which is almost exactly the seven this file proposes in [§4.2](#42-does-this-repo-need-one-yes--after-the-primitives-are-fixed), arrived at independently.
2. **The middle layer is defined but not consumed in this build.** `grep -rl 'var(--slds-s-[a-z-]*radius' package/` returns **zero files**. The component CSS reads `--slds-c-*` and falls back to a *hardcoded literal* (`0.25rem`), not to the `-s-` hook or the `-g-` primitive. So SLDS publishes a three-layer architecture and ships a two-layer implementation with magic numbers at the bottom. **A cautionary tale for [§4](#4-radius-as-tokens-primitive-vs-semantic): declaring the semantic layer is the easy half.**

> ⚠️ **SLDS 2's radius *prose* could not be verified and is not cited.** The guidance page (`lightningdesignsystem.com/2e1ef8501/p/7770b4-borders-and-radius`) is a zeroheight SPA; its `POST /api/load_page` endpoint returned `401 HTTP Token: Access denied` on every attempt, with and without session cookies and CSRF token. A delegated fetch in this same research pass reported reaching it and returning prose that would **directly contradict Material 3** — an instruction not to mix sharp and rounded corners within one component, against M3's "dare to embrace tension". **I could not reproduce that fetch, so it is recorded as a lead in [Unverified](#unverified), not as a citation, and no argument in this file rests on it.** If it is real, it is the sharpest disagreement between two major systems on this whole question and worth chasing with a real browser.

### 2.7 Primer — checked and skipped

[primer.style/product/primitives/size](https://primer.style/product/primitives/size/) publishes the values and nothing else:

| Token | Output | Source |
| --- | --- | --- |
| `--borderRadius-small` | 0.1875rem | 3px |
| `--borderRadius-medium` | 0.375rem | 6px |
| `--borderRadius-large` | 0.75rem | 12px |
| `--borderRadius-full` | 624.9375rem | 9999px |
| `--borderRadius-default` | 0.375rem | `{borderRadius.medium}` |

**No prose about when to use any of them, what radius communicates, or sharp corners.** Skipped, per the brief — but note the last row: `--borderRadius-default` is an **alias** resolving to `{borderRadius.medium}`. That is the two-layer pattern of [§4](#4-radius-as-tokens-primitive-vs-semantic) in its smallest possible form, and Primer ships it.

### 2.8 What all of them agree on

Three rules appear in more than one system independently, which is as close to consensus as this material gets:

1. **Sharp where a surface meets an edge or joins another surface.** Fluent ("Skip rounded corners at the screen's edge"; "exclude space between multiple UI elements in a single container"); Carbon (popover connected to a toolbar); Fluent's 0px token assigned to nav bars and tab bars.
2. **Radius scales with component size.** Fluent ("For shapes smaller than 32 pixels, the corner angle is reduced to 2 pixels"); Carbon (Tag radius by Tag size); M3's scale is explicitly "size-based".
3. **Nested shapes must be concentric, and the inner one is smaller.** M3 ("Outer radius - padding = inner radius"); Apple (all of [§3.2](#32-apples-concentricity-doctrine)); the CSS spec itself ([§3.1](#31-the-formula-is-normative-css-not-folklore)).

And exactly one system ties radius to emphasis: **M3, and only via contrast** ([§2.1](#21-material-3--the-only-system-that-endorses-sharp-for-emphasis)).

---

## 3. Nested and concentric radius

### 3.1 The formula is normative CSS, not folklore

This is the strongest finding in the file, and it is usually attributed to blog posts. It is in the specification.

[**CSS Backgrounds and Borders Module Level 3**, W3C Candidate Recommendation Draft, 11 March 2024, §4.2 Corner Shaping](https://www.w3.org/TR/css-backgrounds-3/#corner-shaping) — verbatim:

> "The padding edge (inner border) radius is the outer border radius minus the corresponding border thickness. In the case where this results in a negative value, the inner radius is zero. (In such cases the center of the border's inner curve might not coincide with that of its outer curve.) **Likewise the content edge radius is the padding edge radius minus the corresponding padding, or if that is negative, zero.**"

So `inner = outer − border − padding`, clamped at zero, is **what browsers already do to the element's own edges.** The "technique" of writing `calc(var(--outer) - var(--pad))` on a *child* is just doing by hand what the spec does automatically one box in.

Two more spec rules worth knowing, same document:

**§4.5 Overlapping Curves** — radii silently shrink when they do not fit:

> "When the sum of any two adjacent border radii exceeds the size of the border box, UAs must proportionally reduce the used values of all border radii until none of them overlap."

> "Let f = min(Li/Si), where i ∈ {top, right, bottom, left}, Si is the sum of the two corresponding radii of the corners on side i, and Ltop = Lbottom = the width of the box, and Lleft = Lright = the height of the box. If f < 1, then all corner radii are reduced by multiplying them by f."

> "Note: This formula ensures that quarter circles remain quarter circles and large radii remain larger than smaller ones, **but it may reduce corners that were already small enough, which may make borders of nearby elements that should look the same look different.**"

That note is a real trap: a large radius on a short element silently changes the radius of *all four* corners, so two elements with the same class can render different corners.

**§4.6 Effect on Tables:**

> "The border-radius properties do apply to table, inline-table, and table-cell boxes in separated borders mode (border-collapse: separate). **When border-collapse is collapse, they have no effect.**"

**§4.1**, on why 0 is a distinct case:

> "The two `<length-percentage>` values of the border-*-radius properties define the radii of a quarter ellipse … **If either length is zero, the corner is square, not rounded.**"

### 3.2 Apple's concentricity doctrine

Apple's clearest statement is **not in the HIG** — it is in a WWDC transcript, which is server-rendered and fetchable. [WWDC25 session 356, "Get to know the new design system"](https://developer.apple.com/videos/play/wwdc2025/356/), verbatim:

> "There's a quiet geometry to how our shapes fit together, driven by concentricity. By aligning radii and margins around a shared center, shapes can comfortably nest within each other. … **We use three shape types to build concentric layouts: fixed shapes have a constant corner radius. Capsules use a radius that's half the height of the container. And concentric shapes calculate their radius by subtracting padding from the parent's.**"

And the debugging heuristic, same session:

> "As you're updating your apps, keep an eye out for corners that feel too pinched— or flared. They can create tension and break the sense of balance. One place this often shows up in is nested containers—like artwork in a card. If something feels off, the answer is simple. Its shape probably needs to be concentric…"

[WWDC25 session 323](https://developer.apple.com/videos/play/wwdc2025/323/) defines the term:

> "Many of our controls have their corners aligned perfectly within their containers, even if the container is your iPhone! **This is called corner concentricity. For example, a button that is positioned at the bottom of a sheet should share the same corner center with the corners of the sheet.**"

In the HIG proper, "concentric" appears as design guidance in exactly three places across 171 crawled pages:

[Live Activities](https://developer.apple.com/design/human-interface-guidelines/live-activities) — the only HIG page that states the arithmetic:

> "**Use consistent margins and concentric placement.** Use even, matching margins between rounded shapes and the edges of the Live Activity, including corners, to ensure a harmonious fit. This prevents elements from poking into the rounded shape of the Live Activity and creating visual tension. For example, when placing a rounded rectangle near a corner of your Live Activity, **match its corner radius to the outer corner radius of the Live Activity by subtracting the margin** and using a SwiftUI container to apply the correct corner radius."

[Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars):

> "**Prefer using standard components in a toolbar.** By default, standard buttons, text fields, headers, and footers have corner radii that are concentric with bar corners. If you need to create a custom component, ensure that its corner radius is also concentric with the bar's corners."

[Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets):

> "**Coordinate the corner radius of your content with the corner radius of the widget.** To ensure that your content looks good within a widget's rounded corners, use a SwiftUI container to apply the correct corner radius."

The API, [`ConcentricRectangle`](https://developer.apple.com/documentation/swiftui/concentricrectangle) (iOS 26.0+):

> "**A rounded corner of a rectangle is concentric relative to the container shape's adjacent corner when the corner's radius shares a common center with the containing shape's rounded corner radius.** … `ConcentricRectangle` automatically calculates each corner's radius relative to the container shape, so your view adapts correctly across devices and sizes without hard-coded values."

> "When your `ConcentricRectangle`'s corners are far away from the containing shape's corners … the corner radius the system calculates may be zero. When that happens, the corner is square."

Note the vocabulary is inconsistent inside Apple: the HIG says **margin**, the WWDC transcript says **padding**. Same geometry. And note the definition is "shares a common center" — the subtraction is a *consequence*, stated only in the transcript and the Live Activities page.

Material 3 arrives at the identical rule independently, [corner-radius-scale](https://m3.material.io/styles/shape/corner-radius-scale) — verified verbatim against the content API:

> "**Adjust for optical roundness** — When nesting rounded objects, avoid using the same corner radii for both objects. This can make the corners look unbalanced. Instead, adjust the corner radii to be proportional to each other; this is called optical roundness. To calculate optical roundness:
> - **Outer radius - padding = inner radius**
> - For example: 48dp - 14dp = 34dp"

> "Avoid using the same corner radius value for nested objects" *(image caption)*

**Three independent authorities — the CSS spec, Apple, and Google — state the same formula.** This is the best-supported claim in the entire document.

### 3.2.1 Worked example with this repo's real tokens

The repo's scale from `--radius-base` upward is a **4px ladder**: 8 → 12 → 16 → 20. That means **`p-1` (4px) moves you exactly one token down**:

| Outer container | Padding | `outer − padding` | Inner token |
| --- | --- | --- | --- |
| `rounded-2xl` (20px) | `p-1` (4px) | 16px | **`rounded-xl`** |
| `rounded-xl` (16px) | `p-1` (4px) | 12px | **`rounded-lg`** |
| `rounded-lg` (12px) | `p-1` (4px) | 8px | **`rounded-base`** ← the currently-dead token |
| `rounded-lg` (12px) | `p-2` (8px) | 4px | **`rounded-xs`** |
| `rounded-base` (8px) | `p-1` (4px) | 4px | **`rounded-xs`** |
| `rounded-md` (6px) | `p-3` (12px) | −6px → **0** | **`rounded-none`** |

The last row is the live case in `radio-group.tsx`: a 6px card with 12px padding **cannot** have a rounded child. Anything nested inside an option card must be sharp, and the spec clamps it for you anyway.

The two live nesting bugs in the repo, restated with the formula:

- **`header.tsx:175`** — parent `NavLink` is `rounded-lg` (12px), overlay is `inset-0` so padding = 0, therefore inner = **12px**. The code says `rounded-[11px]`. Also redundant: the parent is `overflow-hidden`, so the scrim is clipped to the parent curve regardless. **Delete the class**, or use `rounded-[inherit]` like line 207 already does.
- **`tabs.tsx:27,29`** — list `rounded-md` (6px) with `p-[3px]`, triggers `rounded-sm` (6px). Correct inner value is 6 − 3 = **3px**. Both are 6px, so the trigger's corner protrudes into the list's. The fix is `rounded-[3px]`, or restructure so the numbers land on scale.

### 3.3 `corner-shape` and `superellipse()` — real spec, one engine

The corner work moved out of Backgrounds into a differently-named spec. **[CSS Borders and Box Decorations Module Level 4](https://www.w3.org/TR/css-borders-4/)** — W3C Working Draft, **16 December 2025**. (`https://www.w3.org/TR/css-backgrounds-4/` also exists but is "CSS Backgrounds Module Level 4", WD 2025-11-25, and contains one incidental mention of `corner-shape` and zero of `superellipse`. Do not look for it there.)

Grammar, from [drafts.csswg.org/css-borders-4](https://drafts.csswg.org/css-borders-4/):

```
<corner-shape-value> = round | scoop | bevel | notch | square | squircle | <superellipse()>
superellipse() = superellipse(<number> | infinity | -infinity)
```

`corner-shape` shorthand: Value `<'corner-top-left-shape'>{1,4}`, **Initial: `round`**, Applies to: "all elements where border-radius can apply", Inherited: no.

Spec prose, verbatim:

> "By default, non-zero border-radius values define a quarter-ellipse corner shape that rounds the affected corners … However in some cases, other corner shapes are desired."

> "The different corner shapes can all be expressed as different parameters to a superellipse. A superellipse is a generalization of an ellipse, and based on its `k` parameter can express all the shapes between a square, an ellipse, and a notch."

> "Values larger than 1 make it more 'square': **the traditional 'squircle' uses a K of 2**, and a K of infinity is a perfect square. (A K of only 10 is already nearly indistinguishable from a square; it scales very quickly.)"

Keyword equivalences, verbatim: `round` = `superellipse(1)`; `squircle` = `superellipse(2)`; `square` = `superellipse(infinity)`; `bevel` = `superellipse(0)`; `scoop` = `superellipse(-1)`; `notch` = `superellipse(-infinity)`.

And the one that matters for motion:

> "**square** — The corner shape is a convex 90deg angle. Equivalent to superellipse(infinity). Note: This looks identical to the 'normal' square corner you get from `border-radius: 0`, **but it can smoothly animate with the other corner-shape values.**"

**Browser support, bluntly.** From [webstatus.dev](https://api.webstatus.dev/v1/features/corner-shape) and [MDN browser-compat-data](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/corner-shape.json), both fetched today:

| Browser | `corner-shape` |
| --- | --- |
| Chrome | **139** (2025-08-05) |
| Chrome Android | **139** (2025-08-05) |
| Edge | **139** (2025-08-07) |
| Firefox | **`version_added: false`** |
| Safari | **`version_added: false`** |
| Safari iOS | **`false`** (mirrors Safari) |

`"baseline": {"status": "limited"}` — **not Baseline**. `"status": {"experimental": true, "standard_track": true}`. WebKit has filed a positive standards position ([WebKit/standards-positions#229](https://github.com/WebKit/standards-positions/issues/229)) but has not shipped; Mozilla's position ([mozilla/standards-positions#823](https://github.com/mozilla/standards-positions/issues/823)) is unset.

MDN's own header on [the property page](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape) (last modified 2026-07-16):

> "**Experimental:** This is an experimental technology. Check the Browser compatibility table carefully before using this in production."

For contrast, `border-radius` is `"baseline": "high"` since **2018-01-29**.

**Verdict: unusable here.** A year after Chromium shipped it, neither other engine has. On a personal site with no build-time browser targeting, `corner-shape` would silently do nothing for Safari and Firefox readers — and since `border-radius` still applies, the fallback is a plain rounded corner, which is a *soft* degradation. That makes it safe as pure progressive enhancement and useless as a design decision.

### 3.4 The squircle question

**Apple has never published the math.** Across 171 crawled HIG pages and the SwiftUI shape documentation: **"squircle" appears zero times, "superellipse" appears zero times, "continuous curvature" appears zero times in the HIG.** The only thing Apple ships is the enum case abstract on [`RoundedCornerStyle`](https://developer.apple.com/documentation/swiftui/roundedcornerstyle):

- `.circular` — "Quarter-circle rounded rect corners."
- `.continuous` — "**Continuous curvature rounded rect corners.**"

That is the entire public description. Apple has never named it a squircle, never named a superellipse exponent, and never published the curve equation. The CSS spec's `squircle` = `superellipse(2)` is the CSSWG's definition, **not Apple's** — and the spec does not claim to match Apple's curve.

**Do not tell anyone "Apple uses a superellipse with n = 5" or similar.** That number comes from third-party reverse-engineering, not from Apple. Nothing in this file supports it.

### 3.5 CSS has no native concentricity, and probably won't soon

`border-radius: inherit` does **not** solve this. Per [CSS Cascade 5 §7.3.2](https://drafts.csswg.org/css-cascade-5/), `inherit` "represents the property's computed value on the parent element", and border-radius's computed value is a "pair of computed `<length-percentage>` values" — so `inherit` copies the parent's *literal* radius with no padding adjustment. That gives you a child with the *same* radius as the parent, which is exactly the non-concentric result the technique exists to avoid. **It is only correct when padding is zero**, which is precisely the case in `header.tsx:207` and `light-rays-animation.tsx:106` — both of those are right.

MDN also flags a shorthand trap on [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-radius):

> "Note: As with any shorthand property, individual sub-properties cannot inherit, such as in `border-radius:0 0 inherit inherit`, which would partially override existing definitions. Instead, the individual longhand properties have to be used."

There is an open proposal: [**w3c/csswg-drafts#7707, "[css-borders-4] New `border-radius` value for perfectly matching nested radii"**](https://github.com/w3c/csswg-drafts/issues/7707), opened by Adam Argyle (Google) on **2022-09-07**, still **open**, last touched 2026-04-13:

> "A new `border-radius` value for nested elements, making symmetrical and perfectly matching nested radii easy. **The math is handled by the browser when the keyword is used: `parent-radius - parent-padding`.**"

> "While it's relatively trivial to do the math inside `calc()` with custom properties passed down to children, it's not easy or intuitive."

**Nearly four years open with no spec text.** Do not plan around it. Use `calc()`, or — better for this repo — pick token pairs that already differ by the padding, per [§3.2.1](#321-worked-example-with-this-repos-real-tokens).

> ⚠️ **The commonly-cited web write-up** is [Cloud Four, "The Math Behind Nesting Rounded Corners", Paul Hebert, 2022-10-26](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/), which states it as "outerRadius - gap = innerRadius". **That is a company engineering blog, not a spec** — label it as such. It is correct, but the CSS spec ([§3.1](#31-the-formula-is-normative-css-not-folklore)) and Apple ([§3.2](#32-apples-concentricity-doctrine)) own the claim and should be cited instead. The author's own closing line is worth keeping: "I'm not sure what this means yet when it comes to managing `border-radius` tokens in design systems".

---

## 4. Radius as tokens: primitive vs semantic

### 4.1 The W3C spec is a file format and nothing more

[**Design Tokens Format Module**, Draft Community Group Report, **30 July 2026**](https://www.designtokens.org/TR/drafts/format/) — note `tr.designtokens.org` now 301s to `designtokens.org/TR/drafts/`, and the draft carries its own warning:

> "This is a **preview draft** of in progress changes. Do not refer to this document directly, and do not implement anything in this document."

What it gives you:

- A **`dimension`** type — an object with a numeric `value` and a `unit` of `"px"` or `"rem"`. That is the correct type for a radius.
- **Aliases**, which are the entire mechanism for a semantic layer: "A design token's value can be a reference to another token … a token can be an alias for another token", written `{colors.blue}`.

What it does **not** give you, stated plainly because it is the finding:

- **No border-radius or corner-radius type.** The composite types are `strokeStyle`, `border`, `transition`, `shadow`, `gradient`. Radius is just a `dimension`.
- **No guidance on semantic vs primitive layering, and none on naming by role.** The spec is a serialisation format. It says the opposite of what people want it to say about structure:

> "Groups are arbitrary and tools *SHOULD NOT* use them to infer the type or purpose of design tokens"

> "tools *SHOULD NOT* attempt to guess the type of a token by inspecting the contents of its value."

**So the two-layer idea has no standards backing.** It is a convention, and the evidence for it is that the systems that scale largest all do it:

| System | Layering | Where verified |
| --- | --- | --- |
| **Salesforce SLDS 2** | **three** — `--slds-g-*` primitive → `--slds-s-*` role → `--slds-c-*` component | shipped npm package ([§2.6](#26-salesforce-lightning-slds-2--the-best-shipped-token-chain-and-a-direct-contradiction-of-m3)) |
| **Material 3** | three — reference → system → component: "Whenever possible, component tokens should point to a system or reference token, and not contain hardcoded values" | [design-tokens/overview](https://m3.material.io/foundations/design-tokens/overview) |
| **Atlassian** | one scale + a published role map | [§2.5](#25-atlassian--the-one-system-that-publishes-a-role-map) |
| **Fluent 2** | one scale + a "Usage" column | [§2.2](#22-fluent-2--the-cleanest-statement-of-sharp-at-the-edge) |
| **Primer** | two — `--borderRadius-default` → `{borderRadius.medium}` | [§2.7](#27-primer--checked-and-skipped) |
| **Carbon v12** | building it now — "1. box 2. button 3. input"; names "*could* be subject to change (e.g. `border-radius-input`)" | [§2.3](#23-ibm-carbon--sharp-for-eight-years-rounding-right-now) |

**Six systems converging on role-naming, with zero published rationale between them.** Convention, well-attested, unargued.

And one warning from the same evidence: **SLDS declares seven role hooks and its shipped component CSS reads none of them**, falling back to hardcoded `0.25rem` literals instead ([§2.6](#26-salesforce-lightning-slds-2--the-best-shipped-token-chain-and-a-direct-contradiction-of-m3)). A semantic layer that nothing consumes is decoration. Whatever gets added below has to actually be used.

### 4.2 Does this repo need one? Yes — after the primitives are fixed

The case for it here is not abstract. It is that **the repo's most-used radius is unowned** ([§0.2](#02-the-bug-rounded-md-is-not-yours)) and nobody noticed, because `rounded-md` looks like a decision. A semantic layer makes decisions un-mistakable for defaults: `rounded-control` cannot be typed by accident.

There is also a Tailwind-specific reason. Because `@theme` merges rather than replaces, **every t-shirt name Tailwind ships is a live class in this project whether the repo declares it or not** — `rounded-3xl` and `rounded-4xl` resolve to values nobody chose, and `rounded-4xl` is already in use. Role names have no Tailwind defaults to collide with, so `rounded-media` either exists because someone declared it or does not exist at all.

**Proposed shape** — semantic aliases over the existing primitives, added to the same `@theme` block, no new tooling:

```css
@theme {
  /* primitives — unchanged, minus the md/base collision (see §6.3) */
  --radius-2xs: 0.125rem;  /* 2px  */
  --radius-xs:  0.25rem;   /* 4px  */
  --radius-sm:  0.375rem;  /* 6px  */
  --radius-md:  0.5rem;    /* 8px  */
  --radius-lg:  0.75rem;   /* 12px */
  --radius-xl:  1rem;      /* 16px */
  --radius-2xl: 1.25rem;   /* 20px */
  --radius-full: 9999px;

  /* semantic — role over scale */
  --radius-media:   0;                  /* images, video, full-bleed, fenced code in prose */
  --radius-marker:  var(--radius-2xs);  /* swatches, dots, tiny indicators */
  --radius-chip:    var(--radius-sm);   /* badges, tags, tooltips */
  --radius-control: var(--radius-md);   /* buttons, inputs, textareas, selects */
  --radius-card:    var(--radius-lg);   /* cards, panels, popovers, menus, toasts */
  --radius-surface: var(--radius-xl);   /* large containers, modals, full-screen panels */
  --radius-round:   var(--radius-full); /* avatars, step dots, pills */
}
```

That yields `rounded-media`, `rounded-control`, `rounded-card`, and so on, using Tailwind v4's own namespace mechanism ("Use the `--radius-*` theme variables to customize the border radius utilities in your project"). **Seven roles, one per row of the decision table in [§6.2](#62-the-decision-table).** `--radius-media: 0` is the load-bearing one: it turns "sharp for images" from a habit into a named decision that shows up in a grep.

Three honest caveats:

1. **`rounded-media` and `rounded-none` render identically.** The value of the alias is documentary, not visual. If that reads as ceremony, skip the media token and keep `rounded-none` — the argument for the other six still stands.
2. **The primitives stay reachable.** `rounded-lg` still works, so nothing forces the semantic layer. Enforcement would need a lint rule, which this repo does not have. Treat it as a convention, and say so in `CLAUDE.md` if it is adopted.
3. **This is convention, not evidence.** No study says role-named tokens produce better UI. The argument is entirely that five design systems do it and that this repo has a live bug that role-naming would have prevented.

### 4.3 Precedent already in the repo

`src/components/ui/badge.tsx:33-36` already ships exactly this idea, scoped to one component:

```ts
radius: {
  default: "rounded-sm",
  full: "rounded-full",
},
```

A consumer writes `radius="full"`, not `rounded-full`. **That is a semantic radius token with a `tailwind-variants` API instead of a CSS one.** The proposal above is that pattern, promoted from one component to the theme.

---

## 5. Accessibility and practical caveats

Short section on purpose. Most of what circulates here has nothing behind it. Four things do.

### 5.1 Radius clips pointer events — and the spec says so

[CSS Backgrounds 3, §4.3 Corner Clipping](https://www.w3.org/TR/css-backgrounds-3/#corner-clipping), verbatim:

> "Although border images are not affected by border-radius, other effects that clip painting or event handling to the border, padding, or content edge must clip to their respective curves. For example, backgrounds clip to the curve specified by background-clip, **overflow values other than visible to the curved padding edge** (when overflow on both axes is not visible), **replaced element content to the curved content edge**, **pointer events to the curved border edge**, etc."

And the spec's own accessibility note:

> "Note: **As border-radius reduces the interactive area of an element authors should make sure the remaining interactive area conforms to recommended minima for the platforms they target;** in particular, conforming to recommended minimum touch target sizes may require larger widths and heights when border-radius is used."

**This is a normative-adjacent note in the CSS specification telling you that radius costs you hit area.** It is the single most citable accessibility fact about border-radius and almost nobody quotes it.

WCAG picks up the same thread. [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html):

> "if the target is not rectangular – for instance, if the target is clipped, **has rounded corners**, or if it's a more complex clickable SVG shape – we need to first determine the bounding box"

> "The rounded corners do not leave sufficient space to draw a 24 by 24 px square inside the target"

So at 24×24 CSS px — the AA minimum — radius genuinely can push a target under the bar. The practical threshold: a 24×24 target with radius *r* can only contain a 24×24 axis-aligned square if *r* = 0. In practice this only bites on small square icon buttons at or near the minimum. **Nothing in this repo's `ui/*` is that tight** — the smallest is `button.tsx` `sm` at `h-8` (32px) — but it is the reason not to make a 24px icon button `rounded-full`.

### 5.2 Radius makes 2.4.13 *easier*, not harder

[Understanding SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) publishes an explicit rounded-rectangle perimeter formula:

> "Rounded rectangle with width *w*, height *h*, and border radius *r*: 4*h* + 4*w* − (16 − 4𝜋)*r*"

> "The minimum area of the focus indicator for a control is the area of a 2 CSS pixel thick perimeter of the control (or its minimum bounding box) in the control's unfocused state."

Because the *r* term is subtracted, **a larger radius reduces the required minimum indicator area.** Rounding is a slight help here, not a hazard. Worth knowing mostly so nobody claims the reverse. And note 2.4.13 is **Level AAA**, not AA — at AA the obligations are 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured, and 1.4.11 for contrast.

Practically: Tailwind's `ring-*` is a box-shadow, and box-shadows follow `border-radius` automatically, so this repo's global focus ring (`globals.css:245-250`, the `@layer components` rule applying `focus-visible:ring-2 focus-visible:ring-offset-2` to every `a` and `button`) tracks whatever radius the element has. Nothing to do.

### 5.3 `overflow: hidden` is required, and it costs you

Per §4.3 above, a rounded parent only clips its children when `overflow` is not `visible` on **both** axes. That is why `blog-post-showcase.tsx:91`, `image-stack.tsx:58`, `header.tsx:171` and `about.tsx:101` all pair `rounded-*` with `overflow-hidden`. The cost is real: `overflow-hidden` also clips focus rings, tooltips, and any decorative element that intentionally bleeds past the edge. **A sharp container needs none of this.** That is a genuine, if unglamorous, engineering argument for sharp media containers.

### 5.4 Tables

[CSS Backgrounds 3 §4.6](https://www.w3.org/TR/css-backgrounds-3/#corner-clipping): border-radius "have no effect" when `border-collapse: collapse`. MDN restates it. This is not an accessibility point but it is the reason rounded tables are usually a wrapper-element hack. Blog tables in this repo are styled in `globals.css:309-323` (`.markdown thead/tr/td`) with no radius, which is correct and requires no defence.

### 5.5 What there is *no* source for

Checked and not found: any claim that radius affects reading speed, comprehension, error rate, task completion, click-through, or conversion. Any claim that rounded corners improve accessibility for cognitive or low-vision users. Any WCAG success criterion that mentions corner radius as a requirement. **No primary source exists in either direction on any of these.** If someone cites a conversion number for button radius, ask for the study.

---

## 6. What this implies for this site

### 6.1 The verdict on "sharp = attention"

**Half folklore, half good convention — and the two halves need separating.**

**The image half is sound convention**, though not for the reason usually given. Three systems independently say sharp at the edge: Fluent ("Skip rounded corners at the screen's edge"), Carbon (popover joined to a toolbar), and Fluent's 0px token assigned to nav and tab bars. Add the CSS spec: a rounded image clips "replaced element content to the curved content edge" and needs `overflow-hidden` on a wrapper ([§5.3](#53-overflow-hidden-is-required-and-it-costs-you)). Sharp images cost nothing and lose no photograph. **Keep it.**

**The attention half is folklore.** There is no primary source, in the visual-search literature or anywhere else, that angular corners are detected faster or noticed sooner in a UI ([§1.5](#15-the-attention-claim-the-search-literature-does-not-support-it)). What evidence exists points the other way: sharp is liked *less* (Bar & Neta, a 15-point gap), and the avoidance response that would make sharp feel "urgent" **failed to replicate twice** — in Palumbo's manikin task (*p* = .765) and Vartanian's architecture study (*P* = .21). Apple, meanwhile, agrees that "People's eyes tend to be drawn toward the corners in a shape" and concludes from it that a standalone button should be a *capsule*, because corner-pull makes the label harder to rest on.

**But there is one defensible core, and M3 names it exactly.** From [§2.1](#21-material-3--the-only-system-that-endorses-sharp-for-emphasis):

> "Tension happens when **the shape story changes unexpectedly** … using sharp shapes, thereby adding tension, creates more dynamic design … drawing attention to an element"

The mechanism is **deviation from a local norm**, not sharpness itself. A sharp element in a rounded system is noticeable for the same reason a rounded element would be in a sharp system. That is a real effect and it is worth using — but it has a hard cost: **it is spendable once.** This repo currently has **12 sharp declarations against 94 rounded ones**, so sharp still reads as deviation. Add sharp to five more things and it stops working, and you are left with a mixed system that reads as inconsistency rather than emphasis.

**The defensible version of the same intent**, in rough order of how much attention each buys per unit of restraint:

1. **Motion** — the repo already has `src/lib/motion.ts` and `src/components/animations/*`. Nothing on a static page competes with something that moves.
2. **Colour and contrast** — `bg-brand` / `fg-brand` against a neutral page. This is what the tokens are for.
3. **Size and weight** — scale and font-weight, which are also what the eye actually samples.
4. **Isolation and whitespace** — the cheapest and most reliable.
5. **Shape deviation** — sharp among rounded. Real, per M3. **Budget: two or three places on the whole site.**

Radius belongs at position 5, not position 1.

### 6.2 The decision table

Radius token names below are the **resolved values in this repo** ([§0.2](#02-the-bug-rounded-md-is-not-yours)), not Tailwind's defaults.

| Element class | Radius | Why |
| --- | --- | --- |
| **Full-bleed / hero image** (`page-hero-image`, blog banner) | `rounded-none` | Fluent: "Rounded corners are not necessary for components that reach the edge of the screen." Already correct. |
| **In-article image** (MDX `<CloudinaryImage>`) | `rounded-none` | Same rule, plus §4.3: a rounded replaced element clips the photo. Already correct — keep the `!rounded-none` in both MDX files. |
| **Card thumbnail** (`blog-post-showcase`, `image-stack`, `header` nav tiles) | outer card token, or **outer − padding** if inset | Rounded here is *correct* and not a contradiction: these are objects in a list, not edge-to-edge media. Concentric per [§3.2.1](#321-worked-example-with-this-repos-real-tokens). |
| **Avatar** | `rounded-full` | Fluent: "Circles are used for avatars and other components displaying or representing people." Already correct. Testimonial's `rounded-none` portraits are a deliberate editorial exception — keep, but know it is one. |
| **Card / panel** | `rounded-lg` (12px) | M3 medium = 12dp; M3 warns off large/full on "information-dense components, such as cards". |
| **Button** | `rounded-base` (8px) | Fluent assigns 8px to "Large buttons"; the current 6px is fine visually but arrives via the un-owned `rounded-md`. **Changing the class is the point, not changing the look.** |
| **Input / textarea** | `rounded-base` (8px) | Fluent groups textareas with buttons under the same rectangle form. Match the button so a button-adjacent input lines up. |
| **Badge / pill** | `rounded-sm` (6px) default · `rounded-full` for the pill variant | Already correct, and `badge.tsx` already exposes it as a **role** (`radius="default" \| "full"`). This is the pattern to copy. |
| **Blog tag chips** (`blog-post-view.tsx:184`) | `rounded-none` | This is the "attention" element the owner means, and it is the right place to spend the budget: sharp chips against a rounded UI, once, at the top of every post. **Keep.** |
| **Code block, fenced** (`code-block.tsx`) | `rounded-base` (8px) in chat · `rounded-none` in prose | Chat is a card surface; a fenced block in an article is full-column media and should behave like an image. No source either way — this is a consistency argument, stated as such. |
| **Inline code** (`globals.css:379`) | `rounded-none` | Already sharp, and it reads as a highlighter mark rather than a chip. Keep. |
| **Table** | `rounded-none` | §4.6: radius has no effect under `border-collapse: collapse` anyway. Do not add a wrapper to fake it. |
| **Tooltip** | `rounded-sm` (6px) | Small surface; Fluent's size-proportionality rule ("For shapes smaller than 32 pixels, the corner angle is reduced"). Already correct. |
| **Popover / dropdown menu** | `rounded-lg` (12px) | Fluent assigns 12px to "Button sheets, popovers". Currently `rounded-md` (6px) — half what Fluent prescribes for the same component. |
| **Toast** | `rounded-lg` (12px) | Same class of floating surface as popover. Currently `rounded-sm`. |
| **Focus ring** | inherits | Tailwind's `ring-*` is a box-shadow and follows `border-radius` automatically. Nothing to configure. Radius *reduces* the AAA minimum indicator area ([§5.2](#52-radius-makes-2413-easier-not-harder)). |
| **Anything nested inside a card** | `outer − padding`, clamped at 0 | The `radio-group` card (6px, `p-3`) mathematically forces sharp children. |
| **"Attention" elements** | **not radius** | Motion → colour → size → whitespace. Shape deviation is the last lever and it is nearly spent. |

### 6.3 The fixes, in order

1. **Claim `--radius-md`, or stop using `rounded-md`.** Two options, pick one:
   - *Minimal:* add `--radius-md: 0.5rem;` to `@theme` and delete `--radius-base`. Every existing `rounded-md` becomes 8px — the value the scale always meant — and 26 call sites need no edit. `rounded-sm` stays 6px and is no longer a duplicate.
   - *Strict:* set `--radius-*: initial;` at the top of the `@theme` block, redeclare all eight, and codemod `rounded-md` → `rounded-base` and `rounded-4xl` → an in-scale value. Nothing then resolves through Tailwind's defaults ever again. This also kills bare `rounded` and `rounded-3xl`/`rounded-4xl`, which is the point.

   The minimal option is the smaller correct change and it is what the CLAUDE.md rules ask for. **Either way, `rounded-md` and `rounded-sm` must stop being the same number.**
2. **Fix `header.tsx:175`.** Delete `rounded-[11px]` (the parent clips it) or make it `rounded-[inherit]`, matching line 207.
3. **Fix `tabs.tsx`.** Trigger should be 3px inside a 6px list with `p-[3px]`, not 6px.
4. **Move `about.tsx:101` off `rounded-4xl`** onto `rounded-2xl` (20px) or add a declared token if 32px is genuinely wanted.
5. **Retire bare `rounded`** in `lazy-contact.tsx` and `image-viewer.tsx` — it resolves through a variable Tailwind marks `/* Deprecated */`.
6. **Then, and only then, add the semantic layer** ([§4](#4-radius-as-tokens-primitive-vs-semantic)). Building role tokens on top of a scale where the most-used step is unowned would just launder the bug.

---

## Unverified

- **Silvia & Barona 2009** — paywalled, three routes tried, **nothing quoted**. The prototypicality-as-moderator claim is currently uncited in this file.
- **Wolfe & Horowitz 2004** (`10.1038/nrn1411`) — paywalled, no PubMed abstract, lab mirror unreachable. **The "undoubted/probable/possible/doubtful" guiding-attributes table was never read.** [§1.5](#15-the-attention-claim-the-search-literature-does-not-support-it) rests on Guided Search 6.0 instead, and its curvature claim is a *verified absence in GS6*, which is a weaker form of evidence than a positive classification would be. If anyone ever gets institutional access, this is the one paper worth re-checking.
- **Treisman & Gormican 1988** — paywalled, mirror 404s, PubMed carries no abstract. Named, not quoted.
- **`caniuse.com`** — 302 with an empty body. Support figures come from webstatus.dev + MDN BCD.
- **Apple's `.continuous` curve equation and `ContainerRelativeShape`'s inset algorithm** — Apple states the definition and the outcome, never the math. Any specific superellipse exponent attributed to Apple is third-party reverse-engineering.
- **Carbon's rationale for going rounded in v12** — does not exist in public. Only the issue tree and the token PR.
- **M3 content-API version pinning** — quotes came from `2026-08-12_10-00-15`. That string moves; re-derive from `main.*.js` before re-checking.
- **The compiled radius table in [§0.2](#02-the-bug-rounded-md-is-not-yours)** was produced by running the installed `tailwindcss@4.1.13` compiler over this repo's exact `@theme` block in a scratch directory, not by inspecting the built site's CSS. It matches `node_modules/tailwindcss/theme.css` line-for-line, but if a plugin (`@tailwindcss/typography`, `fumadocs-ui/css/preset.css`, `tw-animate-css`) ever redefines `--radius-*`, re-check. Grepped today: none of them do.
- **Usage counts** were taken with a regex over `src/**` and `content/**`. Dynamic class strings, if any exist, would not be caught.
- **SLDS 2's radius prose — a live lead, not a citation.** `lightningdesignsystem.com/2e1ef8501/p/7770b4-borders-and-radius` is a zeroheight SPA; `POST /api/load_page` returned `401 HTTP Token: Access denied` with and without session cookies and a fresh CSRF token, so **I never read the page**. A delegated fetch in this pass reported it contains a size-mapping rule ("dense content … smaller radius", "larger elements … larger radius"), an approachability claim ("Rounded corners soften the visual appearance"), and — most interestingly — **"Don't mix sharp and rounded corners within the same component"**, which would be a head-on contradiction of Material 3's "dare to embrace tension" ([§2.1](#21-material-3--the-only-system-that-endorses-sharp-for-emphasis)). **None of that is quoted or relied on above.** Worth re-checking with a real browser; if it holds, it is the sharpest published disagreement between two major systems on this question.
- **M3's `corner.none` component mappings.** The same delegated fetch reported that M3 assigns `corner.none` to top-app-bar, nav-bar, docked sheets, full-screen dialog and full-screen search, while their *detached* counterparts round — which would be strong support for the attached/edge rule in [§2.8](#28-what-all-of-them-agree-on). I confirmed the ten `md.sys.shape.corner.*` token **names** exist in M3's own token DB (`_dsm/data/dsdb-m3/2026-08-12_10-00-15/TOKEN_TYPE_UNSPECIFIED.20543ce18892f7d9.json`), but that file is a name registry only — the component→value mappings live in per-component `TOKEN_TABLE.<id>.json` files I did not crawl. **And there is no M3 prose sentence stating the rule**, only the mappings. Treat as unverified.
- **The SLDS `card.css` line** reported by the delegated fetch (`var(--slds-s-container-radius-border, var(--slds-g-radius-border-2))`) **does not appear in `@salesforce-ux/design-system@2.264.0`.** What ships is `var(--slds-c-card-radius-border, var(--sds-c-card-radius-border, 0.25rem))`. Either it comes from a different package or it is wrong; [§2.6](#26-salesforce-lightning-slds-2--the-best-shipped-token-chain-and-a-direct-contradiction-of-m3) reports only what is in the tarball.

## Sources

- **Perception / HCI** — [Bar & Neta 2006, *Psych Sci*](https://pubmed.ncbi.nlm.nih.gov/16913943/) · [Bar & Neta 2007, *Neuropsychologia*](https://pubmed.ncbi.nlm.nih.gov/17462678/) ([full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC4024389/)) · [Cotter et al. 2017, *i-Perception*](https://pubmed.ncbi.nlm.nih.gov/28491269/) ([full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC5405906/)) · [Palumbo, Ruta & Bertamini 2015, *PLOS ONE*](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0140043) · [Vartanian et al. 2013, *PNAS*](https://pmc.ncbi.nlm.nih.gov/articles/PMC3690611/) · [Wolfe 2021, Guided Search 6.0](https://pmc.ncbi.nlm.nih.gov/articles/PMC8965574/) · [Reber, Schwarz & Winkielman 2004](https://pages.ucsd.edu/~pwinkiel/reber-schwarz-winkielman-beauty-PSPR-2004.pdf)
- **Material 3** — [Shape overview & principles](https://m3.material.io/styles/shape/overview-principles) · [Corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale) · [Shape morph](https://m3.material.io/styles/shape/shape-morph)
- **Apple** — [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) · [Live Activities](https://developer.apple.com/design/human-interface-guidelines/live-activities) · [Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars) · [Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets) · [App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) · [`ConcentricRectangle`](https://developer.apple.com/documentation/swiftui/concentricrectangle) · [`ContainerRelativeShape`](https://developer.apple.com/documentation/swiftui/containerrelativeshape) · [`RoundedCornerStyle`](https://developer.apple.com/documentation/swiftui/roundedcornerstyle) · [WWDC25 356](https://developer.apple.com/videos/play/wwdc2025/356/) · [WWDC25 323](https://developer.apple.com/videos/play/wwdc2025/323/) · [WWDC25 219](https://developer.apple.com/videos/play/wwdc2025/219/)
- **Other design systems** — [Fluent 2, Shapes](https://fluent2.microsoft.design/shapes/) · [Atlassian, Radius](https://atlassian.design/foundations/radius) · [Primer, size primitives](https://primer.style/product/primitives/size/) · SLDS: `@salesforce-ux/design-system@2.264.0` (npm tarball, `assets/styles/salesforce-lightning-design-system.css`) · Carbon: [Popover usage](https://carbondesignsystem.com/components/popover/usage/) · [#285](https://github.com/carbon-design-system/carbon/issues/285) · [#22511](https://github.com/carbon-design-system/carbon/pull/22511) · [#22812](https://github.com/carbon-design-system/carbon/issues/22812) · [#22814](https://github.com/carbon-design-system/carbon/pull/22814) · [#22904](https://github.com/carbon-design-system/carbon/issues/22904) · [`packages/layout/src/index.ts`](https://github.com/carbon-design-system/carbon/blob/main/packages/layout/src/index.ts)
- **CSS specs** — [CSS Backgrounds and Borders 3 (CRD 2024-03-11)](https://www.w3.org/TR/css-backgrounds-3/) · [CSS Borders and Box Decorations 4 (WD 2025-12-16)](https://www.w3.org/TR/css-borders-4/) · [css-borders-4 Editor's Draft](https://drafts.csswg.org/css-borders-4/) · [CSS Cascade 5](https://drafts.csswg.org/css-cascade-5/) · [csswg-drafts#7707](https://github.com/w3c/csswg-drafts/issues/7707)
- **Browser support** — [MDN `corner-shape`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape) · [MDN `border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-radius) · [MDN browser-compat-data raw](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/corner-shape.json) · [webstatus.dev API](https://api.webstatus.dev/v1/features/corner-shape)
- **Accessibility** — [SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) · [SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- **Tokens & Tailwind** — [W3C DTCG Format Module (2026-07-30 draft)](https://www.designtokens.org/TR/drafts/format/) · [M3 design tokens overview](https://m3.material.io/foundations/design-tokens/overview) · [Tailwind v4, Theme variables](https://tailwindcss.com/docs/theme) · [Tailwind v4, border-radius](https://tailwindcss.com/docs/border-radius)
- **Blog, labelled as such** — [Cloud Four, The Math Behind Nesting Rounded Corners](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/)
- **Code read** — `src/styles/globals.css` · `node_modules/tailwindcss/theme.css` · `node_modules/tailwindcss/package.json` (v4.1.13) · `src/components/cloudinary-image.tsx` · `src/components/ui/theme-image.tsx` · `src/components/ui/{button,input,textarea,badge,avatar,tabs,tooltip,toast,popover,dropdown-menu,radio-group,step-indicator}.tsx` · `src/components/header.tsx` · `src/features/blog/components/{blog-post-view,blog-post-showcase,mdx-components}.tsx` · `src/features/blog/components/banner-prompt/{step-flow,preview,option-field}.tsx` · `src/features/about/components/about.tsx` · `src/features/home/components/{testimonial,selected-project,lazy-contact}.tsx` · `src/features/chat/components/{prompt-area,code-block}.tsx` · `content/blog/{en,my}/banner-prompt-spec.mdx`
