# Banner prompt builder — decisions and measured constraints

The in-article widget on `banner-prompt-spec`. Cited UX research is in
`research-prompt-builder-ux.md`; this file records what the code settled on and
the numbers behind it, so those numbers do not have to live in comments.

## Files

`src/features/blog/components/banner-prompt/`

| File | Holds |
| --- | --- |
| `banner-prompt.tsx` | The MDX entry point: the Raw prompt / Build it tabs |
| `raw-prompt.tsx` | The full spec as read-only text |
| `step-flow.tsx` | The shell: answers state, which step is open, the ghost ramp |
| `steps.tsx` | `visibleSteps()` (the run) and `StepControl` (the open step) |
| `art-step.tsx`, `review-step.tsx` | The two steps too large to sit in `steps.tsx` |
| `headline-field.tsx`, `option-field.tsx` | Shared controls |
| `preview.tsx`, `visuals.tsx` | The fit-check banner, and the thumbnails on the cards |

`src/features/blog/lib/banner-prompt/` holds `options.ts` (the catalogue),
`spec.ts` (the prompt text), `compile.ts` (answers → brief) and `preset.ts`.

## `OptionField` is the media list, not a variant switch

`OptionField` renders only the shape used four times — Platform, Colours,
Background, Lettering: a titled radio grid of thumbnail cards with the chosen
card's description lifted out and announced (a media card has no room for it
inline). It has no `variant` prop.

Its `columns` prop is a responsive ramp (1→2→3 across breakpoints), so it cannot
say "fixed N everywhere". Platform wants its three options on one row at every
width, so it passes `columnsClassName="grid-cols-3 sm:grid-cols-3"` instead — an
override on the group's grid. It has to neutralise the `sm:` step as well as the
base, because `twMerge` resolves each breakpoint separately, so a bare
`grid-cols-3` would leave `sm:grid-cols-2` standing.

The three one-off layouts compose `RadioGroup` + `RadioGroupCard`/`Chip`
directly at their call site, sharing only the `CodeLabel` helper (the spec's
L1/A3/E0 code beside the label): Layout's chips and Edge effect's plain cards in
`steps.tsx`/`art-step.tsx`, Artwork's image tiles in `art-step.tsx`'s
`DirectionField` — one group per family, so each keeps its own heading id.

This is deliberate. An earlier `OptionField` carried `variant="card|chip|tile|
media"` and branched on `isChip`/`isMedia` to serve three layouts used **once
each** — speculative generality. Inlining them costs a repeated heading +
`aria-labelledby` skeleton in three spots, which is cheaper than a flag every
reader has to decode; the WCAG-1.4.11 selection contract stays shared in
`radio-group.tsx`, not copied. Don't re-fold them back behind a `variant` prop.

## Catalogue IDs are literal unions

Every option ID (`PlatformId`, `PaletteId`, …) is a union, and `options.ts`
exports a `*_BY_ID` record per catalogue. A lookup therefore cannot miss, which
is why the builder has no "option not found" fallbacks. `BannerItem` in
`banner-showcase.tsx` uses the same unions even though its values come from
unchecked MDX: a wrong ID in a post fails `pnpm build`, which is louder and
earlier than a caption silently printing a raw ID in production.

## The spec text

`spec.ts` used to be fetched from a public Gist at build time. The builder needs
the generation rules and the self-check *without* the interview step, and prose
cannot be split reliably, so the repo owns the text. The Gist stays alive as a
pointer to the post, because its URL is already shared.

## The raw prompt does not scroll until asked

`raw-prompt.tsx` was a plain `h-110 overflow-y-auto` box. That is an inline
scroll area on the tab that opens by **default**, so a reader scrolling the
article past it had the widget take the wheel instead — Baymard names this exact
failure and NN/g measures the disorientation (`research-prompt-builder-ux.md`
§6).

The box opens at a compact, viewport-aware height. The scroll moved behind a
"Read more" button:

- **One height, both states.** The box never resizes; "Read more" only swaps
  `overflow-hidden` for `overflow-y-auto`, so the height holds whether or not the
  reader unlocks it.
- **Locked: `overflow-hidden`.** Clipped, so the wheel passes through to the
  page. This is the state every reader who is only scanning the article ever
  sees.
- **Unlocked: `overflow-y-auto`, `tabIndex={0}`.** The scroll area comes back in
  full at the same height. The button focuses the region as it unlocks, so the
  keyboard reader who pressed it has something to arrow through — a scrollable
  element is not focusable on its own outside Firefox.
- **Raw prompt keeps its own height.** It is `min(28rem, 60dvh)`, short enough
  to remain an article excerpt rather than a second screen. Switching tabs may
  resize the widget because that movement directly follows the reader's action.
- **The trap is not removed, it is opted into.** The wager is [§6's 20–28%
  figure](./research-prompt-builder-ux.md): almost nobody scrolls far enough to
  press the button, and whoever does has stopped scanning and started reading.
- **`overscroll-behavior` is not the fix and was not used.** `contain` stops
  chaining, so the page would never resume once the box bottomed out; it makes
  the trap worse. No CSS property covers wheel capture on pointer entry, which
  is why the gate is a button.
- **The button covers the faded 4rem exactly**, so the target is the whole dead
  edge rather than a small control inside it.

The control panel in `step-flow.tsx` becomes scrollable only when an active step
reaches its viewport-relative cap. It is a viewport over controls the reader is
operating, not a document they are reading past.

## Sizing, and the numbers that produced it

- **Control panel: content-driven between a floor and a cap.** Its minimum is
  `10rem` on mobile and `13rem` from `sm`; its maximum is the smaller of `30rem`
  and `50dvh` on mobile or `40dvh` from `sm`. Short steps therefore keep related
  controls close, typical steps grow naturally, and only long steps scroll.
