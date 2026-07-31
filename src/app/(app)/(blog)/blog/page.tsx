import type { Metadata } from "next";
import { BlogIndexView } from "@/features/blog/components/blog-index-view";
import { localeAlternates } from "@/features/blog/lib/blog-locale";
import { absoluteUrl } from "@/lib/utils";

// Unconditional, unlike a post's: both indexes always exist, so this pair can
// never be half-present. Above `metadata` because that literal reads it.
const indexAlternates = localeAlternates({ en: "/blog", my: "/my/blog" });

export const metadata: Metadata = {
  title: "Blog",
  description:
    "I write about psychology, life, and tech, usually whatever I can't stop thinking about that week.",
  alternates: {
    canonical: absoluteUrl("/blog"),
    languages: indexAlternates,
  },
  openGraph: {
    title: "Blog | Htet Aung Lin",
    description:
      "I write about psychology, life, and tech, usually whatever I can't stop thinking about that week.",
    url: absoluteUrl("/blog"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | Htet Aung Lin",
    description:
      "I write about psychology, life, and tech, usually whatever I can't stop thinking about that week.",
  },
};

export default async function Blog(props: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await props.searchParams;

  return <BlogIndexView category={category} locale="en" />;
}
