# Research: Banner prompt builder UX

Research notes for the interactive builder embedded in `content/blog/{en,my}/banner-prompt-spec.mdx`. Every source below was fetched on **2026-08-11** and quoted from the page itself; where a page could not be fetched, it says so. This is a record of what was checked and when — if the shipped code disagrees, the code wins.

**The question asked:** the builder renders ~39 controls at once inside the article's prose column and overwhelms the reader mid-post. The tool must stay inside the article. An existing full-screen expandable panel (`src/components/animations/expandable-screen.tsx`) is available to reuse. What do primary sources actually say about staged disclosure, form length, defaults, wizard-vs-accordion, live output panels, in-article interactives, and the accessibility of the specific widgets in use?

## TL;DR

| Question | Answer |
| --- | --- |
| Stepper / wizard for the 8 option groups? | **No.** The NYT's own graphics editor names steppers as the thing they stopped shipping because "readers weren't getting to all of the content" ([§6](#6-interactive-widgets-inside-an-article)) |
| Accordion per option group? | **No.** GOV.UK: "Do not use accordions to split up a series of questions" ([§4](#4-wizard-vs-long-form-vs-accordion)) |
| Full-screen panel as the default container? | **No — as an opt-in escape hatch, yes** ([§9](#9-what-this-implies-for-the-banner-prompt-builder)) |
| How many disclosure levels? | **Two, maximum.** Nielsen: beyond 2 levels "typically have low usability" ([§1](#1-progressive-disclosure)) |
| Is "39 controls" the right number to worry about? | **No — it is 18 tab stops.** Radix collapses each radio group to one ([§7](#7-accessibility-specifics)) |
| Pre-select every option? | **Yes, and it already does.** GOV.UK draws the line itself: pre-selection is fine "for settings", not "for questions" ([§3](#3-defaults-and-smart-defaults)) |
| Keep the "Recommended" badges off? | **Yes**, on redundancy grounds. No primary source exists in either direction ([§3](#3-defaults-and-smart-defaults)) |
| Two-column form + preview? | **Not at this column width.** Material 3 puts two panes at **840dp+** only; the article body tops out near 840px ([§5](#5-live-preview-and-output-panels)) |
| Any measured accessibility bug? | **Yes.** The checked-card indicator measures **2.35:1** against WCAG 1.4.11's 3:1 — and Material 3 independently says "Make sure color isn't the only way to show selection" ([§7](#7-accessibility-specifics)) |

### Fetching note — two sources are SPAs, both have a first-party escape hatch

`m3.material.io` (Angular) and `developer.apple.com/design/human-interface-guidelines` (Vue) return only a `<title>` to any normal fetch. Both quote-sets below came from the vendors' **own** same-origin content APIs, so the text is exactly what the page renders:

- **Apple:** `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json` — verified 200. (The commonly cited `/tutorials/data/documentation/...` path 404s.)
- **Material 3:** `https://m3.material.io/_dsm/content/m3/<version>/<exportedCarbonFileId>.json`. The version (`2026-08-05_09-00-19`) and the slug→file-ID route table both live in the site's own `main.*.js`; the URL template `/_dsm/content/m3/${o}/${t}` is in that bundle verbatim. Human-readable URLs are cited throughout; re-derive the IDs if this ever needs re-checking.

Also: `m3.material.io/foundations/layout/applying-layout/window-size-classes` is **404**. M3 renamed "window size classes" to "breakpoints"; the live page is `/foundations/layout/breakpoints/overview`.

---

## 0. What the code actually does today

Read before the findings, because several of them only make sense against it.

- `src/features/blog/components/banner-prompt/banner-prompt.tsx` wraps the tool in a two-tab `Tabs` — "Build it" / "Raw prompt". **That is already one disclosure level.**
- `builder.tsx` (399 lines) renders 8 `OptionField` groups — 29 cards at the default layout — plus 8 text fields and 2 buttons.
- `option-field.tsx` → `RadioGroup` / `RadioGroupCard` → `@radix-ui/react-radio-group@1.4.7`.
- `compile.ts` seeds `DEFAULT_ANSWERS` from each catalogue's own `recommended` flag. **Every single-select group is already answered.** The only things that block copy are `headline`, `accentPhrase`, and (for `platformId: "custom"`) width and height — see `collectMissing`.
- `ART_DIRECTIONS` is filtered by `artFamilyId`, so 6 of 12 directions show at a time. That is already staged disclosure, correctly done.
- The article introduces the tool under `### The prompt` — an **h3**. The builder's own section headings are also `h3`.

So the honest framing is not "39 questions". It is: **two required text fields, and eight optional refinements that are all pre-answered.** Every finding below points at the same fix.

---

## 1. Progressive disclosure

### The canonical definition, and the only number in it

[NN/g, "Progressive Disclosure", Jakob Nielsen, 2006-12-03](https://www.nngroup.com/articles/progressive-disclosure/):

> "Progressive disclosure defers advanced or rarely used features to a secondary screen, making applications easier to learn and less error-prone."

> "Initially, show users only a few of the most important options. Offer a larger set of specialized options upon request."

> "In practice, designs that go beyond 2 disclosure levels typically have low usability because users often get lost when moving between the levels."

That last sentence is the article's only hard number and it is the binding constraint here. The article also claims progressive disclosure "improves 3 of usability's 5 components: learnability, efficiency of use, and error rate" — expert synthesis, no data on the page. Its "46 web-based applications" study does not publish a participant count on the free page.

### Progressive vs staged disclosure

The same article contrasts them. Progressive disclosure shows **core** features first and users *usually do not* open the secondary level; navigation is hierarchical. Staged disclosure shows features **in task sequence** and users *do* progress through every stage; navigation is linear. A wizard is staged; a "more options" panel is progressive.

[NN/g, "10 Usability Heuristics Applied to Complex Applications", Kate Kaplan, 2021-08-15](https://www.nngroup.com/articles/usability-heuristics-complex-applications/):

> "if there are elements within the interface that are rarely used or used only by a small number of users, staged disclosure can be used to defer those elements to a secondary level"

### Apple

[Apple HIG, "Disclosure controls"](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls):

> "Use a disclosure control to hide details until they're relevant. Place controls that people are most likely to use at the top of the disclosure hierarchy so they're always visible, with more advanced functionality hidden by default. This organization helps people quickly find the most essential information without overwhelming them with too many detailed options."

> "Provide a descriptive label when using a disclosure triangle. Make sure your labels indicate what is disclosed or hidden, like 'Advanced Options.'"

> "**Use no more than one disclosure button in a single view.** Multiple disclosure buttons add complexity and can be confusing."

The HIG page never says "progressive disclosure" — only "progressively reveal". Apple's 80/20 framing is in a conference talk, not the HIG; see [§8](#8-weak-evidence-and-claims-not-to-repeat).

### GOV.UK — one thing per page

[GOV.UK Service Manual, "Structuring forms"](https://www.gov.uk/service-manual/design/form-structure):

> "Start by splitting the form across multiple pages with each page containing just one thing, for example: one piece of information you're telling a user, one decision they have to make, one question they have to answer"

The claimed benefits are that it helps people "understand what you're asking them to do", "focus on the specific question and its answer", "find their way through an unfamiliar process", "use the service on a mobile device", and "recover easily from form errors".

[GOV.UK Design System, "Question pages"](https://design-system.service.gov.uk/patterns/question-pages/) adds the escape valve:

> "Sometimes it makes sense to group a number of related questions on the same page. User research will tell you when you can group pages together."

and, counter-intuitively:

> "A number of GOV.UK services have removed this style of progress indicator without any negative effects."

**Read the scope honestly.** One-thing-per-page is a *multi-page* pattern for a government transaction with a submit button and legal consequences. Neither GDS page cites a published study. It is strong institutional consensus, not an experiment. A single-page embedded tool cannot adopt it literally, and shouldn't try — see [§4](#4-wizard-vs-long-form-vs-accordion).

### The counterweight: disclosure has a cost

Both authorities warn about it, independently. [GOV.UK Design System, "Details"](https://design-system.service.gov.uk/components/details/):

> "Do not use the details component to hide information that the majority of your users will need."

and it records that some users "avoid clicking the link to show more details" because they believe it will navigate them away from the page, plus "concerns that some users of voice assist software will not be able to interact with the component".

[GOV.UK Design System, "Accordion"](https://design-system.service.gov.uk/components/accordion/):

> "Accordions hide content from the user. Not all users will notice them or understand how they work. For this reason, you should only use them in specific situations and if user research supports it."

### Material 3 has no progressive-disclosure doctrine — verified absence, not a fetch failure

With the content API in hand ([fetching note](#fetching-note--two-sources-are-spas-both-have-a-first-party-escape-hatch)), M3 pages are quotable — and a domain-restricted search for `site:m3.material.io "progressive disclosure"` returns **no page containing the phrase**. M3 describes bottom and side sheets as carrying "secondary content", which is a related idea, not the same claim. Do not cite M3 for disclosure guidance; it is genuinely silent. It is quoted below for layout ([§5](#5-live-preview-and-output-panels)) and selection state ([§7](#7-accessibility-specifics)), where it does have positions.

---

## 2. Form length and completion

### GOV.UK: delete questions before you hide them

[Service Manual, "Structuring forms"](https://www.gov.uk/service-manual/design/form-structure) — only add a question if you know "that you need the information to deliver the service / why you need the information / what you'll do with it / which users need to give you the information / how you'll check the information is accurate / how to keep the information up to date and secure".

[Service Manual, "Collecting personal information"](https://www.gov.uk/service-manual/design/collecting-personal-information-from-users):

> "The first thing to do is remove any questions that you do not need to ask."

### NN/g: the one numeric threshold they publish

[NN/g, "Website Forms Usability: Top 10 Recommendations", Kathryn Whitenton, 2016-05-01](https://www.nngroup.com/articles/web-form-design/):

> "Eliminating unnecessary fields requires more time, but the reduced user effort and increased completion rates make it worthwhile."

> "**Limit the form to only 1 or 2 optional fields**, and clearly label them as optional."

> "Multiple columns interrupt the vertical momentum of moving down the form."

[NN/g, "Few Guesses, More Success: 4 Principles to Reduce Cognitive Load in Forms", Huei-Hsin Wang, 2025-07-18](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/):

> "Think twice before including optional questions, as each question increases the form length and the perceived effort to complete it."

The builder currently has **five** fields explicitly labelled "(optional)" — kicker, sub-line, social proof, prop, and effectively the custom art note. That is 2.5× NN/g's stated ceiling and is the cheapest single reduction available.

### Option-count ceilings, from two design systems

Neither is about form *length*, but both cap how many choices a single control may show — worth checking the catalogue against:

- [Apple HIG, "Segmented controls"](https://developer.apple.com/design/human-interface-guidelines/segmented-controls): "Limit the number of segments in a control. Too many segments can be hard to parse and time-consuming to navigate. **Aim for no more than about five to seven segments in a wide interface and no more than about five segments on iPhone.**"
- [Material 3, "Segmented buttons"](https://m3.material.io/components/segmented-buttons/guidelines): "**Don't use more than five segments in a single segmented button.** Choices should be scoped. If you have more than five choices, consider using another component, such as chips." (Note M3 also deprecates the component: "Segmented buttons are no longer recommended in the Material 3 expressive update.")

The builder's largest group is Art direction at 6, already halved from 12 by the family filter. Every other group is 2–5. **No group is over the line.** The density problem is the *number of groups*, not the size of any one.

### Baymard: real numbers, wrong domain

Every Baymard figure is **e-commerce checkout**. Their unit of analysis is a guest checkout with address and card fields. They have not studied configurators, and the numbers do not transfer — quoted here so nobody quotes them at you later.

[Baymard, "Average Number of Form Fields in Checkout Flows"](https://baymard.com/blog/checkout-flow-average-form-fields):

> "the average checkout flow in 2024 is 5.1 steps long and contains 11.3 form fields"

> "most sites need only 8 form fields in total for a checkout flow"

Methodology, from [baymard.com/research/checkout-usability](https://baymard.com/research/checkout-usability): "25 rounds of qualitative usability testing with 4,400+ test participant/site sessions" and "54 rounds of benchmarking the world's 344 leading e-commerce sites". This is the strongest quantitative material in this file.

[Baymard, cart-abandonment list](https://baymard.com/lists/cart-abandonment-rate) puts "Too long / complicated checkout process" at **17%** of abandonment reasons (excluding the 42% "just browsing" segment), against a 70.22% average abandonment rate averaged over "50 different studies".

⚠️ **Baymard's own complexity figure is inconsistent across their pages** — 17% on the two URLs above, 22% on [holistic-view-on-checkout-usability](https://baymard.com/blog/holistic-view-on-checkout-usability), 26% on [checkout-optimization-from-16-fields-to-8](https://baymard.com/blog/checkout-optimization-from-16-fields-to-8). Different survey rounds, inconsistently dated. Never cite a bare "22% abandon because checkout is too long" — cite the URL and year. Baymard also does not publish the sample size or field date of that survey on the free pages.

**None of this applies to the builder.** There is no purchase, no submit, no account, and abandonment costs the reader nothing. The relevant cost is *perceived effort before the first copy*, which is a progressive-disclosure problem, not a field-count problem.

---

## 3. Defaults and smart defaults

### NN/g: a default is an instruction

[NN/g, "The Power of Defaults", Kathryn Whitenton](https://www.nngroup.com/articles/the-power-of-defaults/):

> "By showing a representative value, they serve as just-in-time instructions to help users understand how to complete a field."

> "By showing a frequent value, they help users understand the commonly expected response, as opposed to more atypical ones."

> "It's therefore important to select helpful defaults, rather than those based on the first letter of the alphabet or whatever the first option on your original list happened to be."

And the ethics line, which is the closest any primary source gets to the "recommended marker" question:

> "if you consistently pick the most expensive option as the default, you'll lose credibility, so don't overdo it."

### Apple: prefill, and prefer picking over typing

[Apple HIG, "Entering data"](https://developer.apple.com/design/human-interface-guidelines/entering-data):

> "You can also prefill fields with reasonable default values, **which can minimize decision making and speed data entry**."

> "When possible, offer choices instead of requiring text entry. It's usually easier and more efficient to choose from lists of options than to type information, even when a keyboard is conveniently available."

> "Get information from the system whenever possible. Don't ask people to enter information that you can gather automatically"

The second quote is worth pausing on: **the builder is 8 pick-lists and 8 free-text fields, and the free-text fields are the ones actually blocking completion.** Apple's guidance runs the other way from the current pain point.

Apple's Pickers and Segmented controls pages contain **no** default-selection guidance. Only "Entering data" mentions defaults. M3 is silent across radio-button, segmented-buttons and chips — a verified absence, checked page by page.

### GOV.UK: the rule everyone quotes, and the exception on the next page

[GOV.UK Design System, "Radios"](https://design-system.service.gov.uk/components/radios/):

> "Do not pre-select radio options as this makes it more likely that users will: not realise they've missed a question, submit the wrong answer"

That is the sentence everyone cites. **GDS itself draws the scope line, one component over.** [GOV.UK Design System, "Select"](https://design-system.service.gov.uk/components/select/):

> "**If you use the component for settings, you can make an option pre-selected by default when users first see it.**"

> "If you use the component for questions, you should not pre-select any of the options in case it influences users' answers."

So GOV.UK's own distinction is **settings vs questions**, and its stated rationale everywhere is *answer integrity* — "in case it influences users' answers", "submit the wrong answer". A banner brief is a setting, not a declaration: no option is factually wrong, nothing is submitted, and the reader watches the output change live. **`DEFAULT_ANSWERS` is on the right side of GDS's own line.**

Be honest that GOV.UK is internally inconsistent here: the Radios page states the prohibition with no exception, the Select page states the exception. Anyone claiming "GOV.UK bans pre-selected radios, full stop" is quoting one page and ignoring the other.

Two things from the Radios page that **do** transfer:

1. **The no-undo trap.** "Users cannot go back to having no option selected once they have selected one, without refreshing their browser window." Irrelevant in this tool (there is no unanswered state) but it means **"Reset to defaults" must be an explicit control** — nothing else restores the recommended pick.
2. **The ordering warning.** "Order radio options alphabetically by default… In some cases, it can be helpful to order them from most-to-least common options… However you should do this with **extreme caution as it can reinforce bias in your service**." `options.ts` orders recommended-first in every array. That is a deliberate steer, and GDS says to be cautious about exactly that. In a creative tool the steer is the point — but it is a choice, not a neutral default, and it should be made knowingly.

### Baymard: the strongest empirical case against pre-selection, and why it doesn't reach here

[Baymard, "Use Buttons for Size Selection"](https://baymard.com/blog/use-buttons-for-size-selection):

> "some sites have a default preselected size for products … which enables users to add a product to the cart without reviewing and selecting the size option at all on the product page."

> "there's a risk that some won't notice this fact — completing checkout and purchasing a product that was not in their preferred size."

Baymard supplies its own scope limiter in the same piece: the mistake "is more likely for product types where users aren't necessarily aware of or thinking about sizes when they arrive on the product page". **The harm mechanism is irreversible commitment — money spent — not pre-selection itself.** Copying a text prompt is free and reversible. Cite this when someone argues pre-selection is universally harmful; it is the best evidence against, and it does not reach a free, undoable, live-previewed configurator.

### APG contemplates the unchecked alternative

[APG Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/):

> "Some implementations may initialize the set with all buttons in the unchecked state in order to force the user to check one of the buttons before moving past a certain point in the workflow."

So "all unchecked" is a legitimate pattern — for gating a workflow. There is no workflow to gate here. The same page also has a live-preview consequence worth designing for: arrow keys "move focus to the next radio button in the group, uncheck the previously focused button, and **check** the newly focused button", so a keyboard user arrowing through a group fires a recompile on every keypress.

### "Recommended" markers: the evidence is thin, and that is the finding

**No primary source in the allowed set makes any claim about marking one option "Recommended" — positive or negative.** Searches across nngroup.com for recommended badges, anchoring and decoy effects returned nothing on nngroup.com (only arXiv and NCBI, outside scope). GOV.UK has nothing. Apple and M3 have nothing. Any confident claim here is opinion wearing a citation's clothes.

The three nearest defensible fragments, all indirect:

1. NN/g: steering the default toward what benefits you "you'll lose credibility, so don't overdo it".
2. GOV.UK: reordering by frequency "can reinforce bias in your service".
3. Apple: a good default "can minimize decision making".

Together they support a weak position — *marking a recommendation is legitimate when it serves the reader's outcome and illegitimate when it serves yours* — and nothing stronger.

**Removing the badges is sound, on redundancy grounds:** the recommended pick is already the checked pick, so the badge duplicates what the checked state carries. Removing the *information* would not be. Replace it with one sentence of prose stating that every option is already picked and the prompt works untouched. That sentence does more work than eight badges.

---

## 4. Wizard vs long form vs accordion

### What each is for

**Wizard.** [NN/g, "Wizards: Definition and Design Recommendations", Raluca Budiu, 2017-06-25](https://www.nngroup.com/articles/wizards/):

> "A wizard is a step-by-step process that allows users to input information in a prescribed order and in which subsequent steps may depend on information entered in previous ones."

NN/g recommends wizards for novice or infrequent tasks and against them for repeated expert tasks or where users must compare across fields. The article specifies **no optimal step count**. There is **no NN/g article on steppers or timelines** — the wizards article is the closest thing; drop any claim that one exists.

**Accordion.** [NN/g, "Accordions Are Not Always the Answer for Complex Content on Desktops", Hoa Loranger, 2014-05-18](https://www.nngroup.com/articles/accordions-complex-content/):

> "Forcing people to click on headings one at a time to display full content can be cumbersome"

> "people will eagerly scroll the page"

[NN/g, "Accordions on Mobile", Raluca Budiu, 2015-05-31](https://www.nngroup.com/articles/mobile-accordions/) is the counterpoint — accordions "conserve space on mobile" and let users "get the big picture before focusing on details".

**GOV.UK is blunter, and directly on point.** [Accordion, "When not to use this component"](https://design-system.service.gov.uk/components/accordion/), verbatim:

> "Test your content without an accordion first."

> "It's usually better to: simplify and reduce the amount of content / split the content across multiple pages / **keep the content on a single page, separated by headings** / use a list of links at the start of the page (known as 'anchor links') to take the user to particular sections of a page"

> "**Accordions work best for simple content and links. Do not use accordions to split up a series of questions. Use separate pages instead.**"

> "Do not put accordions within accordions, as it will make content difficult to find."

That is an explicit prohibition on the accordion-per-option-group idea. And "separate pages" is unavailable — the tool must stay in the post.

**Task list.** [GOV.UK, "Complete multiple tasks"](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/) (the renamed task-list pattern):

> "Only use a complete multiple tasks page for longer transactions involving multiple tasks that users may need to complete over a number of sessions."

> "Where possible, allow users to complete tasks in any order."

Not applicable — there are no sessions and no dependencies except the family→direction filter that `selectArtFamily` already handles.

### Accessibility of each pattern

**Accordion** — [APG Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/). Required markup: the title is in an element with `role="button"`; that button is wrapped in an element with `role="heading"` and an appropriate `aria-level`; **"The button element is the only element inside the heading element"**; `aria-expanded` reflects panel visibility; `aria-controls` points at the panel. `role="region"` + `aria-labelledby` on the panel is **optional**, and APG warns to "Avoid using the region role in circumstances that create landmark region proliferation, e.g., in an accordion that contains more than approximately 6 panels".

Keyboard is only `Enter`/`Space`/`Tab`/`Shift+Tab` — **the current APG accordion pattern does not mention arrow keys at all**, neither required nor optional. The "Up/Down arrows are optional" memory comes from an older APG revision; `https://www.w3.org/TR/wai-aria-practices-1.1/` now 302s to the live APG, so that wording is not retrievable from a primary W3C URL. Treat arrow-key support as a superset, not a conformance need.

**Tabs** — [APG Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Roving tabindex (one tab stop for the tablist), `tablist`/`tab`/`tabpanel`, `aria-controls`, `aria-selected`, `aria-labelledby`. On automatic vs manual activation, verbatim:

> "It is recommended that tabs activate automatically when they receive focus as long as their associated tab panels are displayed without noticeable latency. This typically requires tab panel content to be preloaded. Otherwise, automatic activation slows focus movement, which significantly hampers users' ability to navigate efficiently across the tab list."

Decision rule: panels already in the DOM → automatic; panels that fetch or mutate route state → manual. The existing "Build it" / "Raw prompt" tabs are both prerendered, so automatic is correct.

**Stepper / wizard — there is no APG pattern.** Verified by enumerating the [full pattern index](https://www.w3.org/WAI/ARIA/apg/patterns/) (30 patterns, zero matches for `wizard`/`stepper`/`step`) plus four 404s on `…/patterns/wizard/`, `…/stepper/`, `…/steps/`, `…/progress-indicator/`. The nearest primitives:

- [`aria-current="step"`, WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#aria-current) — "Represents the current step within a process." Note the spec's own warning: "Authors SHOULD NOT use the aria-current attribute as a substitute for aria-selected in widgets where aria-selected has the same meaning." So a tablist-based stepper uses `aria-selected`, not `aria-current`.
- [W3C WAI Forms Tutorial, "Multi-page forms"](https://www.w3.org/WAI/tutorials/forms/multi-page/) — "divide long forms into multiple smaller forms that constitute a series of logical steps or stages". Progress must be exposed: put "Step 2 of 4" **first** in the `<title>` because screen readers read it first, and repeat it in the `<h1>`. It also flags that the native `<progress>` element is animated on some operating systems, which "would violate WCAG's 2.2.2 Pause, Stop, Hide success criterion".

**Verdict for this tool:** a stepper would be a hand-rolled composite with no APG pattern behind it, inside an article that has no `<title>` or `<h1>` to carry step position. That is a lot of custom ARIA for a form whose questions are already all answered.

---

## 5. Live preview and output panels

### Show the result, not the controls

[NN/g's ten heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), #1:

> "Visibility of system status: The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time."

The sharper argument is [NN/g, "R.I.P. WYSIWYG"](https://www.nngroup.com/articles/rip-wysiwyg/), which argues for a "results-oriented user interface" where users "specify the results they want, rather than focusing on the primitive operations required to reach their goals" — replacing "a plethora of commands, each of which you must locate" with galleries where you "watch it change shape as you mouse over the alternatives". That is an argument for previewing on *hover and selection*, not only after submit. It is an opinion piece, not a study.

**No NN/g article on side-by-side preview panels exists.** The preview case rests on heuristic #1 plus that essay. Do not overclaim it.

### Two panes, and the exact width where you get them

[Material 3, "Breakpoints"](https://m3.material.io/foundations/layout/breakpoints/overview) — verbatim table:

| Breakpoint | Width (dp) | Common devices |
| --- | --- | --- |
| Compact | Under 600dp | Phone in portrait |
| Medium | 600–839dp | Tablet / foldable in portrait |
| Expanded | 840–1199dp | Phone landscape, tablet landscape, desktop |
| Large | 1200–1599dp | Desktop |
| Extra-large | 1600dp+ | Desktop, ultra-wide monitors |

> "Compact and medium breakpoints: A single pane works best / Expanded and large breakpoints: Two panes are recommended / Extra-large breakpoints: Consider using three panes"

> "At medium breakpoints, two panes are useful when they contain low-density content with clear actions. **Don't use two panes in medium layouts with high information density, as it can reduce usability.**"

> "Across all breakpoints, adjust margins and type styles to keep text between **40–60 characters per line**."

[Material 3, "Canonical examples"](https://m3.material.io/foundations/layout/canonical-examples/overview) — the supporting-pane model is the exact match for a compiled-output panel:

> "Use the supporting pane layout when the **secondary content is only meaningful in relation to the primary content**. For content with a parent-child relationship, use a list-detail layout instead."

> "Primary display area: Contains the main content and occupies the majority of the window (typically about two-thirds)"

and the placement rule, verbatim per breakpoint:

> **Compact:** "The supporting pane should appear **below** the focus pane. A bottom sheet can be useful for keeping focus on the primary pane while providing access to supporting information."
> **Medium:** "The supporting pane should appear **below** the focus pane."
> **Expanded:** "The supporting pane should appear on the **leading or trailing side** of the focus pane."

M3's own placement table: below / flexible width at Compact or Medium; leading-or-trailing / **fixed 360dp** at Expanded.

Apple agrees independently. [HIG, "Split views"](https://developer.apple.com/design/human-interface-guidelines/split-views):

> "Prefer using a split view in a regular — not a compact — environment. A split view needs horizontal space in which to display multiple panes. In a compact environment … it's difficult to display multiple panes without wrapping or truncating the content, making it less legible and harder to interact with."

> "Consider letting people hide a pane when it makes sense." · "Provide multiple ways to reveal hidden panes."

(Apple's inspector guidance is on [Panels](https://developer.apple.com/design/human-interface-guidelines/panels), macOS-only — an inspector "displays the details of the currently selected item, automatically updating its contents when the item changes". There is no `/inspectors` HIG page; it 404s.)

**This is decisive for the article column.** `blog-post-view.tsx` puts the post inside `max-w-6xl` (1152px) and `DocsPage` renders a sticky clerk TOC beside it with a `gap-16` (64px). The prose column lands around **840px at its widest** — the very bottom of M3's "expanded" band, and narrower on any laptop that isn't maximised. Below that it is "medium", where M3 explicitly forbids two panes for high-density content. A form pane plus a monospace prompt pane is high-density by any reading. **Stack it.**

### Always-visible result

[GOV.UK, "Check answers"](https://design-system.service.gov.uk/patterns/check-answers/) is the closest primary pattern to "show the reader what they built":

> "Show a single check answers page immediately before the confirmation screen for small to medium-sized transactions."

GDS says such pages "increase users' confidence as they can clearly see that they have completed all the sections" and "reduce error rates as users are given a second chance to notice and correct errors before submitting data". It also requires a "'Change' link next to each section on your check answers page so that users can add or change the information". No quantified effect is published; the cited evidence is a Carer's Allowance case study, not a controlled study.

### Sticky panels

[NN/g, "Sticky Headers: 5 Ways to Make Them Better"](https://www.nngroup.com/articles/sticky-headers/):

> "**Sticky headers inherently take up space on the screen that could be used for content, so it's important that you use that space responsibly.**"

Its five recommendations are "Maximize the Content-to-Chrome Ratio by Keeping It Small", "Contrast with Content Is Important", "Keep Motion Minimal, Natural, and Responsive", "Consider Partially Persistent Headers", and "Consider Whether a Sticky Header Is Needed at All". Published numbers are tap targets "minimum of 1cm × 1 cm", text "approximately 16pt", and animation "300–400ms long".

⚠️ NN/g publishes **no viewport-percentage budget** for sticky elements. Anyone quoting one invented it.

The hard constraint a sticky panel creates is [SC 2.4.11 Focus Not Obscured (Minimum), Level AA, new in WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) — "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content." A sticky prompt panel that covers a focused card fails it.

---

## 6. Interactive widgets inside an article

### The sharpest primary source is the NYT's own graphics editor

Archie Tse, then senior graphics editor at The New York Times, "Why We Are Doing Fewer Interactives", Malofiej 2016. The slides are published by the author at [github.com/archietse/malofiej-2016](https://github.com/archietse/malofiej-2016/blob/master/tse-malofiej-2016-slides.pdf); the quotes below were extracted from that PDF's own text streams.

> "**Readers just want to scroll.**"

> "Some things we used to do more frequently > **Steppers** > Sliders … But readers weren't getting to all of the content."

> "3 rules for visual storytelling (2016 edition)
> 1. **If you make the reader click or do anything other than scroll, something spectacular has to happen.**
> 2. **If you make a tooltip or rollover, assume no one will ever see it. If content is important for readers to see, don't hide it.**
> 3. When deciding whether to make something interactive, remember that getting it to work on all platforms is expensive."

> "Fewer small graphics embedded in articles. More stand-alone visual stories."

Rule 1 is the test the full-screen panel has to pass. Rule 2 is the counterweight to every disclosure argument in [§1](#1-progressive-disclosure). And "Steppers" being named as the discontinued technique is as direct an answer to question 4 as exists anywhere in this file.

### Bret Victor — framing, not evidence

[Explorable Explanations, worrydream.com](https://worrydream.com/ExplorableExplanations/):

> "**A reactive document allows the reader to play with the author's assumptions and analyses, and see the consequences.**"

> "An active reader asks questions, considers alternatives, questions assumptions, and even questions the trustworthiness of the author."

> "**People currently think of text as information to be consumed. I want text to be used as an environment to think in.**"

[Up and Down the Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/):

> "To explore, we must be able to move freely, under our own control."

> "A designer needs direct, interactive control over the independent variables of the system."

Cite these for framing. They are a manifesto, never efficacy evidence.

### Distill — and the honest state of the evidence

[Distill, "Communicating with Interactive Articles", 2020](https://distill.pub/2020/communicating-with-interactive-articles/):

> "The New York Times provided one of the few available data points, stating that only a fraction of readers interact with non-static content, and suggested that designers should move away from interactivity."

> "This statement from The New York Times has solidified as a rule-of-thumb for designers and many choose not to utilize interactivity because of it, despite follow-up discussion that contextualizes the original point."

> "**It is also important to remember that not everything needs to be interactive.** Authors should consider the audience and context of their work when deciding if use of interactivity would be valuable. In the worst case, interactivity may be distracting to readers or the functionality may go unused."

> "**There is limited empirical evaluation of the effectiveness of interactive articles.**"

> "The act of creating a successful interactive article is closer to building a website than writing a blog post, often taking significantly more time and effort than a static article."

Distill also reports the counter-evidence: "other research found that many readers, even those on mobile devices, are interested in utilizing interactivity **when it is a core part of the article's message**." That qualifier is the useful part. In this post the builder *is* the message — the article exists to hand the reader a prompt. That is the strongest argument for keeping it inline rather than moving it to `/banner-prompt`.

Note also that even Distill, an interactive-first journal, refuses to mandate interactivity — [distill.pub/journal](https://distill.pub/journal/): "This often, **but not always**, means that articles will use interactive media." [distill.pub/guide](https://distill.pub/guide/) contains no interactivity policy at all, only a note to use D3; do not cite it for editorial guidance.

### How much of the article gets read at all

[NN/g, "How Little Do Users Read?", Jakob Nielsen](https://www.nngroup.com/articles/how-little-do-users-read/) — 45,237 page views analysed:

> "**On the average Web page, users have time to read at most 28% of the words during an average visit; 20% is more likely.**"

> "Users read half the information only on those pages with 111 words or less."

> "The average page view contained 593 words."

This is the best number in the file, and it sets the ceiling on everything else: the static article has to stand alone. [F-shaped pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) is often cited alongside it but publishes **no aggregate percentages** — only per-heatmap participant counts (45, 47). Use the 20–28% figure, not that page.

⚠️ **"X% of readers never interact with embedded widgets" does not exist.** Both Tse and Distill assert the direction without a number. Do not invent one.

---

## 7. Accessibility specifics

### Radio-group cards

[APG Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/). Keyboard, verbatim:

> "**Tab and Shift + Tab**: Move focus into and out of the radio group. When focus moves into a radio group: If a radio button is checked, focus is set on the checked button. If none of the radio buttons are checked, focus is set on the first radio button in the group."

> "**Right Arrow and Down Arrow**: move focus to the next radio button in the group, uncheck the previously focused button, and check the newly focused button."

So **the whole group is one tab stop and arrows both move and select.** The current build satisfies this: `@radix-ui/react-radio-group@1.4.7` renders `role="radiogroup"` on the root and `<button type="button" role="radio">` per item with roving tabindex (verified in `node_modules/@radix-ui/react-radio-group/dist/index.mjs:91-92,285`), and `option-field.tsx` passes `aria-labelledby={headingId}`, satisfying APG's "The radiogroup element has a visible label referenced by aria-labelledby".

**This means the tool is 18 tab stops, not 39 controls** — 8 groups + 8 text fields + 2 buttons. The perceived-density problem is visual, not navigational, and the fix should be too.

One caveat worth knowing: [Using ARIA, Rule 1](https://www.w3.org/TR/using-aria/#rule1) — "If you can use a native HTML element or attribute with the semantics and behavior you require already built in … then do so." Radix takes the `role="radio"` route, which the rule discourages, but it also ships the roving tabindex and arrow handling APG requires, so it is not "bad ARIA". Not worth rewriting. If a rewrite ever happens, a visually-hidden `<input type="radio">` plus a styled `<label>` gets the same cards with zero JavaScript — the visual-design exception in Rule 1 does not apply, because card styling genuinely is achievable with the native element.

A second caveat: `RadioGroup` renders a 2- or 3-column CSS grid, but roving focus follows **DOM order**, so `Down` moves to the visual right neighbour. APG does not require 2D navigation for `radiogroup`, so this conforms — it is just mildly surprising with `columns={3}`.

### The measured failure: the checked state

[SC 1.4.11 Non-text Contrast, Level AA](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html):

> "any visual information necessary to indicate state, such as whether a component is selected or focused must also ensure that the information used to identify the control in that state has a minimum 3:1 contrast ratio."

with the exemption that saves you from the impossible version:

> "This success criterion does not require that changes in color that differentiate between states of an individual component meet the 3:1 contrast ratio when they **do not appear next to each other**."

`radioGroupCardStyles` signals "checked" with `data-[state=checked]:border-outline-brand data-[state=checked]:bg-bg-accent` — border colour plus a background tint, and nothing else. Computed from the tokens in `src/styles/globals.css`:

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `outline-brand` vs `bg-default-alt` (light, card fill) | **2.56:1** | fails 3:1 |
| `outline-brand` vs `bg-accent` (light, checked fill) | **2.35:1** | fails 3:1 |
| `outline-brand` vs `bg-default` (light, page behind) | **2.14:1** | fails 3:1 |
| `outline-brand` vs `bg-default-alt` (dark) | 3.45:1 | passes |
| `outline-brand` vs `bg-accent` (dark) | **2.90:1** | fails 3:1 |
| `bg-accent` vs `bg-default-alt` (checked vs unchecked fill) | 1.09:1 light / 1.19:1 dark | exempt — states are not adjacent |

The last row is genuinely fine under the exemption. The border rows are not: that border **is** the state indicator, and it sits directly against both fills.

Material 3 says the same thing about its own single-select control, independently — [Segmented buttons](https://m3.material.io/components/segmented-buttons/guidelines):

> "Segmented buttons are clusters of similar components, so **the outline should have at least a 3:1 contrast ratio with the background or surface**. This helps distinguish each button."

> "**Both a checkmark icon and a color change are used to distinguish selection. Make sure color isn't the only way to show selection.**"

Two independent fixes, both needed:

1. **Add a non-colour cue** — a check glyph on the checked card, exactly as M3 prescribes. [SC 1.4.1 Use of Color, Level A](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html): "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element." A border-colour-only checked state is exactly that.
2. **Raise the indicator's contrast to ≥3:1** against `bg-default-alt` *and* `bg-accent`. A darker checked-border token, or a thicker inset ring in a token that already clears 3:1.

APG also requires the two states to be distinguishable from each other: [keyboard-interface practice](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) — "The visual focus indicator must always be visible" and "**The selected state must be visually distinct from the focus indicator.**" Today both are `outline-brand`, and the focus ring measures 2.14:1 against the page background.

If the focus ring is tuned further, note that [SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — the "2 CSS pixel thick perimeter" and "3:1 between focused and unfocused states" rules — is **Level AAA**, not AA, and its Note 1 says the measured area "does not include shadow and glow effects outside the component's content, background, or border". Tailwind's `ring-*` is a box-shadow, so it would not count toward that AAA area. At AA the obligations are 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured, and 1.4.11 for contrast.

### Colour-swatch pickers

**W3C publishes no technique specific to swatch pickers.** Grepping [Understanding 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) for "swatch" or "color picker" returns nothing, and [G175](https://www.w3.org/WAI/WCAG22/Techniques/general/G175.html) is about user-configurable page colours, not a product swatch list. What genuinely applies:

- [G14](https://www.w3.org/WAI/WCAG22/Techniques/general/G14) — "ensure that when color differences are used to convey information … the information conveyed by the color differences are also conveyed explicitly in text." The palette cards already carry `code` + `label` (e.g. "P1 · Ink & Ivory"), so this passes. The four bare `<span>` swatches add information but are not the sole carrier.
- [SC 3.3.2 Labels or Instructions, Level A](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) — "In the case of radio buttons, checkboxes, comboboxes, or similar controls that provide users with options, each option must have an appropriate label so that users know what they are actually selecting." Passes for the same reason.
- The 1.4.11 **Boundaries** rule is the one that bites: "Having a visual boundary indicating the hit area is only required when there is no other visual way to identify the presence of the control." The palette swatches carry `border border-outline-default`, which is what stops the near-white `field` swatch disappearing. Keep it — but `outline-default` vs `bg-default-alt` measures **2.03:1** light / **1.44:1** dark, so that near-white swatch is effectively invisible today.

⚠️ The swatch **fill colour itself** is almost certainly exempt under 1.4.11's Essential exception — forcing a pale palette colour to 3:1 would destroy the information it conveys, exactly like the "color gradients that represent a measurement, such as heat maps" example W3C does name. But W3C never names swatches. That inference is defensible, not settled.

### Full-screen dialog

[APG Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) against `src/components/animations/expandable-screen.tsx`:

| APG requirement | Status |
| --- | --- |
| `role="dialog"`, `aria-modal="true"` | ✅ present |
| "Windows under a modal dialog are inert" | ✅ sets the native `inert` attribute on every sibling of the overlay |
| `Escape`: "Closes the dialog." | ✅ `keydown` listener on `document` |
| "focus moves to an element inside the dialog" | ✅ focuses the `tabIndex={-1}` overlay on open |
| "focus returns to the element that invoked the dialog" | ✅ via `restoreFocusRef` on trigger remount |
| "a visible element with role button that closes the dialog" | ✅ `showCloseButton` |
| `aria-labelledby` to a visible title **or** `aria-label` | ⚠️ `dialogLabel` is **optional** — omit it and the dialog has no accessible name |
| "Visual styling obscures the content outside of it" | ⚠️ `fixed inset-3` with no scrim; the page shows through a 12px gutter |

APG is explicit about why that last row matters:

> "Because marking a dialog modal by setting aria-modal to true can prevent users of some assistive technologies from perceiving content outside the dialog, users of those technologies will experience severe negative ramifications if a dialog is marked modal but does not behave as a modal for other users. So, mark a dialog modal only when **both**: Application code prevents all users from interacting in any way with content outside of it. **Visual styling obscures the content outside of it.**"

APG never prescribes the HTML `inert` attribute — it mandates `aria-modal` and uses "inert" descriptively. Using `inert` is a correct implementation technique for the first clause, not a conformance requirement.

**One structural landmine.** `ExpandableScreenTrigger` renders `{!isExpanded && children}` inside `AnimatePresence`, so **the trigger's subtree unmounts on expand.** If the builder is placed inside the trigger, every answer is destroyed the moment the reader goes full-screen. Any full-screen route must hoist `answers` above `<ExpandableScreen>` and pass it down, or move it into a store.

### Reduced motion

[CSS Media Queries Level 5, §12.1](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion):

> "The prefers-reduced-motion media feature is used to detect if the user has requested the system minimize the amount of non-essential motion it uses."

> "**reduce** — Indicates that user has notified the system that they prefer an interface that **removes or replaces** the types of motion-based animation"

[SC 2.3.3 Animation from Interactions, Level AAA](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) names honouring the OS preference as an accepted solution: "Take advantage of the reduce motion feature in the user agent or operating system." Note the level split — interaction-triggered motion is **AAA** (2.3.3); page-initiated motion is **Level A** ([2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)), which applies to "any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content".

`expandable-screen.tsx` already calls `useReducedMotion()` and collapses every transition to `{ duration: 0 }`. Nothing to fix. The spec's "removes **or replaces**" wording means a cross-fade would also be conformant if a hard cut ever reads as broken.

### Heading levels

The article introduces the tool with `### The prompt` (h3), and `builder.tsx` / `option-field.tsx` emit their own section headings as `<h3>`. That makes "Platform", "Layout", "Copy", "Your prompt" **siblings** of the article section rather than children of it. [SC 1.3.1 Info and Relationships, Level A](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) requires that "Information, structure, and relationships conveyed through presentation can be programmatically determined". These should be `h4`. Make the level a prop rather than hardcoding it, since the Burmese post could introduce the tool at a different depth.

---

## Inspiration URLs

Each URL was fetched and confirmed to return real content on 2026-08-11. "Embedded" means the tool lives inside a docs page or article — the constraint that matters here.

| URL | Form | What to steal |
| --- | --- | --- |
| [ciechanow.ski/gears](https://ciechanow.ski/gears/) | **Embedded** | Canvas first, controls under it: 1–2 labelled sliders per widget, never a control panel — the gold standard for "widget inside prose" |
| [joshwcomeau.com/css/interactive-guide-to-flexbox](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/) | **Embedded** | Each demo exposes only the ONE property that section teaches; the reader never meets a control the adjacent paragraph hasn't explained |
| [react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react) | **Embedded** | The same example re-shown at each step with only the new lines changed — progressive disclosure by repetition instead of one big playground at the end |
| [distill.pub/2016/misread-tsne](https://distill.pub/2016/misread-tsne/) | **Embedded** | Repeat one widget many times with different *frozen* presets side by side so the comparison is pre-done; leave exactly one knob live |
| [MDN `box-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow) | **Embedded** | Preset chips above an editable code pane: clicking a preset rewrites the code and editing still works — presets are shortcuts *into* the editor, not a separate mode |
| [open-props.style](https://open-props.style/) | **Embedded** | Sliders sit directly above the swatch strip that *is* the output — tool and reference table are one element, so there is no "apply" step |
| [tailwindcss.com/docs/colors](https://tailwindcss.com/docs/colors) | **Embedded** | Click-to-copy on the swatch itself, shift-click for the other format — a modifier key replaces a format dropdown entirely |
| [radix-ui.com/colors](https://www.radix-ui.com/colors) | **Embedded** | 12 steps with fixed *semantic* meanings (9 = solid, 11 = text) — users pick by role, not by eyeballing lightness |
| [pudding.cool](https://pudding.cool/) | **Embedded** | Scrollytelling: the graphic is sticky and the prose scrolls past it, so the reader gets the interaction without deciding to interact |
| [motion.dev/docs/react-animation](https://motion.dev/docs/react-animation) | **Embedded** | Anti-pattern. Code is inline but the live example is behind an "Open" button to another domain — the reader loses the article the second they click |
| [joshwcomeau.com/shadow-palette](https://www.joshwcomeau.com/shadow-palette/) | Full-page | Five *human-named* abstract sliders ("Oomph", "Crispy") drive three always-visible previews; the raw CSS appears only in a copy block underneath |
| [realtimecolors.com](https://www.realtimecolors.com/) | Full-page | The preview *is* the page background — a full fake landing page sits behind the control rail, so the result is never hidden by the controls |
| [radix-ui.com/themes/playground](https://www.radix-ui.com/themes/playground) | Full-page | All global controls in one sticky top bar with a single "Copy Theme" button; everything below is a gallery that re-renders |
| [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme) | Full-page | Left rail tabbed into Colors / Typography / Other so 40+ tokens never show at once, with a preset dropdown at the top that loads a whole theme first |
| [ui.shadcn.com/create](https://ui.shadcn.com/create) | Full-page | Preset-first entry: you land on a named theme and then tweak, never on an empty state. (`/themes` now 308s here.) |
| [uicolors.app/generate](https://uicolors.app/generate) | Full-page | Spacebar re-rolls the whole palette — a keyboard shortcut turns a blank-page problem into a slot machine |
| [typescale.com](https://typescale.com/) | Full-page | The ratio is a *named* dropdown ("1.618 – Golden Ratio"), not a number field, and the preview is a realistic article mock |
| [utopia.fyi/type/calculator](https://utopia.fyi/type/calculator/) | Full-page | Output splits into Table / Graph / Visualiser, with CSS generation as a *separate* section — three views of one result |
| [cubic-bezier.com](https://cubic-bezier.com/) | Full-page | Comparison-first: click a library curve to overlay it on yours, and the URL encodes the curve so the permalink is the share format |
| [og-playground.vercel.app](https://og-playground.vercel.app/) | Full-page | Near-zero chrome — title plus three links; the entire remaining viewport is editor + preview |
| [replicate.com/black-forest-labs/flux-schnell](https://replicate.com/black-forest-labs/flux-schnell) | Full-page | Playground / API / Examples are tabs on one URL — form and copy-pasteable code are two views of the same state |
| [fal.ai/models/fal-ai/flux/schnell](https://fal.ai/models/fal-ai/flux/schnell) | Full-page | Prompt textarea promoted; everything else folded into one "Additional Settings" disclosure — **one** disclosure, not eight |
| [huggingface.co/spaces/black-forest-labs/FLUX.1-schnell](https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell) | Full-page (Gradio) | The canonical shape: inputs left / output right, "Advanced Settings" collapsed by default, and an Examples row that fills the *whole* form in one click |
| [models.porsche.com/en-US/model-start](https://models.porsche.com/en-US/model-start) | Full-page | A gate *before* the configurator: model cards with fixed angles and three spec chips, plus explicit "resume" and "compare" entry points |
| [nike.com/nike-by-you](https://www.nike.com/nike-by-you) | Full-page | Entry is a gallery of finished designs, not a blank shoe — the reader picks a starting point that already looks good |

**Dropped — did not resolve or served no usable content:** `platform.openai.com/playground` (403), `aistudio.google.com` (302 to sign-in), `tesla.com/model3/design` (403), `apple.com/shop/studio/apple-watch` (301 to `/watch/`; Studio has moved), `midjourney.com`, `leonardo.ai`, `ideogram.ai`, `freepik.com/ai/image-generator` (all 403), `canva.com` AI generator (unsupported-browser gate), `console.anthropic.com` (301 to `platform.claude.com`; workbench is login-walled), `krea.ai` and `recraft.ai` (login-walled — marketing pages resolve but reveal no mechanics), `wattenberger.com/blog/css-cascade` (404).

**The pattern across the top three rows:** one section, one knob, demo above the fold of that section. `motion.dev` is the counter-example — outsourcing the demo breaks the article.

---

## 8. Weak evidence and claims not to repeat

Traced and rejected. Included so nobody re-imports them.

- **"Reducing fields from 11 to 4 increased conversions 120%."** Traced to a 2008 PDF published by **Imaginary Landscape, LLC**, the Chicago agency that did the redesign (`imagescape.com/media/filer_public/.../form_case_study.pdf`; the file's own metadata reads "© 2008 Imaginary Landscape, LLC" and benchmarks "the 11-question form in place during 2007"). One client site, sequential before/after over two months, no control, no significance test, and it reached ubiquity through an **Unbounce** marketing infographic. Secondary sources quote it as both 120% **and** 160%. Do not use it.
- **"Expedia removed one field and made $12 million."** No primary source exists. It originates as a conference anecdote from an Expedia analytics VP around 2010; every written version is secondary. Expedia has never published it.
- **"Nielsen's 80/20 rule for progressive disclosure."** Not in the NN/g article — checked twice, explicitly. The 80/20 framing is **Apple's**, from [WWDC17 session 802, "Essential Design Principles"](https://developer.apple.com/videos/play/wwdc2017/802/), where Apple itself hedges it: "**Now, the exact percentages are, of course, different.** But the basic point is valid." If you use it, attribute it to the talk and call it a heuristic.
- **"X% of readers never interact with embedded widgets."** Both Distill and Tse assert the direction without a number ([§6](#6-interactive-widgets-inside-an-article)).
- **"Sticky panels improve completion."** NN/g has a sticky-headers article but publishes no completion effect and no viewport-percentage budget ([§5](#5-live-preview-and-output-panels)).
- **"Recommended badges help/hurt."** No primary source in either direction ([§3](#3-defaults-and-smart-defaults)).
- **"GOV.UK bans pre-selected options."** Half-true and routinely mis-scoped — the Select component page permits it "for settings" ([§3](#3-defaults-and-smart-defaults)).
- **NN/g, "even the slightest moment of hesitation when completing a form can significantly hurt the form's response rate"** ([form-design-white-space](https://www.nngroup.com/articles/form-design-white-space/)) — real quote, but "from our research studies" with no study named and no numbers. Weakest NN/g claim in this file; use with care.

---

## 9. What this implies for the banner prompt builder

Opinionated, and tied to the sections above.

### The container: none of the three options as stated

**Not a stepper.** Tse names steppers, by that word, as the technique the NYT stopped shipping because "readers weren't getting to all of the content" ([§6](#6-interactive-widgets-inside-an-article)). There is also no APG stepper pattern, no `<title>`/`<h1>` in an article to carry "Step 2 of 8", and GDS reports services removing progress indicators "without any negative effects" ([§1](#1-progressive-disclosure)). A stepper would be the most custom ARIA, the most code, and the pattern with the most evidence against it.

**Not an accordion per option group.** GOV.UK: "Do not use accordions to split up a series of questions." Eight accordions inside a tab panel would also breach Apple's "Use no more than one disclosure button in a single view" and Nielsen's two-level ceiling — the `Tabs` wrapper is already level one.

**Not the full-screen panel as the default container.** Tse rule 1: "If you make the reader click or do anything other than scroll, something spectacular has to happen." Opening a modal to reveal a form is not spectacular. Apple's [modality](https://developer.apple.com/design/human-interface-guidelines/modality) guidance: "**Aim to keep modal tasks simple, short, and streamlined.** If a modal task is too complicated, people can lose track of the task they suspended", and NN/g's [modal article](https://www.nngroup.com/articles/modal-nonmodal-dialog/) says modals "can cover important content and remove context". And the trigger's subtree unmounts on expand ([§7](#7-accessibility-specifics)), so the naive wiring loses every answer.

**Do this instead: one level of progressive disclosure, inline.** The tool's real shape is *two required text fields with a live output, plus eight pre-answered refinements.* Make the markup say that.

### The default collapsed state in the article

What the reader should see before touching anything, top to bottom:

1. One line of prose: **every option is already chosen; fill in two fields and copy.** This replaces the removed "Recommended" badges and does more work than they did ([§3](#3-defaults-and-smart-defaults)).
2. **Headline** (with the existing word counter) and **Accent phrase**. These are the only two things `collectMissing` actually blocks on.
3. **The compiled prompt panel, already populated and already copyable** — the recommended defaults compile to a valid brief with zero clicks. GDS's check-answers rationale applies directly: seeing the whole result "increase[s] users' confidence as they can clearly see that they have completed all the sections" ([§5](#5-live-preview-and-output-panels)).
4. **One disclosure**, closed: *"Change the look — 8 choices, all pre-picked"*. Apple: label it with what is hidden, and use no more than one per view.

Everything else — Platform, Layout, Palette, Art family, Art direction, Effect, Field finish, Typography, and the five optional text fields — lives behind that single control. Total disclosure depth including the existing tabs: **two**. At Nielsen's ceiling, not past it.

Inside the disclosure, keep it a **single scrolling column with headings**, which is GDS's own first alternative to an accordion: "keep the content on a single page, separated by headings". Order by impact — Platform, Layout, Palette (each changes everything downstream), then Art family → Art direction (the existing filter is already correct staged disclosure), then Effect, Field finish, Typography. No nested collapsing.

Then cut the optional fields. NN/g's ceiling is "only 1 or 2 optional fields"; there are currently five. Kicker, sub-line and social proof are the obvious candidates — either drop them or put them behind their own single "Add more copy" control *inside* the disclosure, which does not add a level because the reader is already there.

### Where the full-screen panel earns its place

Keep it — as a **secondary, opt-in** affordance, not the container. One small "Open full screen" control beside the prompt panel, for the reader who has decided to fiddle. That is what Apple prescribes when a task outgrows an inline surface ([Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)): "For complex or prolonged user flows, consider alternatives to sheets … you might want to open a new window or let people enter full-screen mode instead." It also earns Tse's rule 1 — the click buys a genuinely roomier surface — and it is the only place this tool ever gets a two-pane form-and-preview layout, since the article column cannot clear 840dp ([§5](#5-live-preview-and-output-panels)).

Three things to fix in `expandable-screen.tsx` before using it here:

1. **Hoist the state.** `answers` and `setAnswers` must live above `<ExpandableScreen>`; the trigger's children unmount on expand.
2. **Always pass `dialogLabel`.** APG requires `aria-label` or `aria-labelledby`; today it is optional and silently omissible.
3. **Add a scrim.** APG marks a dialog modal only when "Visual styling obscures the content outside of it" — `fixed inset-3` leaves a 12px window onto the page.

### Layout, at every width

Stack the form above the prompt. Do **not** build side-by-side panes in the article: the prose column tops out near 840px — the bottom edge of Material 3's "expanded" band and inside "medium" on most laptops, where M3 explicitly says "Don't use two panes in medium layouts with high information density". Apple concurs: "A split view needs horizontal space." Two-pane belongs only in the full-screen panel, where M3's 360dp fixed supporting pane is a good starting width.

If the prompt panel must stay reachable while the reader scrolls the options, prefer a compact sticky action bar (copy + download + a one-line status) over stickying the whole `<pre>` — NN/g: "Sticky headers inherently take up space on the screen that could be used for content" — and check [SC 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), because a sticky panel that covers a focused card fails at Level AA.

### Accessibility work, in priority order

1. **Fix the checked-card indicator** — measured **2.35:1** against WCAG 1.4.11's 3:1 in light mode and **2.90:1** in dark. Add a check glyph (1.4.1 Level A; M3 prescribes the same) *and* raise the border contrast. This is a real, measured conformance failure, not a nitpick.
2. **Make the focus ring distinct from the checked ring.** APG: "The selected state must be visually distinct from the focus indicator." Both are `outline-brand` today, and the ring measures 2.14:1 against the page background.
3. **Demote the headings to `h4`** (or make the level a prop). The article opens the section at `###`.
4. **`dialogLabel` becomes required** if the full-screen panel is adopted.
5. Leave the Radix radio groups alone — they already meet the APG pattern, and each group is one tab stop.

### What not to change

- `DEFAULT_ANSWERS` seeded from `recommended`. GOV.UK's own settings-vs-questions line puts a creative configurator on the pre-select side ([§3](#3-defaults-and-smart-defaults)), Apple endorses prefilling to "minimize decision making", and Baymard's counter-case turns on irreversible spend, which does not exist here. Do add an explicit **Reset to defaults** control, because a Radix radio group cannot return to "unanswered".
- The recommended-first ordering in `options.ts` — but know it is a deliberate steer, not a neutral order, and GDS warns that frequency ordering "can reinforce bias".
- The art-family → art-direction filter. Textbook staged disclosure, and it keeps the largest group at 6, under both Apple's and M3's option ceilings ([§2](#2-form-length-and-completion)).
- The `useReducedMotion()` handling in `expandable-screen.tsx`.
- The "Build it" / "Raw prompt" tabs — automatic activation is correct because both panels are prerendered ([§4](#4-wizard-vs-long-form-vs-accordion)).

### The honest caveat on all of it

Distill, an interactive-first journal, states that "There is limited empirical evaluation of the effectiveness of interactive articles" and that interactivity "may go unused". NN/g measures that readers get through "at most 28% of the words … 20% is more likely". The defensible position is that **the article must stand alone and the builder is an amplifier, not the carrier.** Every recommendation above is consistent with that: the tool should be copyable in one glance and one paste, and everything else is optional.

---

## Unverified

- **`m3.material.io` and `developer.apple.com/design/...` cannot be fetched normally.** Both are SPAs; all quotes came from their own same-origin content APIs (see the [fetching note](#fetching-note--two-sources-are-spas-both-have-a-first-party-escape-hatch)). The M3 content version is pinned at `2026-08-05_09-00-19`; re-derive it from `main.*.js` if these quotes ever need re-checking.
- **M3 has no default-selection guidance** across radio-button, segmented-buttons and chips, and **no page containing "progressive disclosure"**. Both are verified absences, not fetch failures — but absence proofs are only as good as the pages checked.
- **Apple HIG `/inspectors` does not exist** (404). Inspector guidance is on `/panels`, macOS-only.
- **APG's historical "Down Arrow (Optional)" accordion wording.** `w3.org/TR/wai-aria-practices-1.1/` now 302s to the live APG, so the older text is not retrievable from a primary W3C URL.
- **Whether the swatch fill colour is exempt under 1.4.11's Essential exception.** W3C never names swatches; the heat-map analogy is an inference ([§7](#7-accessibility-specifics)).
- **GDS's supporting blog evidence** for check-answers and for removing progress indicators. Both live on `blog.gov.uk` and were not fetched; the claims rest on the Design System pages' own assertions.
- **NN/g participant counts.** The "46 web-based applications" study is behind a paid report. The click-through figures in "The Power of Defaults" were read as extracted values, not verbatim sentences.
- **The contrast numbers in [§7](#7-accessibility-specifics)** were computed from the OKLCH tokens in `src/styles/globals.css` via a linear-sRGB conversion, not measured in a browser with the real composited colours. The failures are large enough that rendering will not rescue them, but re-check with a browser picker before quoting exact ratios in a PR.

## Sources

- **NN/g** — [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) · [Heuristics Applied to Complex Applications](https://www.nngroup.com/articles/usability-heuristics-complex-applications/) · [8 Design Guidelines for Complex Applications](https://www.nngroup.com/articles/complex-application-design/) · [Wizards](https://www.nngroup.com/articles/wizards/) · [Accordions Are Not Always the Answer](https://www.nngroup.com/articles/accordions-complex-content/) · [Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/) · [Website Forms Usability](https://www.nngroup.com/articles/web-form-design/) · [4 Principles to Reduce Cognitive Load in Forms](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/) · [The Power of Defaults](https://www.nngroup.com/articles/the-power-of-defaults/) · [Marking Required Fields](https://www.nngroup.com/articles/required-fields/) · [Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/) · [Bottom Sheets](https://www.nngroup.com/articles/bottom-sheet/) · [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) · [R.I.P. WYSIWYG](https://www.nngroup.com/articles/rip-wysiwyg/) · [Sticky Headers](https://www.nngroup.com/articles/sticky-headers/) · [How Little Do Users Read?](https://www.nngroup.com/articles/how-little-do-users-read/) · [F-Shaped Pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- **GOV.UK** — [Structuring forms](https://www.gov.uk/service-manual/design/form-structure) · [Collecting personal information](https://www.gov.uk/service-manual/design/collecting-personal-information-from-users) · [Designing good questions](https://www.gov.uk/service-manual/design/designing-good-questions) · [Question pages](https://design-system.service.gov.uk/patterns/question-pages/) · [Check answers](https://design-system.service.gov.uk/patterns/check-answers/) · [Complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/) · [Accordion](https://design-system.service.gov.uk/components/accordion/) · [Details](https://design-system.service.gov.uk/components/details/) · [Radios](https://design-system.service.gov.uk/components/radios/) · [Select](https://design-system.service.gov.uk/components/select/)
- **Apple** — [Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls) · [Entering data](https://developer.apple.com/design/human-interface-guidelines/entering-data) · [Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) · [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) · [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) · [Split views](https://developer.apple.com/design/human-interface-guidelines/split-views) · [Panels](https://developer.apple.com/design/human-interface-guidelines/panels) · [WWDC17 802, Essential Design Principles](https://developer.apple.com/videos/play/wwdc2017/802/)
- **Material Design 3** — [Breakpoints](https://m3.material.io/foundations/layout/breakpoints/overview) · [Canonical examples](https://m3.material.io/foundations/layout/canonical-examples/overview) · [Segmented buttons](https://m3.material.io/components/segmented-buttons/guidelines) · [Radio button](https://m3.material.io/components/radio-button/guidelines)
- **Google (Android, server-rendered corroboration)** — [Window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/window-size-classes) · [Canonical layouts](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts)
- **W3C / WAI** — APG: [Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) · [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) · [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) · [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) · [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) · [Pattern index](https://www.w3.org/WAI/ARIA/apg/patterns/) · [Keyboard interface practice](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) · [Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/). Specs: [WAI-ARIA 1.2 `aria-current`](https://www.w3.org/TR/wai-aria-1.2/#aria-current) · [Using ARIA, Rule 1](https://www.w3.org/TR/using-aria/#rule1) · [Media Queries L5 `prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/#new-features-in-wcag-2-2). Understanding: [1.3.1](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) · [1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) · [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) · [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) · [1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) · [2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) · [2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) · [2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) · [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) · [2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) · [3.3.2](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html). Techniques: [G14](https://www.w3.org/WAI/WCAG22/Techniques/general/G14) · [G111](https://www.w3.org/WAI/WCAG22/Techniques/general/G111). Tutorials: [Multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/) · [Grouping controls](https://www.w3.org/WAI/tutorials/forms/grouping/)
- **Baymard** — [Average form fields in checkout](https://baymard.com/blog/checkout-flow-average-form-fields) · [Checkout usability research](https://baymard.com/research/checkout-usability) · [Cart abandonment rate](https://baymard.com/lists/cart-abandonment-rate) · [Holistic view on checkout usability](https://baymard.com/blog/holistic-view-on-checkout-usability) · [Use buttons for size selection](https://baymard.com/blog/use-buttons-for-size-selection)
- **In-article interactives** — [Archie Tse, "Why We Are Doing Fewer Interactives", Malofiej 2016 (author's own slides)](https://github.com/archietse/malofiej-2016/blob/master/tse-malofiej-2016-slides.pdf) · [Distill, Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) · [Distill journal standards](https://distill.pub/journal/) · [Bret Victor, Explorable Explanations](https://worrydream.com/ExplorableExplanations/) · [Bret Victor, Up and Down the Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/)
- **Code read** — `src/features/blog/components/banner-prompt/{banner-prompt,builder,option-field}.tsx` · `src/features/blog/lib/banner-prompt/{compile,options}.ts` · `src/components/ui/radio-group.tsx` · `src/components/animations/expandable-screen.tsx` · `src/features/blog/components/blog-post-view.tsx` · `src/styles/globals.css` · `node_modules/@radix-ui/react-radio-group/dist/index.mjs`
