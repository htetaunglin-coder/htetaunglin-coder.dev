import type { Locale } from "@/lib/i18n";
import { type BlogPost, blogSource } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";

/**
 * BCP-47 tags for `Intl`, which are not the content locale: `"en"` resolves to
 * en-US, while this site has always formatted English dates as en-GB
 * (`26 July 2026`, not `July 26, 2026`). `"my"` needs no such correction — it
 * already yields the locale's own numbering system, and so Burmese digits.
 */
export const DATE_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  my: "my",
};

/**
 * Burmese has to override every Latin face the design pins, because none of
 * them carries Myanmar glyphs: text set in them falls through to whatever the
 * OS provides, which on some machines is empty boxes.
 */
export const myanmarFontClass = (locale: Locale): string | undefined =>
  locale === "my" ? "font-noto-sans-myanmar" : undefined;

/** English keeps its bare, already-indexed path; every other locale is prefixed. */
export const localeBlogPath = (locale: Locale): string =>
  locale === "en" ? "/blog" : `/${locale}/blog`;

/**
 * The `hreflang` set shared by both blog indexes. Unconditional, unlike a
 * post's: both indexes always exist, so this pair can never be half-present.
 */
export const BLOG_INDEX_ALTERNATES = alternates("/blog", "/my/blog");

/**
 * The `hreflang` set for a post, from its slug alone, or `undefined` unless
 * both languages exist.
 *
 * Deliberately blind to which language is being rendered: it asks the loader
 * for both and lets the answer decide, so the two ends of a pair emit the
 * identical set by construction rather than by two call sites agreeing.
 */
export const postAlternates = (
  slugs: string[]
): Record<Locale | "x-default", string> | undefined => {
  const en = indexablePostPath(blogSource.getPage(slugs, "en"));
  const my = indexablePostPath(blogSource.getPage(slugs, "my"));

  return en && my ? alternates(en, my) : undefined;
};

/**
 * Each language names the other *and* itself, because a crawler only trusts a
 * cluster whose members agree. `x-default` goes to English as the site's
 * default locale — not a claim that English is the real version, only where an
 * unmatched reader should land.
 *
 * Orthogonal to `canonical`, which always points at the page itself: alternates
 * group the pair, the canonical keeps them two results.
 */
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
 * A draft renders `noindex` and is held out of the indexes, the sitemap and the
 * search index. An `hreflang` is an advertisement to a crawler, so a draft
 * belongs in no cluster at either end — one missing side drops the whole set,
 * since a half-declared cluster is never reciprocated anyway.
 *
 * Narrower than the test `LanguageSwitch` uses on purpose: a draft translation
 * is still worth linking to for a reader looking straight at it.
 */
const indexablePostPath = (post: BlogPost): string | undefined =>
  post && !post.data.draft ? post.url : undefined;
