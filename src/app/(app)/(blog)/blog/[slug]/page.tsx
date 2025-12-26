import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { Comment } from "@/components/comment";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/ui/nav-link";
import { getMDXComponents } from "@/features/blog/components/mdx-components";
import { blogSource } from "@/lib/source";
import {
  getArticleStructuredData,
  getBreadcrumbStructuredData,
} from "@/lib/structured-data";
import { absoluteUrl, cn, formatDate } from "@/lib/utils";

export function generateStaticParams(): { slug: string }[] {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug]);

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
  const page = blogSource.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  const articleStructuredData = getArticleStructuredData({
    title: page.data.title,
    description: page.data.description || "",
    datePublished: page.data.date,
    dateModified: page.data.date,
    url: page.url,
    tags: page.data.tags,
  });

  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: page.data.title },
  ]);

  return (
    <>
      <StructuredData data={articleStructuredData} />
      <StructuredData data={breadcrumbStructuredData} />
      <main>
        <div>
          <figure className="pointer-events-none absolute top-0 left-0 z-[-1] h-[16rem] w-full overflow-hidden">
            <div className="absolute inset-0 z-[-1]">
              <CloudinaryImage
                alt={page.data.title}
                className="object-cover object-bottom"
                data-nimg={1}
                decoding="async"
                fetchPriority="high"
                fill
                loading="eager"
                src={page.data.image.url}
                style={{ color: "transparent" }}
                title={page.data.title}
              />
            </div>
          </figure>
          <div className="absolute top-0 left-0 z-[-1] h-[16rem] w-full bg-gradient-to-b from-bg-default/5 to-bg-default" />
        </div>

        <div className="flex w-full justify-center py-8 pt-38 text-left sm:pt-48">
          <div className="w-full max-w-6xl px-4 lg:px-6">
            <div className="-mt-8 flex w-full justify-end text-fg-tertiary">
              <p className="text-xs sm:text-sm">
                Photo By{" "}
                <NavLink
                  className="text-fg-brand underline"
                  href={page.data.image.author_link}
                >
                  {page.data.image.author_name}
                </NavLink>
              </p>
            </div>
            <div className="border-b border-b-outline-secondary py-12">
              <div className="mb-2 font-medium font-mono">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-fg-tertiary text-xs uppercase sm:text-sm">
                    {page.data.series}
                  </p>

                  <div className="inline-flex items-center gap-1.5 text-fg-tertiary text-xs sm:text-sm">
                    <Calendar />
                    <p>{formatDate(page.data.date, { includeDay: true })}</p>
                  </div>

                  <p className="font-medium font-mono text-fg-tertiary text-xs sm:text-sm">
                    — author:{" "}
                    <span className="text-fg-brand italic">
                      {page.data.author}
                    </span>
                  </p>
                </div>
              </div>

              <DocsTitle className="mb-2 flex items-center text-left font-semibold text-fg-default text-xl sm:text-3xl">
                {page.data.title}
              </DocsTitle>
              <DocsDescription className="mb-6 w-full max-w-5xl text-left text-base text-fg-tertiary sm:text-lg">
                {page.data.description}
              </DocsDescription>

              {page.data.tags && (
                <div className="flex flex-wrap gap-2">
                  {page.data.tags.map((tag) => (
                    <Badge
                      className="inline-block px-2 py-1 font-medium font-mono text-xs"
                      key={tag}
                      radius="full"
                      variant="secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DocsLayout
              containerProps={{
                className: cn(
                  "blog [&_#nd-toc_a]:data-[active=true]:!text-fg-default [&_#nd-toc_a]:data-[active=false]:!text-fg-tertiary/80 [&_#nd-toc]:!top-28 m-0 w-full [&_#nd-toc]:sticky [&_#nd-toc]:bg-bg-secondary/40 [&_#nd-toc]:py-12 [&_#nd-toc]:pl-6"
                ),
              }}
              nav={{ enabled: false }}
              sidebar={{ enabled: false, prefetch: false, tabs: false }}
              tree={{
                name: "Tree",
                children: [],
              }}
            >
              <DocsPage
                article={{
                  className: "max-w-none !px-0",
                }}
                container={{
                  className: "pe-0 relative gap-16 items-start",
                }}
                footer={{
                  enabled: false,
                }}
                full={page.data.full}
                // lastUpdate={lastUpdate}
                tableOfContent={{
                  style: "clerk",
                  single: false,
                }}
                toc={page.data.toc}
              >
                <DocsBody className="prose dark:prose-invert max-w-none">
                  <Mdx components={getMDXComponents()} />
                </DocsBody>
              </DocsPage>
            </DocsLayout>
            <figure className="mt-28 min-h-[24rem]">
              <Comment />
            </figure>
          </div>
        </div>
      </main>
      <div className="mt-12 flex w-full justify-center">
        {" "}
        <Footer className="max-w-6xl px-6" />
      </div>
    </>
  );
};

export default BlogPage;
