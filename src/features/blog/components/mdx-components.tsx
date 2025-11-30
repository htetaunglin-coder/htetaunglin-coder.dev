import {
  Accordion as FumadocsAccordion,
  Accordions as FumadocsAccordions,
} from "fumadocs-ui/components/accordion";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { NavLink } from "@/components/ui/nav-link";
import { YoutubeIframe } from "@/components/youtube-iframe";
import { cn } from "@/lib/utils";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    CloudinaryImage,
    YoutubeIframe,
    a: NavLink,
    Accordions,
    Accordion,
  };
}

const Accordions = ({
  className,
  ...props
}: React.ComponentProps<typeof FumadocsAccordions>) => (
  <FumadocsAccordions
    className={cn("border-none bg-transparent", className)}
    {...props}
  />
);

const Accordion = ({
  className,
  ...props
}: React.ComponentProps<typeof FumadocsAccordion>) => (
  <FumadocsAccordion
    className={cn(
      "[&_button]:[&_svg]:!size-4.5 rounded-none [&>div:first-of-type]:bg-bg-secondary [&_button]:flex-row-reverse [&_button]:justify-between [&_h3]:bg-bg-secondary/40",
      className
    )}
    {...props}
  />
);
