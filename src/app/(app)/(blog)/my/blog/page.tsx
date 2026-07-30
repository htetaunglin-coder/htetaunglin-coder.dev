import type { Metadata } from "next";
import { BlogIndexView } from "@/features/blog/components/blog-index-view";
import { getBlogStrings } from "@/features/blog/lib/blog-strings";
import { absoluteUrl } from "@/lib/utils";

const LOCALE = "my";

const strings = getBlogStrings(LOCALE);

export const metadata: Metadata = {
  title: strings.indexTitle,
  description: strings.indexIntro,
  alternates: {
    // Points at itself, not at `/blog`. The two indexes list different posts,
    // so collapsing them into one result would hide the Burmese one.
    canonical: absoluteUrl("/my/blog"),
  },
  openGraph: {
    title: `${strings.indexTitle} | Htet Aung Lin`,
    description: strings.indexIntro,
    url: absoluteUrl("/my/blog"),
    type: "website",
    locale: "my_MM",
  },
  twitter: {
    card: "summary",
    title: `${strings.indexTitle} | Htet Aung Lin`,
    description: strings.indexIntro,
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
