import type { Locale } from "@/lib/i18n";

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

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  my: "my",
};
