"use client";

import { CodeBlock } from "fumadocs-ui/components/codeblock";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { Github } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "@/components/ui/nav-link";
import { cn } from "@/lib/utils";

type GistCodeBlockProps = {
  children: ReactNode;
  gistUrl: string;
  title: string;
};

export function GistCodeBlock({
  children,
  gistUrl,
  title,
}: GistCodeBlockProps) {
  return (
    <CodeBlock
      Actions={({ className, children: copyButton }) => (
        <div className={cn("flex items-center", className)}>
          <NavLink
            aria-label="Open this spec as a GitHub Gist"
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-fd-muted-foreground! underline hover:text-fd-accent-foreground"
            )}
            href={gistUrl}
            rel="noreferrer"
            target="_blank"
            title="Open as a GitHub Gist"
          >
            <Github /> Github Gist
          </NavLink>
          {copyButton}
        </div>
      )}
      title={title}
    >
      {children}
    </CodeBlock>
  );
}
