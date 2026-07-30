import { defineI18n } from "fumadocs-core/i18n";

/**
 * Blog-only locale config. This is deliberately NOT the setup Fumadocs and Next
 * document (an `app/[lang]` segment plus a rewriting proxy): the blog routes are
 * hand-written at their real paths so they stay statically generated, and the
 * default proxy matcher would rewrite the entire non-blog site. Nothing here
 * touches routing — it only tells `loader()` how to read the content tree and
 * what `page.url` should look like.
 */
export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: ["en", "my"],
  // English keeps its bare, already-indexed URLs; Burmese gets a `/my` prefix.
  hideLocale: "default-locale",
  // Locale is the first directory under `content/blog`, stripped before slugs.
  parser: "dir",
  // A missing translation must be a 404, never the English post at a second URL.
  // Also load-bearing for the content-loss guard in `source.ts` — read it first.
  fallbackLanguage: null,
});

/**
 * Inferred from `languages` above rather than written out, so adding a locale
 * there turns every unhandled `switch` and string table into a type error.
 */
export type Locale = (typeof i18n)["languages"][number];
