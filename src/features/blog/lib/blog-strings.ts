import type { Locale } from "@/lib/i18n";

type BlogStrings = {
  indexTitle: string;
  indexIntro: string;
  categoryAll: string;
  categoryTech: string;
  categoryLife: string;
  emptyCategory: string;
  readMore: string;
  readMoreLabel: (title: string) => string;
  photoBy: string;
  authorLabel: string;
  series: Record<"technology" | "thoughts", string>;
};

/**
 * Every user-facing string the blog renders around a post, per locale.
 *
 * A plain object on purpose. At this size a translation framework or a
 * `messages/` catalogue would be more machinery than content, and `satisfies`
 * makes a missing key a build error rather than a runtime fallback.
 *
 * Scope is the blog's own furniture. Site navigation and the footer stay
 * English on Burmese routes because they lead to English pages.
 */
export const BLOG_STRINGS = {
  en: {
    indexTitle: "Blogs",
    indexIntro:
      "I write about psychology, life, and tech, usually whatever I can't stop thinking about that week.",
    categoryAll: "All",
    categoryTech: "Tech",
    categoryLife: "Life",
    emptyCategory: "No posts found for this category yet.",
    readMore: "Read More",
    readMoreLabel: (title: string) => `Read more about ${title}`,
    photoBy: "Photo By",
    authorLabel: "— author:",
    // Deliberately the raw frontmatter values, so introducing this table did
    // not restyle English category labels.
    series: {
      technology: "technology",
      thoughts: "thoughts",
    },
  },
  my: {
    indexTitle: "ဆောင်းပါးများ",
    indexIntro:
      "စိတ်ပညာ၊ ဘဝနှင့် နည်းပညာအကြောင်း ရေးသားပါသည်။ ထိုအပတ်အတွင်း စဉ်းစားမရပ်နိုင်ဖြစ်နေသည့် အကြောင်းအရာများ ဖြစ်တတ်ပါသည်။",
    categoryAll: "အားလုံး",
    categoryTech: "နည်းပညာ",
    categoryLife: "ဘဝ",
    emptyCategory: "ဤအမျိုးအစားအတွက် ဆောင်းပါး မရှိသေးပါ။",
    readMore: "ဆက်ဖတ်ရန်",
    // A function, not a prefix concatenated at the call site: Burmese puts the
    // object before the verb, so the title cannot simply be appended.
    readMoreLabel: (title: string) => `${title} ကို ဆက်ဖတ်ရန်`,
    photoBy: "ဓာတ်ပုံ —",
    authorLabel: "— ရေးသားသူ:",
    series: {
      technology: "နည်းပညာ",
      thoughts: "ဘဝ",
    },
  },
} satisfies Record<Locale, BlogStrings>;

export const getBlogStrings = (locale: Locale): BlogStrings =>
  BLOG_STRINGS[locale];
