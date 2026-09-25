"use client";

import { CodeBlock } from "fumadocs-ui/components/codeblock";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { Terminal } from "lucide-react";
import type { ReactNode } from "react";
import { Icons } from "@/components/icons";
import { NavLink } from "@/components/ui/nav-link";
import { cn } from "@/lib/utils";

type InstallCodeBlockProps = {
  children: ReactNode;
  githubUrl: string;
  className?: string;
};

export function InstallCodeBlock({
  children,
  githubUrl,
  className,
}: InstallCodeBlockProps) {
  return (
    <CodeBlock
      Actions={({ className: actionsClassName, children: copyButton }) => (
        <div className={cn("flex items-center", actionsClassName)}>
          <NavLink
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-fd-muted-foreground! underline hover:text-fd-accent-foreground"
            )}
            href={githubUrl}
          >
            <Icons.github aria-hidden="true" className="size-3.5" />
            Github
          </NavLink>
          {copyButton}
        </div>
      )}
      className={className}
      icon={<Terminal />}
      title="Installation"
    >
      {children}
    </CodeBlock>
  );
}
