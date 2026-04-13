import type { Metadata } from "next";
import Link from "next/link";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { Footer } from "@/components/footer";
import { PageHeroImage } from "@/components/page-hero-image";
import { BlogPostShowcase } from "@/features/blog/components/blog-post-showcase";
import { blogSource } from "@/lib/source";
import { absoluteUrl, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Blog posts about psychology, life, and technical topics. Sharing what I'm learning and thinking about.",
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
  openGraph: {
    title: "Blog | Htet Aung Lin",
    description:
      "Blog posts about psychology, life, and technical topics. Sharing what I'm learning and thinking about.",
    url: absoluteUrl("/blog"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | Htet Aung Lin",
    description:
      "Blog posts about psychology, life, and technical topics. Sharing what I'm learning and thinking about.",
  },
};

type BlogCategoryFilter = "all" | "tech" | "life";

const BLOG_CATEGORY_TABS: Array<{
  key: BlogCategoryFilter;
  label: string;
}> = [
  { key: "all", label: "All" },
  { key: "tech", label: "Tech" },
  { key: "life", label: "Life" },
];

const normalizeCategoryFilter = (
  category: string | string[] | undefined
): BlogCategoryFilter => {
  const value = Array.isArray(category) ? category[0] : category;
  return value === "tech" || value === "life" ? value : "all";
};

/* -------------------------------------------------------------------------- */

export default async function Blog(props: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const posts = blogSource.getPages();

  const { category } = await props.searchParams;

  const activeCategory = normalizeCategoryFilter(category);

  const filteredPosts = posts.filter((post) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "tech")
      return post.data.series.includes("technology");
    return post.data.series.includes("thoughts");
  });

  return (
    <>
      <PageHeroImage
        alt="Flowers"
        imageContainerClassName="md:w-sm lg:w-lg object-top -mr-16 -mt-4 md:block hidden"
        src="illustration_mijd2q.png"
      />

      <div className="mx-auto max-w-4xl px-6 pt-4 font-inter sm:pt-16 lg:px-0">
        <h1 className="bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-bold font-inter text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80">
          {" "}
          Blogs
        </h1>

        <p className="mt-2 font-medium text-base text-neutral-900/80 tracking-tight sm:max-w-xl sm:text-lg/normal dark:text-fg-tertiary">
          I write about psychology, life, and technical topics. Just sharing
          what I&apos;m learning and thinking about.
        </p>
      </div>

      <main className="relative mt-16 pb-12 sm:mt-28">
        <DashedDivider className="absolute inset-x-0 top-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 top-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 bottom-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 bottom-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-0">
          <div className="inline-flex h-8 w-full items-center">
            {BLOG_CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === activeCategory;
              const href =
                tab.key === "all" ? "/blog" : `/blog?category=${tab.key}`;

              return (
                <Link
                  className={cn(
                    "flex h-full items-center gap-1 px-3 font-black font-doto text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default sm:px-6 sm:text-base",
                    isActive
                      ? "bg-fg-default/90 text-bg-default"
                      : "text-fg-tertiary hover:text-fg-default"
                  )}
                  href={href}
                  key={tab.key}
                >
                  <i className="hidden sm:block"># </i> {tab.label}
                </Link>
              );
            })}
          </div>

          <DashedDivider
            className="-right-12 absolute inset-y-0 mt-[-5rem] mb-[-20rem] hidden opacity-40 lg:block dark:opacity-20"
            orientation="vertical"
          />

          <DashedDivider
            className="-left-12 absolute inset-y-0 mt-[-5rem] mb-[-20rem] hidden opacity-40 lg:block dark:opacity-20"
            orientation="vertical"
          />

          {filteredPosts.length === 0 && (
            <p className="py-8 text-fg-tertiary text-sm">
              No posts found for this category yet.
            </p>
          )}

          {filteredPosts.map((post, index) => (
            <FadeAnimation as="div" direction="up" key={post.url}>
              <BlogPostShowcase
                lastItem={index === filteredPosts.length - 1}
                post={post}
              />
            </FadeAnimation>
          ))}
        </div>
      </main>

      <div className="mt-40 flex w-full justify-center">
        <Footer className="max-w-4xl px-6 sm:px-0" />
      </div>
    </>
  );
}
