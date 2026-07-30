import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { Calendar } from "lucide-react";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { Comment } from "@/components/comment";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/ui/nav-link";
import { getBlogStrings } from "@/features/blog/lib/blog-strings";
import type { Locale } from "@/lib/i18n";
import { type BlogPost, blogSource } from "@/lib/source";
import {
  getArticleStructuredData,
  getBreadcrumbStructuredData,
} from "@/lib/structured-data";
import { cn, formatDate } from "@/lib/utils";
import { LanguageSwitch } from "./language-switch";
import { getMDXComponents } from "./mdx-components";

type BlogPostViewProps = {
  post: NonNullable<BlogPost>;
  /**
   * Drives both the post's own words and the furniture immediately around them
   * — date, category labels, photo credit, author label. Site navigation, the
   * footer, the comment widget and the table of contents' own "On this page"
   * heading stay English, because they lead to or belong to English pages.
   */
  locale?: Locale;
};

export const BlogPostView = ({ post, locale = "en" }: BlogPostViewProps) => {
  const Mdx = post.data.body;
  const strings = getBlogStrings(locale);
  const isBurmese = locale === "my";

  // Declared on the post's own words only, so a screen reader switches voice
  // for the article and not for the English chrome wrapped around it.
  const contentLang = isBurmese ? locale : undefined;

  // Wider than `contentLang` on purpose: it also covers the table of contents,
  // whose links are the post's Burmese headings and would otherwise fall back
  // to whatever the reader's OS provides.
  const contentClassName = isBurmese ? "font-noto-sans-myanmar" : undefined;

  // Gloria Hallelujah carries no Myanmar glyphs; Burmese digits and labels set
  // in it land on the OS fallback, which on some machines is empty boxes.
  const bylineFont = isBurmese
    ? "font-noto-sans-myanmar"
    : "font-gloria-hallelujah";

  // Asking the loader for the same slug in the other locale is the entire test
  // for whether a translation exists. Nothing in frontmatter links the two, so
  // there is no linking metadata to maintain and nothing that can fall out of
  // sync — and because `i18n.fallbackLanguage` is null, this returns undefined
  // rather than handing back the post we are already rendering.
  const counterpartLocale: Locale = isBurmese ? "en" : "my";
  const counterpart = blogSource.getPage(post.slugs, counterpartLocale);

  const articleStructuredData = getArticleStructuredData({
    title: post.data.title,
    description: post.data.description || "",
    datePublished: post.data.date,
    dateModified: post.data.date,
    url: post.url,
    tags: post.data.tags,
  });

  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.data.title },
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
                alt={post.data.title}
                className="object-cover object-bottom"
                data-nimg={1}
                decoding="async"
                fetchPriority="high"
                fill
                loading="eager"
                src={post.data.image.url}
                style={{ color: "transparent" }}
                title={post.data.title}
              />
            </div>
          </figure>
          <div className="absolute top-0 left-0 z-[-1] h-[16rem] w-full bg-gradient-to-b from-bg-default/5 to-bg-default" />
        </div>

        <div className="flex w-full justify-center py-8 pt-38 text-left sm:pt-48">
          <div className="w-full max-w-6xl px-4 lg:px-6">
            <div className="-mt-8 flex w-full items-center justify-end gap-4 text-fg-tertiary">
              {/* `mr-auto` rather than `justify-between`, so a post with no
                  counterpart lays out exactly as it did before this existed. */}
              {counterpart && (
                <LanguageSwitch
                  className="mr-auto"
                  href={counterpart.url}
                  to={counterpartLocale}
                />
              )}
              <p className={cn("text-xs sm:text-sm", contentClassName)}>
                <span lang={contentLang}>{strings.photoBy}</span>{" "}
                <NavLink
                  className="text-fg-brand underline"
                  href={post.data.image.author_link}
                >
                  {post.data.image.author_name}
                </NavLink>
              </p>
            </div>
            <div className="border-b border-b-outline-secondary py-12">
              <div
                className={cn(
                  "mb-2 font-medium italic tracking-normal",
                  bylineFont
                )}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <p
                    className="text-fg-tertiary text-xs uppercase sm:text-sm"
                    lang={contentLang}
                  >
                    {/* Joined rather than rendered as a bare array: a post in
                        both categories otherwise prints them run together. */}
                    {post.data.series
                      .map((entry) => strings.series[entry])
                      .join(", ")}
                  </p>

                  <div className="inline-flex items-center gap-1.5 text-fg-tertiary text-xs sm:text-sm">
                    <Calendar />
                    <p>
                      {formatDate(post.data.date, {
                        includeDay: true,
                        locale,
                      })}
                    </p>
                  </div>

                  <p
                    className="font-medium text-fg-tertiary text-xs sm:text-sm"
                    lang={contentLang}
                  >
                    {strings.authorLabel}{" "}
                    {/* Latin in both languages on purpose, so the author entity
                        in structured data does not fragment across two spellings. */}
                    <span className="text-fg-brand" lang="en">
                      {post.data.author}
                    </span>
                  </p>
                </div>
              </div>

              <div className={contentClassName} lang={contentLang}>
                <DocsTitle className="mb-2 flex items-center text-left font-semibold text-fg-default text-xl sm:text-3xl">
                  {post.data.title}
                </DocsTitle>
                <DocsDescription className="mb-6 w-full max-w-5xl text-left text-base text-fg-tertiary sm:text-lg">
                  {post.data.description}
                </DocsDescription>

                {post.data.tags && (
                  <div className="flex flex-wrap gap-2">
                    {post.data.tags.map((tag) => (
                      <Badge
                        className="inline-flex items-center rounded-none px-2.5 pt-0 pb-1 font-gloria-hallelujah font-medium text-xs/relaxed italic tracking-normal"
                        key={tag}
                        radius="full"
                        variant="secondary"
                      >
                        # {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* No `lang` here: this wraps the table of contents, whose own
                heading is English. It goes on `DocsBody` below instead. */}
            <div className={contentClassName}>
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
                  full={post.data.full}
                  tableOfContent={{
                    style: "clerk",
                    single: false,
                  }}
                  toc={post.data.toc}
                >
                  <DocsBody
                    className="prose dark:prose-invert max-w-none"
                    lang={contentLang}
                  >
                    <Mdx components={getMDXComponents()} />
                  </DocsBody>
                </DocsPage>
              </DocsLayout>
            </div>

            <figure className="mt-28 min-h-[24rem]">
              <Comment />
            </figure>
          </div>
        </div>
      </main>
      <div className="mt-12 flex w-full justify-center">
        <Footer className="max-w-6xl px-6" />
      </div>
    </>
  );
};
