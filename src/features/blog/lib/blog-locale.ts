import type { Locale } from "@/lib/i18n";
import { type BlogPost, blogSource } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";

/**
 * Content locale → BCP-47 tag for `Intl`.
 *
 * These are two different things and conflating them silently changes English
 * output: the content locale is `"en"`, which ICU resolves to en-US, while this
 * site has always formatted English dates as en-GB (`26 July 2026`, not
 * `July 26, 2026`). Burmese needs no such distinction — `"my"` already yields
 * the locale's own numbering system, and therefore Burmese digits.
 */
export const getDateLocale = (locale: Locale): string => DATE_LOCALES[locale];

/**
 * The Myanmar face on Burmese routes, `latinFont` everywhere else.
 *
 * Burmese routes have to override each Latin face the design pins — Doto,
 * Inter, Gloria Hallelujah — because none of them carries Myanmar glyphs, and
 * text set in them falls through to whatever the OS provides, which on some
 * machines is empty boxes. Passing the Latin face in keeps that decision in one
 * place instead of repeating the locale test at every call site.
 */
export const localeFontClass = (
  locale: Locale,
  latinFont?: string
): string | undefined =>
  locale === "my" ? "font-noto-sans-myanmar" : latinFont;

/** English keeps its bare, already-indexed path; every other locale is prefixed. */
export const localeBlogPath = (locale: Locale): string =>
  locale === "en" ? "/blog" : `/${locale}/blog`;

/**
 * The `hreflang` set for a pair of paths, or `undefined` unless both are there.
 *
 * Each language names the other *and* itself, because a crawler only trusts a
 * cluster whose members agree. `x-default` goes to English as the site's
 * default locale — not a claim that English is the real version, only where an
 * unmatched reader should land.
 *
 * Orthogonal to `canonical`, which always points at the page itself: alternates
 * group the pair, the canonical keeps them two results.
 */
export const localeAlternates = ({
  en,
  my,
}: Partial<Record<Locale, string>>):
  | Record<Locale | "x-default", string>
  | undefined =>
  en && my
    ? {
        en: absoluteUrl(en),
        my: absoluteUrl(my),
        "x-default": absoluteUrl(en),
      }
    : undefined;

/**
 * The `hreflang` set for a post, from its slug alone.
 *
 * Deliberately blind to which language is being rendered: it asks the loader
 * for both and lets the answer decide. Both ends of a pair therefore emit the
 * identical set by construction rather than by two call sites agreeing, and an
 * untranslated post gets `undefined` — it is not a translation of anything and
 * must not be advertised as one.
 */
export const postAlternates = (
  slugs: string[]
): Record<Locale | "x-default", string> | undefined =>
  localeAlternates({
    en: alternatePath(blogSource.getPage(slugs, "en")),
    my: alternatePath(blogSource.getPage(slugs, "my")),
  });

/**
 * A post's path, or nothing if it may not join an `hreflang` cluster.
 *
 * A draft is writing the author has not published: it renders `noindex`, and is
 * held out of the indexes, the sitemap and the search index. An `hreflang` is
 * an advertisement to a crawler, so a draft belongs in no cluster, at either
 * end — one missing side drops the whole set, since a half-declared cluster is
 * never reciprocated anyway.
 *
 * Narrower than the test `LanguageSwitch` uses on purpose: a draft translation
 * is still worth linking to for a reader looking straight at it.
 */
const alternatePath = (post: BlogPost): string | undefined =>
  post && !post.data.draft ? post.url : undefined;

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  my: "my",
};
