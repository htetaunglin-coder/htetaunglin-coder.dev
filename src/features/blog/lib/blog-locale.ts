import type { Locale } from "@/lib/i18n";
import { type BlogPost, blogSource } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";

/**
 * BCP-47 tags for `Intl`, not content locales: `"en"` would resolve to en-US,
 * and this site formats English dates as en-GB.
 */
export const DATE_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  my: "my",
};

/**
 * No Latin face the design pins carries Myanmar glyphs, so Burmese text set in
 * one falls through to whatever the OS has — on some machines, empty boxes.
 */
export const myanmarFontClass = (locale: Locale): string | undefined =>
  locale === "my" ? "font-noto-sans-myanmar" : undefined;

/** English keeps its bare, already-indexed path; every other locale is prefixed. */
export const localeBlogPath = (locale: Locale): string =>
  locale === "en" ? "/blog" : `/${locale}/blog`;

/** Unconditional, unlike a post's: both indexes always exist. */
export const BLOG_INDEX_ALTERNATES = alternates("/blog", "/my/blog");

/**
 * The `hreflang` set for a post, or `undefined` unless both languages exist.
 * Blind to which one is rendering, so the two ends of a pair emit the identical
 * set by construction. See `agent_docs/i18n-burmese-english.md`.
 */
export const postAlternates = (
  slugs: string[]
): Record<Locale | "x-default", string> | undefined => {
  const en = indexablePostPath(blogSource.getPage(slugs, "en"));
  const my = indexablePostPath(blogSource.getPage(slugs, "my"));

  return en && my ? alternates(en, my) : undefined;
};

/** Each language names the other *and* itself: a crawler only trusts a cluster whose members agree. */
function alternates(
  en: string,
  my: string
): Record<Locale | "x-default", string> {
  return {
    en: absoluteUrl(en),
    my: absoluteUrl(my),
    "x-default": absoluteUrl(en),
  };
}

/**
 * Narrower than the test `LanguageSwitch` uses on purpose: a draft belongs in no
 * `hreflang` cluster, but is still worth linking to for a reader looking at it.
 */
const indexablePostPath = (post: BlogPost): string | undefined =>
  post && !post.data.draft ? post.url : undefined;
