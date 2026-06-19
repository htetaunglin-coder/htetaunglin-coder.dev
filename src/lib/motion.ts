/**
 * Shared motion rhythm for the site — one tempo across every component.
 *
 * The portfolio's vibe is calm and trustworthy, so entrance and ambient motion
 * glide long and settle softly, while frequently-repeated and micro-interactions
 * stay snappy enough to feel responsive. Reach for these tokens instead of
 * hand-writing durations/easings so the whole site moves to the same beat.
 */

/** Cubic-bezier easing curves (typed tuples for motion + CSS). */
export const EASE = {
  /** easeOutExpo — fast arrival, long glide to rest. Default for entrances. */
  out: [0.16, 1, 0.3, 1],
  /** Smooth symmetric — elements changing state while visible (morphs, toggles). */
  inOut: [0.65, 0, 0.35, 1],
  /** Gentle-in, quick-out — for exits, which should be subtler than enters. */
  in: [0.4, 0, 1, 1],
} as const;

/** Durations in seconds (motion). Mirrors Tailwind's `duration-*` where it overlaps. */
export const DURATION = {
  /** Micro-interactions — hovers, scroll-hide. Matches Tailwind `duration-300`. */
  fast: 0.3,
  /** Frequently-repeated UI — chat messages, control toggles. */
  quick: 0.45,
  /** Standard section / element entrance. */
  base: 0.8,
  /** Prominent, large-surface entrance — hero, full panels. */
  slow: 1,
} as const;

/** Calm production spring — smooth deceleration, no overshoot. */
export const SPRING = {
  smooth: { type: "spring", bounce: 0, duration: DURATION.base },
} as const;

/** Stagger steps for sequenced children. */
export const STAGGER = {
  /** Pronounced, calm sequencing — few large children. */
  base: 0.08,
  /** Subtle sequencing — many children (nav lists) so the tail isn't slow. */
  tight: 0.05,
} as const;
