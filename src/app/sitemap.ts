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
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      }) as MetadataRoute.Sitemap[number]
  );

  const projects = PROJECT_DATA.map(
    (project) =>
      ({
        url: url(`/projects/${project.id}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      }) as MetadataRoute.Sitemap[number]
  );

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/projects"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/chat"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/resume"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/blogs"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/side-quest"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: url("/about"),
      changeFrequency: "monthly",
      priority: 0.3,
    },

    ...blogs.filter((v) => v !== undefined),
    ...projects.filter((v) => v !== undefined),
  ];
}
