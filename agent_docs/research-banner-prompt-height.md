# Research: Banner prompt builder height

Research notes for the height of the interactive builder in
`src/features/blog/components/banner-prompt/`. Sources were checked on
**2026-08-25**. This extends `research-prompt-builder-ux.md`; it does not replace
that file's broader research.

## Question

Should the builder:

1. grow and shrink to match each step,
2. reserve a fixed height large enough for its largest step, or
3. use a hybrid?

Before this change, the implementation chose option 2. `banner-prompt.tsx` gave
both tabs `height: min(43.75rem, 70dvh)`, while `step-flow.tsx` made the control
panel an independently scrolling flex child. The preview and step navigation
stayed in a stable place, but a short step could leave a large quiet area and a
long step could require nested scrolling.

## Recommendation

Use a **content-height shell with a modest minimum height**, not a height sized to
the largest step.

- Keep the preview height and the step header/navigation position stable. Those
  are the reader's frame of reference.
- Give the control area a `min-height` based on a normal short step, then allow
  it to grow with the active step.
- Apply a viewport-relative `max-height` and internal scrolling only when a step
  truly cannot fit reasonably on screen. Prefer document scrolling at narrow
  widths and zoomed layouts.
- Do not continuously animate the outer height. An immediate resize following a
  deliberate Previous/Next action is predictable; if a short transition is
  retained, remove it under `prefers-reduced-motion`.
- Keep controls that belong together close together. Do not push Next, help, or
  validation to the bottom merely to occupy reserved space.

In short: **stabilize the important anchors, not every outer edge**. This keeps
the interaction calm without paying for the largest step on every smaller one.

## Why this is the better tradeoff

### 1. A user-requested resize is not the same as an unexpected layout shift

Google's CLS guidance distinguishes unexpected movement from movement caused by
an explicit user action. Shifts caused by clicking, tapping, or typing are
generally acceptable when they happen close enough to the action for the
relationship to be clear. It also says gradual movement can clarify a state
change, although abrupt unexpected movement is harmful
([web.dev, “Cumulative Layout Shift”](https://web.dev/articles/cls#expected-versus-unexpected-layout-shifts)).

That distinction matters here. A height change immediately after Previous or
Next is expected and local; a panel changing height later because data arrived
would not be. The fixed-largest-state solution treats both as the same problem
and reserves space even where no surprise exists.

Google also suggests `min-height` as a compromise when content sizes vary: start
with the smallest expected size and allow the parent to grow, reducing the shift
compared with starting from zero
([web.dev, “Optimize Cumulative Layout Shift”](https://web.dev/articles/optimize-cls#reserve-space-for-late-loading-content)).
That advice concerns late-loaded content rather than a stepper, so applying it
here is an inference, but the mechanism is the same: reserve a useful baseline,
not the maximum possible box.

### 2. Fixed height introduces a second scroll surface

Baymard's large-scale testing found that independently scrolling regions inside
a page add mental overhead and cause five recurring interaction problems,
including loss of overview, scroll hijacking, and hidden content. Its
recommendation is to use inline scrolling sparingly and prefer approaches such
as progressive disclosure or sub-categorization
([Baymard, “Avoid Inline Scroll Areas”](https://baymard.com/blog/inline-scroll-areas)).

The builder is a control surface, so its nested scroll is more defensible than
the raw-prompt document discussed in `research-prompt-builder-ux.md`. It is still
a cost, however. A height that follows the step removes that cost for most steps
and confines it to the exceptional step that genuinely needs a viewport.

### 3. Empty space is useful only when it communicates grouping or emphasis

NN/g describes whitespace as a grouping tool: less space unites related
elements, while more space separates them. It also warns that far-away controls
can appear unrelated and be overlooked
([NN/g, “Proximity Principle in Visual Design”](https://www.nngroup.com/articles/gestalt-proximity/)).
NN/g's visual-hierarchy guidance similarly says intentional spacing can direct
attention, but spacing should express the importance and grouping of the
content
([NN/g, “Visual Hierarchy in UX”](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)).

Therefore, blank space is not automatically bad. A small amount can focus the
reader on one question. A large remainder produced only because another step is
taller has no semantic job. If it makes a related action look detached, it is
actively weakening the grouping.

The existing ghost ramp is a better use of spare room than an empty floor
because it communicates sequence and remaining work. It should remain a
secondary cue, not become the reason to preserve a maximum-height shell.

### 4. Content must survive zoom and text adaptation

WCAG 2.2 requires content and functionality to remain available when users
increase line, paragraph, word, and letter spacing. The W3C explicitly lists
clipped or overlapped content after text-spacing changes as a failure
([W3C, Understanding SC 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)).
WCAG's Reflow guidance also expects responsive interfaces to adapt for a
320-CSS-pixel-wide viewport and notes that reducing unnecessary scrolling helps
people who zoom
([W3C, Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)).

A fixed height is not itself a WCAG failure if every control remains reachable
through scrolling. It does make the design more dependent on a correctly
perceived and correctly operated inner scroll area, especially with larger text,
longer localized labels, and smaller viewports. Content-driven height is the
more robust default.

### 5. Height animation should be restrained and optional

Apple recommends using motion purposefully, avoiding motion on frequently used
UI interactions, and keeping feedback animations brief and precise
([Apple Human Interface Guidelines, “Motion”](https://developer.apple.com/design/human-interface-guidelines/motion)).
WCAG 2.3.3 says nonessential interaction-triggered motion must be disableable at
Level AAA and names honoring the operating-system reduced-motion preference as
a sufficient approach
([W3C, Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).

For this stepper, an animated outer height is decoration rather than essential
information. The low-motion option is an immediate height change paired with a
stable preview and stable step header. If motion is used to soften the change,
it should be short, should not delay interaction, and should become an instant
state change for reduced-motion users.

## Suggested behavior by context

| Context | Height behavior |
| --- | --- |
| Short or typical step | Natural height with a modest shared `min-height` |
| Conditional fields appearing within a step | Grow immediately from the same top anchor; reserve local space only if the control appears asynchronously |
| Exceptionally long step | Grow until a viewport-relative cap, then scroll that control region |
| Narrow screen or high zoom | Prefer page flow and document scrolling over a tall nested viewport |
| Raw-prompt tab | Keep its explicit disclosure/scroll treatment at a smaller independent height; it is a long document, not a step control |

## What to validate in the page

This recommendation is evidence-informed, not a substitute for looking at the
actual interaction. Compare the current fixed-height version with the hybrid at
mobile, article-column, and wide widths, then check:

- whether Previous/Next and the active field remain in a predictable location,
- whether switching between the shortest and tallest steps causes the reader to
  lose their place,
- whether the page wheel or touch gesture is captured unexpectedly,
- 200% and 400% browser zoom,
- WCAG's text-spacing overrides, and
- reduced-motion mode.

The decision criterion should be task continuity, not zero movement by itself.
