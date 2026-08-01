import type { Metadata } from "next";
import { BlogIndexView } from "@/features/blog/components/blog-index-view";
import { localeAlternates } from "@/features/blog/lib/blog-locale";
import { INDEX_STRINGS } from "@/features/blog/lib/blog-strings";
import { absoluteUrl } from "@/lib/utils";

const LOCALE = "my";

// English, matching the chrome this page actually renders — a Burmese title in
// the search result would promise a Burmese page and deliver an English one.
// Named rather than borrowing `/blog`'s "Blog": the two are separate indexed
// URLs, and identical titles give a reader no way to tell them apart.
const TITLE = "Blog in Burmese";

export const metadata: Metadata = {
  title: TITLE,
  description: INDEX_STRINGS.intro,
  alternates: {
    // Points at itself, not at `/blog`. The two indexes list different posts,
    // so collapsing them into one result would hide the Burmese one.
    canonical: absoluteUrl("/my/blog"),
    languages: localeAlternates({ en: "/blog", my: "/my/blog" }),
  },
  openGraph: {
    title: `${TITLE} | Htet Aung Lin`,
    description: INDEX_STRINGS.intro,
    url: absoluteUrl("/my/blog"),
    type: "website",
    // Still `my_MM`, even with English chrome: this is the `my` member of the
    // hreflang cluster, and the writing it lists is Burmese.
    locale: "my_MM",
  },
  twitter: {
    card: "summary",
    title: `${TITLE} | Htet Aung Lin`,
    description: INDEX_STRINGS.intro,
  },
};

// Request-time rendered, same as `/blog`, because it reads `searchParams` for
// the category filter. That predates i18n and is not caused by it.
export default async function BurmeseBlog(props: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await props.searchParams;

  return <BlogIndexView category={category} locale={LOCALE} />;
}