- **Preview: one box, not a reserved ratio.** Every platform letterboxes into
  it, so switching never moves the controls under the pointer. It leaves 53px
  more for the panel than reserving the tallest stock ratio did. Its height is
  `--preview-h` (`7.5rem` on mobile, `11.25rem`/180px from `sm`) — smaller on a
  phone, where a wide banner's letterbox would otherwise waste most of the box
  and squeeze the controls under the fixed tab height. The inner width cap
  (`min(100%, calc(var(--preview-h) * ratio))`) reads the same var, so a
  near-square custom banner can never outgrow the box; the container-query units
  inside scale with it too. The frame is also the trigger for a
  `react-photo-view` viewer. Its custom `render` repeats the live DOM preview at
  the banner's real dimensions, so it remains current and crisp without
  rasterising it. `PhotoView` is keyed by width and height because the library
  registers those dimensions only when the item mounts.
- **Preview caption: one line.** Each extra line takes room from the bounded
  control surface below it.
- **Ghost ramp: a mask, not a per-row opacity ladder.** The ladder had to guess
  how many rows there was room for; it ran out after four, and every row past
  that rendered transparent while still taking its 32px — the hole a short step
  opened under the fade. A mask takes a fraction of whatever height flex hands
  the ramp, so it always lands on the floor.
- **`min-h-0` on the ramp, not a floor.** A floor binds only on steps whose
  control already overflows, so it took its 92px from the three steps with none
  to give.

## Steps that moved

- **Edge effect** was a peer step until it became the only choice the preview
  cannot draw — every other control changes what you see, and a peer step that
  does nothing reads as broken. It now sits inside Artwork's disclosure and
  still compiles into the brief byte for byte.
- **Review** lists the reader's own answers, not the compiled text, so each row
  can carry a link back to the step that set it. It deliberately does not reuse
  `buildBriefLines` — that also carries house rules nobody picked, and those
  must not get a "Change" link.

## The palette and the preview

The preview art is a fixed cutout PNG that never recolours, but a real
generation tints the whole banner with the palette, the figure included.
Auto-recolouring a flat PNG was rejected — it cannot be made to look good, and a
bad tint reads as more broken than an honest reference. Left unsaid, though, the
reader takes the palette as text-only, because switching it only moves the
headline colour on screen. Two lines close that gap:

- The palette-step hint names the artwork, not just the text and background.
- The preview caption is plain and colour-honest — "This shows the layout, not
  the real colours or art" — kept to one line against the 440px budget.

A third line — a caveat under the cards spelling out that the sample keeps its
own colours — was cut. With the hint already making the point, it doubled the
message and overloaded a step that only asks for one choice. No em dash in the
hint, either: the widget copy avoids them.

## The examples caption

`banner-showcase.tsx` states each example's look in plain words — palette and art
direction — and defers the full coded recipe (platform, layout, effect, palette,
prop, with their IDs) to a single **Copy recipe** button on the right. The caption
reads at a glance instead of as a run-on of middot-separated codes, and the recipe
stays one click away — progressive disclosure. The label is copy-flavoured even
though the button *opens* a popover rather than copying on click — deliberate, and
a known pattern (GitHub's "Code ▾", Vercel's "Save ▾" both open a panel that holds
the real action). Don't "fix" it to a reveal verb; "Recreate" and "Use this look"
were tried and dropped.

The button is a `default`-variant `PopoverTrigger` (label "Copy recipe" +
chevron); the popover is the shared `Popover` (Radix-portalled, so the card's
`overflow-hidden` never clips it) showing the recipe as a read-only grid, with a
`CopyButton` (`inverse`, label "Copy") pinned to the footer's right edge — the
"Copy recipe" trigger gives that lone "Copy" its context. A split button (copy |
caret) was tried first and read as two controls crowding the caption; one trigger
with the copy inside the popover sat better.

The copy payload is the full locked prompt, not the spec list. `itemToAnswers(item)`
maps the example's options onto `BannerAnswers` and runs them through the builder's
own `compileBannerPrompt`, so a copied recipe and a built prompt share one format
and cannot drift. Every showcase example is L1/L2 (art + copy), so the payload
always locks the visual choices and marks the headline and accent phrase `(ask me)`
— the reader supplies only their own words. Prop stays display-only: the grid shows
it, but `compileBannerPrompt` leaves the prop to the spec, as the builder does.
`specRows(item)` still feeds the read-only grid alone.

There is no longer a "Use this setup" button that loaded the example into the
builder, so `applyBannerPreset` / `onBannerPreset` / `toPreset` and the
`BUILDER_ANCHOR_ID` scroll target in `preset.ts` are now dormant — nothing emits a
preset. Left in place in case that navigation returns; delete if it does not.

## Prompt copy

- Copy and download are never gated on a blank field. A missing headline, accent
  phrase, or custom size compiles to an `(ask me)` marker in the brief, and
  `compileBannerPrompt` swaps `BRIEF_IS_LOCKED` ("skip STEP 1, don't ask, just
  generate") for `BRIEF_HAS_GAPS`, which interviews for those gaps **alone** —
  the model asks for them one at a time instead of rendering empty quotes.
  Re-running the whole STEP 1 was rejected: it re-asks every option the reader
  already locked. A complete brief still gets `BRIEF_IS_LOCKED`.
- Dropped fields are named as `dropped` rather than omitted: an absent line
  reads as an omission the model may fill in.
- Work/role and prop are left to the spec. The headline already states the work,
  and the spec picks a better prop than most readers will.
- The custom-note guardrail refuses named artists in the prompt rather than
  detecting them in the input, which is more reliable.
