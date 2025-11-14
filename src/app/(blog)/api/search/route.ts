import { createSearchAPI } from "fumadocs-core/search/server";
import { blogSource } from "@/lib/source";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: [
    ...blogSource
      .getPages()
      .filter((page) => !page.data.draft)
      .map((page) => ({
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
        tag: "blog",
      })),
  ],
});
