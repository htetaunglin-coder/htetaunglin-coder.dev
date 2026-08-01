import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/features/blog/components/blog-post-view";
import { postMetadata } from "@/features/blog/lib/blog-metadata";
import { blogSource } from "@/lib/source";

export function generateStaticParams(): { slug: string }[] {
  return blogSource.getPages("en").map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  return postMetadata("en", slug);
}

const BlogPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug], "en");

  if (!page) notFound();

  return <BlogPostView locale="en" post={page} />;
};

export default BlogPage;
