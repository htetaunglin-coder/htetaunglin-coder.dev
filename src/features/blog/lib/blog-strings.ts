import type { Locale } from "@/lib/i18n";

type BlogStrings = {
  photoBy: string;
  authorLabel: string;
  /**
   * The blog crumb in a post's `BreadcrumbList`. English shows "Blog" in the
   * trail and "Blogs" at the top of the index, and always has. There is no
   * `breadcrumbHome`: that crumb leads to the English home page and names
   * itself in English in both locales.
   */
  breadcrumbBlog: string;
  series: Record<"technology" | "thoughts", string>;
};

/**
 * The index chrome, English on **both** indexes.
 *
 * Not keyed by locale, because it does not vary by one. An index is the site
 * talking — heading, intro, category tabs, empty state, read-more — and the
 * site is English. What varies on `/my/blog` is the posts it lists, whose
 * titles and descriptions are Burmese because they were written that way.
 *
 * A Burmese translation of these existed and was removed: the Burmese index
 * reads English chrome by choice, and translations that never render are worse
 * than none, since they look maintained.
 */
export const INDEX_STRINGS = {
  heading: "Blogs",
  intro:
    "I write about psychology, life, and tech, usually whatever I can't stop thinking about that week.",
  categoryAll: "All",
  categoryTech: "Tech",
  categoryLife: "Life",
  emptyCategory: "No posts found for this category yet.",
  readMore: "Read More",
  readMoreLabel: (title: string) => `Read more about ${title}`,
};

/**
 * The furniture around a post, which does follow the post's own language.
 *
 * A plain object on purpose. At this size a translation framework or a
 * `messages/` catalogue would be more machinery than content, and `satisfies`
 * makes a missing key a build error rather than a runtime fallback.
 *
 * Scope is the post page only. Site navigation, the footer, and the index
 * chrome above stay English on Burmese routes, because they lead to or belong
 * to English pages.
 */
export const BLOG_STRINGS = {
  en: {
    photoBy: "Photo By",
    authorLabel: "— author:",
    breadcrumbBlog: "Blog",
    // Deliberately the raw frontmatter values, so introducing this table did
    // not restyle English category labels.
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

export const getBlogStrings = (locale: Locale): BlogStrings =>
  BLOG_STRINGS[locale];
