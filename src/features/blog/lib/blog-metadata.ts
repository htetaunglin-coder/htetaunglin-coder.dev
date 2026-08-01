import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCldOgImageUrl } from "next-cloudinary";
import type { Locale } from "@/lib/i18n";
import { blogSource } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";
import {
  BLOG_INDEX_ALTERNATES,
  localeBlogPath,
  postAlternates,
} from "./blog-locale";
import { BLOG_INTRO } from "./blog-strings";

/**
 * Every difference between the two post routes' metadata, in one place: the
 * social image, and whether an `og:locale` is declared. Everything else is the
 * post's own frontmatter and reads the same in both languages.
 */
export function postMetadata(locale: Locale, slug: string): Metadata {
  const page = blogSource.getPage([slug], locale);

  if (!page) {
    notFound();
  }

  const blog = page.data;

  if (!(blog.title && blog.description)) {
    notFound();
  }

  const pageUrl = absoluteUrl(page.url);
  const ogImageUrl = ogImage(locale, {
    title: blog.title,
    description: blog.description,
    imageUrl: blog.image.url,
  });

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.tags || [],
    // A draft is unpublished writing. It still renders, so the author can read
    // it at its real URL, but it must not be indexed there. `follow` so the
    // links out of it still count.
    robots: blog.draft ? { index: false, follow: true } : undefined,
    alternates: {
      // Always the page itself, never its counterpart: folding the two into one
      // result would undo the point of giving Burmese its own addresses.
      canonical: pageUrl,
      languages: postAlternates(page.slugs),
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      locale: OG_LOCALE[locale],
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

/** Both indexes, which differ only in title, path and declared `og:locale`. */
export function indexMetadata(locale: Locale): Metadata {
  const title = INDEX_TITLES[locale];
  const socialTitle = `${title} | Htet Aung Lin`;
  const indexUrl = absoluteUrl(localeBlogPath(locale));

  return {
    title,
    description: BLOG_INTRO,
    alternates: {
      // Each index points at itself: the two list different posts, so
      // collapsing them into one result would hide the Burmese one.
      canonical: indexUrl,
      languages: BLOG_INDEX_ALTERNATES,
    },
    openGraph: {
      title: socialTitle,
      description: BLOG_INTRO,
      url: indexUrl,
      type: "website",
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description: BLOG_INTRO,
    },
  };
}

/**
 * English titles for both, matching the chrome each index actually renders — a
 * Burmese title in a search result would promise a Burmese page and deliver an
 * English one. Distinct rather than both "Blog", because they are separate
 * indexed URLs and identical titles give a reader no way to tell them apart.
 */
const INDEX_TITLES: Record<Locale, string> = {
  en: "Blog",
  my: "Blog in Burmese",
};

/**
 * Partial because English declares none, and never has: a page's `openGraph`
 * replaces the root layout's wholesale rather than merging into it, so the
 * site-wide `en_US` has never reached a blog page. Left alone here — adding it
 * is a crawler-visible change that belongs in its own commit.
 */
const OG_LOCALE: Partial<Record<Locale, string>> = {
  my: "my_MM",
};

/**
 * English titles are drawn into the image by `/og`. Burmese cannot be: that
 * renderer ships shaping for Latin and Arabic only, so Burmese comes out as
 * boxes, or — once a Myanmar font is supplied — as malformed script, with
 * medials detached, viramas visible and prefix vowels unreordered. A picture
 * with no words beats words spelled wrong, so Burmese gets the bare cover.
 */
function ogImage(
  locale: Locale,
  post: { title: string; description: string; imageUrl: string }
): string {
  if (locale === "my") {
    return getCldOgImageUrl({ src: post.imageUrl, width: 1200, height: 630 });
  }

  return absoluteUrl(
    `/og?title=${encodeURIComponent(
      post.title
    )}&description=${encodeURIComponent(post.description)}&img_url=${encodeURIComponent(post.imageUrl)}&&blog=true`
  );
}
