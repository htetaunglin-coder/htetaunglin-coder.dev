import type { Metadata } from "next";
import { BlogIndexView } from "@/features/blog/components/blog-index-view";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "I write about psychology, life, and tech, usually whatever I can't stop thinking about that week.",
  alternates: {
    canonical: absoluteUrl("/blog"),
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
