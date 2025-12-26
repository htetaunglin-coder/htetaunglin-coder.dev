import type { MetadataRoute } from "next";
import { PROJECT_DATA } from "@/features/projects/data";
import { blogSource } from "@/lib/source";

export const revalidate = false;

// biome-ignore lint/suspicious/useAwait: off
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string =>
    new URL(path, process.env.NEXT_PUBLIC_APP_URL).toString();

  const blogs = blogSource.getPages().map(
    (page) =>
      ({
        url: url(page.url),
        lastModified: page.data.date || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }) as MetadataRoute.Sitemap[number]
  );

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
