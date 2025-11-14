import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx/runtime/next";
import { blog } from "@/.source";

export const blogSource = loader({
  baseUrl: "/blog",
  source: createMDXSource(blog),
});

export const {
  getPage: getBlogPost,
  getPages: getBlogPosts,
  pageTree: pageBlogTree,
} = blogSource;

export type BlogPost = ReturnType<typeof getBlogPost>;
