import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx/runtime/next";
import { blog } from "@/.source";
import { i18n } from "@/lib/i18n";

export const blogSource = loader({
  baseUrl: "/blog",
  i18n,
  source: createMDXSource(blog),
});

export const {
  getPage: getBlogPost,
  getPages: getBlogPosts,
  pageTree: pageBlogTree,
} = blogSource;

export type BlogPost = ReturnType<typeof getBlogPost>;

// `parser: "dir"` drops a post whose first-level directory is not a configured
// locale, with no warning — the post simply ceases to exist. Count what loaded
// against the source files and fail the build instead.
//
// This only works because `i18n.fallbackLanguage` is null. Give the locales a
// fallback and each one inherits the fallback's files, so the count can never
// drop below `blog.length` and this guard becomes a permanent no-op.
const loadedPageCount = blogSource.getPages().length;

if (loadedPageCount < blog.length) {
  throw new Error(
    `Blog content loss: ${blog.length} MDX file(s) under content/blog but only ${loadedPageCount} loaded. ` +
      `The locale parser discards posts in a first-level directory that is not one of: ${i18n.languages.join(", ")}. ` +
      "Move every post into one of those."
  );
}
