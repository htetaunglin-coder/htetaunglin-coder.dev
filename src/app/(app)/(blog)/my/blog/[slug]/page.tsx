import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/features/blog/components/blog-post-view";
import { postAlternates } from "@/features/blog/lib/blog-locale";
import { blogSource } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";

const LOCALE = "my";

// Only slugs that genuinely exist under `content/blog/my`. A slug that only has
// an English version is not listed here and 404s in `getPage` below — never the
// English post served a second time at a Burmese address.
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

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.tags || [],
    // Same rule as the English route: a draft renders at its real URL so the
    // author can read it, but is not indexed there.
    robots: blog.draft ? { index: false, follow: true } : undefined,
    alternates: {
      // Itself, never the English post. Pointing a Burmese page at its English
      // counterpart would fold the two into one result and undo the whole
      // point of giving Burmese its own addresses.
      canonical: pageUrl,
      languages: postAlternates(page.slugs),
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      locale: "my_MM",
      url: pageUrl,
      publishedTime: blog.date.toISOString(),
      modifiedTime: blog.date.toISOString(),
      authors: ["Htet Aung Lin"],
      tags: blog.tags,
      // No `images` yet on purpose. `/og` renders title text into the card and
      // cannot shape Myanmar script, so pointing at it would ship malformed
      // Burmese into every share preview. Wiring these up is #39's job.
    },
    twitter: {
      card: "summary",
      title: blog.title,
      description: blog.description,
      creator: "@htetaunglin-cdr",
    },
  };
}

const BurmeseBlogPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const page = blogSource.getPage([params.slug], LOCALE);

  if (!page) notFound();

  // The font variable itself is applied by the `/my` layout above; `locale`
  // only decides which elements claim the family and which strings they read.
  return <BlogPostView locale={LOCALE} post={page} />;
};

export default BurmeseBlogPage;
