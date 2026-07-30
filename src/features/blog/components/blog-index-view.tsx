import Link from "next/link";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { Footer } from "@/components/footer";
import { PageHeroImage } from "@/components/page-hero-image";
import { getBlogStrings } from "@/features/blog/lib/blog-strings";
import type { Locale } from "@/lib/i18n";
import { blogSource } from "@/lib/source";
import { cn } from "@/lib/utils";
import { BlogPostShowcase } from "./blog-post-showcase";

type BlogCategoryFilter = "all" | "tech" | "life";

type BlogIndexViewProps = {
  locale: Locale;
  category: string | string[] | undefined;
};

/**
 * The blog index, shared by `/blog` and `/my/blog`.
 *
 * Language and category are independent axes: the locale decides which posts
 * exist and what the furniture reads, the category narrows within that. Neither
 * one is expressed in terms of the other, so a category link never crosses a
 * language boundary.
 */
export const BlogIndexView = ({ locale, category }: BlogIndexViewProps) => {
  const strings = getBlogStrings(locale);

  // Scoped on purpose: an unscoped call spans every locale, which would list
  // Burmese posts on the English index and vice versa.
  const posts = blogSource.getPages(locale);

  const basePath = locale === "en" ? "/blog" : `/${locale}/blog`;
  const activeCategory = normalizeCategoryFilter(category);

  // Doto carries no Myanmar glyphs, so Burmese tab labels in it would render as
  // boxes. The tabs lose their display face on `/my/blog`; there is no Myanmar
  // equivalent to swap in.
  const displayFont = locale === "my" ? "font-noto-sans-myanmar" : "font-doto";
  const bodyFont = locale === "my" ? "font-noto-sans-myanmar" : "font-inter";

  const categoryTabs: Array<{ key: BlogCategoryFilter; label: string }> = [
    { key: "all", label: strings.categoryAll },
    { key: "tech", label: strings.categoryTech },
    { key: "life", label: strings.categoryLife },
  ];

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

      <div
        className={cn("mx-auto max-w-4xl px-6 pt-4 sm:pt-16 lg:px-0", bodyFont)}
        lang={locale}
      >
        <h1
          className={cn(
            "bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-bold text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80",
            bodyFont
          )}
        >
          {strings.indexTitle}
        </h1>

        <p className="mt-2 font-medium text-base text-neutral-900/80 tracking-tight sm:max-w-xl sm:text-lg/normal dark:text-fg-tertiary">
          {strings.indexIntro}
        </p>
      </div>

      <main className="relative mt-16 pb-12 sm:mt-28">
        <DashedDivider className="absolute inset-x-0 top-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 top-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 bottom-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 bottom-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-0">
          <div className="inline-flex h-8 w-full items-center">
            {categoryTabs.map((tab) => {
              const isActive = tab.key === activeCategory;
              const href =
                tab.key === "all"
                  ? basePath
                  : `${basePath}?category=${tab.key}`;

              return (
                <Link
                  className={cn(
                    "flex h-full items-center gap-1 px-3 font-black text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default sm:px-6 sm:text-base",
                    displayFont,
                    isActive
                      ? "bg-fg-default/90 text-bg-default"
                      : "text-fg-tertiary hover:text-fg-default"
                  )}
                  href={href}
                  key={tab.key}
                  lang={locale}
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
            <p
              className={cn("py-8 text-fg-tertiary text-sm", bodyFont)}
              lang={locale}
            >
              {strings.emptyCategory}
            </p>
          )}

          {filteredPosts.map((post, index) => (
            <FadeAnimation as="div" direction="up" key={post.url}>
              <BlogPostShowcase
                lastItem={index === filteredPosts.length - 1}
                locale={locale}
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
};

const normalizeCategoryFilter = (
  category: string | string[] | undefined
): BlogCategoryFilter => {
  const value = Array.isArray(category) ? category[0] : category;
  return value === "tech" || value === "life" ? value : "all";
};
