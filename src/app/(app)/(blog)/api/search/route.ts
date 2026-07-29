import { createSearchAPI } from "fumadocs-core/search/server";
import { blogSource } from "@/lib/source";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: [
    // English only — Orama has no Burmese tokenizer, and Burmese has no
    // whitespace word boundaries for the default one to split on.
    ...blogSource
      .getPages("en")
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
