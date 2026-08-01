import type { MetadataRoute } from "next";
import {
  BLOG_INDEX_ALTERNATES,
  postAlternates,
} from "@/features/blog/lib/blog-locale";
import { PROJECT_DATA } from "@/features/projects/data";
import { appUrl } from "@/lib/site-config";
import { blogSource } from "@/lib/source";

export const revalidate = false;

// biome-ignore lint/suspicious/useAwait: off
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, appUrl).toString();

  // Deliberately unscoped: the sitemap wants every locale, and `page.url`
  // already carries the right prefix. Do not add a locale argument here.
  const blogs = blogSource
    .getPages()
    // Drafts render as `noindex`; submitting them here would ask Google to
    // index a page that tells it not to. `api/search/route.ts` filters the same.
    .filter((page) => !page.data.draft)
    .map(
      (page) =>
        ({
          url: url(page.url),
          lastModified: page.data.date || new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
          // A second channel for what the pages already declare in `<link>`
          // tags: a crawler that reads the sitemap before fetching either page
          // learns the pair from here. The two must not disagree, which is why
          // both go through `postAlternates`.
          alternates: { languages: postAlternates(page.slugs) },
        }) as MetadataRoute.Sitemap[number]
    );

  // Scoped, unlike `blogs` above: that list spans both locales, so borrowing an
  // entry from it would date the Burmese index from an English post.
  const burmesePosts = blogSource
    .getPages("my")
    .filter((page) => !page.data.draft);

  const projects = PROJECT_DATA.map(
    (project) =>
      ({
        url: url(`/projects/${project.id}`),
        lastModified: project.timeline.endDate || project.timeline.startDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }) as MetadataRoute.Sitemap[number]
  );

  return [
    {
      url: url("/"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: url("/blog"),
      lastModified: blogs.length > 0 ? blogs[0]?.lastModified : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: BLOG_INDEX_ALTERNATES },
    },
    {
      url: url("/my/blog"),
      lastModified: burmesePosts[0]?.data.date ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: BLOG_INDEX_ALTERNATES },
    },
    {
      url: url("/projects"),
      lastModified:
        projects.length > 0 ? projects[0]?.lastModified : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: url("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: url("/resume"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: url("/chat"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: url("/side-quests"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },

    ...blogs.filter((v) => v !== undefined),
    ...projects.filter((v) => v !== undefined),
  ];
}
