import Link from "next/link";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { Footer } from "@/components/footer";
import { PageHeroImage } from "@/components/page-hero-image";
import type { Locale } from "@/lib/i18n";
import { blogSource } from "@/lib/source";
import { cn } from "@/lib/utils";
import { localeBlogPath } from "../lib/blog-locale";
import { INDEX_STRINGS } from "../lib/blog-strings";
import { BlogPostShowcase } from "./blog-post-showcase";
import { LanguageSwitch } from "./language-switch";

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
  // Scoped on purpose: an unscoped call spans every locale, which would list
  // Burmese posts on the English index and vice versa.
  const posts = blogSource
    .getPages(locale)
    // A draft is unpublished. Listing one here would hand a crawler a followed
    // link straight to a page that asks not to be indexed, and show a reader
    // writing that is not finished. Drafts stay reachable at their own URL.
    .filter((post) => !post.data.draft);

  const basePath = localeBlogPath(locale);
  const activeCategory = normalizeCategoryFilter(category);

  // Both indexes always exist, so this link can never 404. It points at the
  // unfiltered index rather than carrying `category` across: the other language
  // may have nothing in that category, and landing on an empty list reads as a
  // broken switch.
  const otherLocale: Locale = locale === "en" ? "my" : "en";
  const otherIndexPath = localeBlogPath(otherLocale);

  const categoryTabs: Array<{ key: BlogCategoryFilter; label: string }> = [
    { key: "all", label: INDEX_STRINGS.categoryAll },
    { key: "tech", label: INDEX_STRINGS.categoryTech },
    { key: "life", label: INDEX_STRINGS.categoryLife },
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

      {/* No `lang` and no locale font here or on the tabs below: this chrome is
          English on both indexes, so it inherits the document language and
          keeps the Latin faces the design pins. */}
      <div className="mx-auto max-w-4xl px-6 pt-4 font-inter sm:pt-16 lg:px-0">
        <h1 className="bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-bold font-inter text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80">
          {INDEX_STRINGS.heading}
        </h1>

        <p className="mt-2 font-medium text-base text-neutral-900/80 tracking-tight sm:max-w-xl sm:text-lg/normal dark:text-fg-tertiary">
          {INDEX_STRINGS.intro}
        </p>
      </div>

      <main className="relative mt-16 pb-12 sm:mt-28">
        <DashedDivider className="absolute inset-x-0 top-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 top-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 bottom-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 bottom-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-0">
          {/* The language control shares this row because that is where a
              reader looks for it, but it is pushed to the opposite end and
              styled as a link — it navigates to another index rather than
              filtering this one, and must not read as a third category. */}
          <div className="flex h-8 w-full items-center justify-between gap-4">
            <div className="inline-flex h-full items-center">
              {categoryTabs.map((tab) => {
                const isActive = tab.key === activeCategory;
                const href =
                  tab.key === "all"
                    ? basePath
                    : `${basePath}?category=${tab.key}`;

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

            <LanguageSwitch
              className="shrink-0 pr-3 sm:pr-6"
              href={otherIndexPath}
              to={otherLocale}
            />
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
            <p className="py-8 font-inter text-fg-tertiary text-sm">
              {INDEX_STRINGS.emptyCategory}
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
