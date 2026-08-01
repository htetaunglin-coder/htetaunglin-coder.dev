import type { Locale } from "@/lib/i18n";

type BlogStrings = {
  photoBy: string;
  authorLabel: string;
  breadcrumbBlog: string;
  series: Record<"technology" | "thoughts", string>;
};

/**
 * The site's description of its own blog: both indexes show it, both indexes'
 * metadata repeat it.
 */
export const BLOG_INTRO =
  "I write about psychology, life, and tech, usually whatever I can't stop thinking about that week.";

/**
 * The furniture immediately around a post, which follows the post's own
 * language. Site navigation, the footer and the index chrome stay English on
 * Burmese routes, because they lead to or belong to English pages.
 *
 * `satisfies` makes a missing key a build error rather than a runtime fallback,
 * so adding a locale to `i18n.ts` fails here until it is translated.
 */
export const BLOG_STRINGS = {
  en: {
    photoBy: "Photo By",
    authorLabel: "— author:",
    breadcrumbBlog: "Blog",
    // The raw frontmatter values, so introducing this table did not restyle
    // English category labels.
    series: {
      technology: "technology",
      thoughts: "thoughts",
    },
  },
  my: {
    photoBy: "ဓာတ်ပုံ —",
    authorLabel: "— ရေးသားသူ:",
    breadcrumbBlog: "ဆောင်းပါးများ",
    series: {
      technology: "နည်းပညာ",
      thoughts: "ဘဝ",
    },
  },
} satisfies Record<Locale, BlogStrings>;
