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
import type { Locale } from "@/lib/i18n";
import { type BlogPost, blogSource } from "@/lib/source";
import {
  getArticleStructuredData,
  getBreadcrumbStructuredData,
} from "@/lib/structured-data";
import { cn, formatDate } from "@/lib/utils";
import {
  DATE_LOCALES,
  localeBlogPath,
  myanmarFontClass,
} from "../lib/blog-locale";
import { BLOG_STRINGS } from "../lib/blog-strings";
import { LanguageSwitch } from "./language-switch";
import { getMDXComponents } from "./mdx-components";

type BlogPostViewProps = {
  post: NonNullable<BlogPost>;
  locale: Locale;
};

export const BlogPostView = ({ post, locale }: BlogPostViewProps) => {
  const Mdx = post.data.body;
  const strings = BLOG_STRINGS[locale];
  const isBurmese = locale === "my";

  const contentLang = isBurmese ? locale : undefined;
  const myanmarFont = myanmarFontClass(locale);

  // Asking the loader for the same slug in the other locale is the entire test
  // for whether a translation exists — nothing in frontmatter links the two, so
  // there is no metadata to keep in sync. Returns undefined rather than the
  // post we are already rendering only because `i18n.fallbackLanguage` is null.
  const counterpartLocale: Locale = isBurmese ? "en" : "my";
  const counterpart = blogSource.getPage(post.slugs, counterpartLocale);

  const articleStructuredData = getArticleStructuredData({
    title: post.data.title,
    description: post.data.description || "",
    datePublished: post.data.date,
    dateModified: post.data.date,
    url: post.url,
    tags: post.data.tags,
    // The content locale, not `DATE_LOCALES` — that one carries a regional
    // subtag chosen for date formatting and says nothing about the writing.
    inLanguage: locale,
  });

  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    // English in both locales: this crumb leads to the English home page.
    { name: "Home", url: "/" },
    { name: strings.breadcrumbBlog, url: localeBlogPath(locale) },
    { name: post.data.title },
  ]);

  return (
    <>
      <StructuredData data={articleStructuredData} />
      <StructuredData data={breadcrumbStructuredData} />
      <main className="blog__container">
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
          <div className="mx-auto w-full px-4 lg:px-6">
            {/* No `lang` here: the header block below carries its own, and the
                table of contents' heading is English. */}
            <div className={myanmarFont}>
              <DocsLayout
                containerProps={{
                  className:
                    "blog [&_#nd-toc_a]:data-[active=true]:!text-fg-default [&_#nd-toc_a]:data-[active=false]:!text-fg-tertiary/80 m-0 w-full [--fd-page-width:100%] [&_#nd-toc]:sticky [&_#nd-toc]:!top-20 [&_#nd-toc]:col-start-3 [&_#nd-toc]:self-start [&_#nd-toc]:!end-auto [&_#nd-toc]:!bottom-auto [&_#nd-toc]:h-[60vh] [&_#nd-toc]:w-full [&_#nd-toc]:max-w-60 [&_#nd-toc]:overflow-y-auto [&_#nd-toc]:py-12 [&_#nd-toc]:pl-6 [&_#nd-toc_a]:data-[active=false]:!text-fg-tertiary/40",
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
                    className: "max-w-3xl !px-0 xl:col-start-2",
                  }}
                  container={{
                    // One column on phones/tablets so the article spans the full
                    // width (only the wrapper's px pads it); the 1fr | 48rem | 1fr
                    // gutter grid with the TOC returns at xl.
                    className:
                      "grid grid-cols-1 items-start pe-0 relative xl:grid-cols-[minmax(0,1fr)_minmax(0,48rem)_minmax(0,1fr)] xl:gap-x-16",
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
                  {/* Photo credit + language switch live in the article column
                      too, so their width tracks the doc content exactly. */}
                  <div className="-mt-8 flex w-full items-center justify-end gap-4 text-fg-tertiary">
                    {counterpart && (
                      <LanguageSwitch
                        className="mr-auto"
                        href={counterpart.url}
                        to={counterpartLocale}
                      />
                    )}
                    <p className={cn("text-xs sm:text-sm", myanmarFont)}>
                      <span lang={contentLang}>{strings.photoBy}</span>{" "}
                      <NavLink
                        className="text-fg-brand underline"
                        href={post.data.image.author_link}
                      >
                        {post.data.image.author_name}
                      </NavLink>
                    </p>
                  </div>

                  <div className="border-b border-b-outline-secondary pb-8">
                    <div
                      className={cn(
                        "mb-2 font-medium italic tracking-normal",
                        myanmarFont ?? "font-gloria-hallelujah"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <p
                          className="text-fg-tertiary text-xs uppercase sm:text-sm"
                          lang={contentLang}
                        >
                          {post.data.series
                            .map((entry) => strings.series[entry])
                            .join(", ")}
                        </p>

                        <div className="inline-flex items-center gap-1.5 text-fg-tertiary text-xs sm:text-sm">
                          <Calendar />
                          <p>
                            {formatDate(post.data.date, {
                              includeDay: true,
                              locale: DATE_LOCALES[locale],
                            })}
                          </p>
                        </div>

                        <p
                          className="font-medium text-fg-tertiary text-xs sm:text-sm"
                          lang={contentLang}
                        >
                          {strings.authorLabel}{" "}
                          <span className="text-fg-brand" lang="en">
                            {post.data.author}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className={myanmarFont} lang={contentLang}>
                      <DocsTitle
                        className={cn(
                          "mb-1 flex items-center text-left font-semibold text-fg-default text-xl sm:text-3xl",
                          isBurmese && "my-3"
                        )}
                      >
                        {post.data.title}
                      </DocsTitle>
                      <DocsDescription className="mb-6 w-full text-left text-base text-fg-tertiary sm:text-lg">
                        {post.data.description}
                      </DocsDescription>

                      {post.data.tags && (
                        <div className="not-prose flex flex-wrap gap-2">
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

                  <DocsBody
                    className="prose dark:prose-invert"
                    lang={contentLang}
                  >
                    <Mdx components={getMDXComponents()} />
                  </DocsBody>
                </DocsPage>
              </DocsLayout>
            </div>

            <figure className="mx-auto mt-28 min-h-[24rem] max-w-3xl">
              <Comment />
            </figure>
          </div>
        </div>
      </main>
      <div className="mt-12 flex w-full justify-center">
        <Footer className="max-w-3xl px-6" />
      </div>
    </>
  );
};
