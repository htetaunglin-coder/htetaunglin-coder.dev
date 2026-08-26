import type { BannerAnswers } from "./compile";

/**
 * How an example hands its options to the builder. A module-level emitter, not
 * a context: `BannerShowcase` and `BannerPrompt` are separate MDX components
 * with no common ancestor short of the whole post.
 */
export type BannerPreset = Partial<
  Omit<BannerAnswers, "headline" | "accentPhrase">
>;

/**
 * The builder's scroll and focus target. An explicit id rather than the
 * `### The prompt` heading's slug, which differs in the Burmese post.
 */
export const BUILDER_ANCHOR_ID = "banner-builder";

export function applyBannerPreset(preset: BannerPreset): void {
  for (const listener of listeners) {
    listener(preset);
  }
}

export function onBannerPreset(
  listener: (preset: BannerPreset) => void
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

const listeners = new Set<(preset: BannerPreset) => void>();
