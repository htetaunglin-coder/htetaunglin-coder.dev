import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/features/blog/components/blog-post-view";
import { postAlternates } from "@/features/blog/lib/blog-locale";
import { blogSource } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";

const LOCALE = "en";

export function generateStaticParams(): { slug: string }[] {
  return blogSource.getPages(LOCALE).map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug], LOCALE);

  if (!page) {
    notFound();
  }

  const blog = page.data;

  if (!(blog.title && blog.description)) {
    notFound();
  }

  const pageUrl = absoluteUrl(page.url);
  const ogImageUrl = absoluteUrl(
    `/og?title=${encodeURIComponent(
      blog.title
    )}&description=${encodeURIComponent(blog.description)}&img_url=${encodeURIComponent(blog.image.url)}&&blog=true`
  );

  const keywords = blog.tags || [];

  return {
    title: blog.title,
    description: blog.description,
    keywords,
    alternates: {
      canonical: pageUrl,
      languages: postAlternates(page.slugs),
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      url: pageUrl,
      publishedTime: blog.date.toISOString(),
      modifiedTime: blog.date.toISOString(),
      authors: ["Htet Aung Lin"],
      tags: blog.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      creator: "@htetaunglin-cdr",
      images: [ogImageUrl],
    },
  };
}

const BlogPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const page = blogSource.getPage([params.slug], LOCALE);

  if (!page) notFound();

  return <BlogPostView post={page} />;
};

export default BlogPage;
