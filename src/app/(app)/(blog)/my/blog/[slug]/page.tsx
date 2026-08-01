import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/features/blog/components/blog-post-view";
import { postMetadata } from "@/features/blog/lib/blog-metadata";
import { blogSource } from "@/lib/source";

// Only slugs that genuinely exist under `content/blog/my`. A slug that has only
// an English version is not listed here and 404s below — never the English post
// served a second time at a Burmese address.
export function generateStaticParams(): { slug: string }[] {
  return blogSource.getPages("my").map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  return postMetadata("my", slug);
}

const BurmeseBlogPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug], "my");

  if (!page) notFound();

  return <BlogPostView locale="my" post={page} />;
};

export default BurmeseBlogPage;
