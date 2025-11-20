import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { NavLink } from "@/components/ui/nav-link";
import { YoutubeIframe } from "@/components/youtube-iframe";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    CloudinaryImage,
    YoutubeIframe,
    a: NavLink,
  };
}
