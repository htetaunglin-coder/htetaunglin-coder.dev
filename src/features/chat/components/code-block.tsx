"use client";

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactElement } from "react";
import { cloneElement, useEffect, useState } from "react";
import {
  type BundledLanguage,
  type CodeOptionsMultipleThemes,
  codeToHtml,
} from "shiki/bundle-web.mjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type { BundledLanguage } from "shiki/bundle-web.mjs";

const lineNumberClassNames = cn(
  "[&_code]:[counter-reset:line]",
  "[&_code]:[counter-increment:line_0]",
  "[&_.line]:before:content-[counter(line)]",
  "[&_.line]:before:inline-block",
  "[&_.line]:before:[counter-increment:line]",
  "[&_.line]:before:w-4",
  "[&_.line]:before:mr-4",
  "[&_.line]:before:text-[13px]",
  "[&_.line]:before:text-right",
  "[&_.line]:before:text-fg-tertiary/50",
  "[&_.line]:before:font-mono",
  "[&_.line]:before:select-none"
);

// eslint-disable-next-line
const darkModeClassNames = cn(
  "dark:[&_.shiki]:!text-[var(--shiki-dark)]",
  "dark:[&_.shiki]:!bg-[var(--shiki-dark-bg)]",
  "dark:[&_.shiki]:![font-style:var(--shiki-dark-font-style)]",
  "dark:[&_.shiki]:![font-weight:var(--shiki-dark-font-weight)]",
  "dark:[&_.shiki]:![text-decoration:var(--shiki-dark-text-decoration)]",
  "dark:[&_.shiki_span]:!text-[var(--shiki-dark)]",
  "dark:[&_.shiki_span]:![font-style:var(--shiki-dark-font-style)]",
  "dark:[&_.shiki_span]:![font-weight:var(--shiki-dark-font-weight)]",
  "dark:[&_.shiki_span]:![text-decoration:var(--shiki-dark-text-decoration)]"
);

const lineHighlightClassNames = cn(
  "[&_.line.highlighted]:bg-blue-50",
  "[&_.line.highlighted]:after:bg-blue-500",
  "[&_.line.highlighted]:after:absolute",
  "[&_.line.highlighted]:after:left-0",
  "[&_.line.highlighted]:after:top-0",
  "[&_.line.highlighted]:after:bottom-0",
  "[&_.line.highlighted]:after:w-0.5",
  "dark:[&_.line.highlighted]:!bg-blue-500/10"
);

const lineDiffClassNames = cn(
  "[&_.line.diff]:after:absolute",
  "[&_.line.diff]:after:left-0",
  "[&_.line.diff]:after:top-0",
  "[&_.line.diff]:after:bottom-0",
  "[&_.line.diff]:after:w-0.5",
  "[&_.line.diff.add]:bg-emerald-50",
  "[&_.line.diff.add]:after:bg-emerald-500",
  "[&_.line.diff.remove]:bg-rose-50",
  "[&_.line.diff.remove]:after:bg-rose-500",
  "dark:[&_.line.diff.add]:!bg-emerald-500/10",
  "dark:[&_.line.diff.remove]:!bg-rose-500/10"
);

const lineFocusedClassNames = cn(
  "[&_code:has(.focused)_.line]:blur-[2px]",
  "[&_code:has(.focused)_.line.focused]:blur-none"
);

const wordHighlightClassNames = cn(
  "[&_.highlighted-word]:bg-blue-50",
  "dark:[&_.highlighted-word]:!bg-blue-500/10"
);

const codeBlockClassName = cn(
  "mt-0 bg-bg-default-alt text-sm",
  "[&_pre]:py-4",
  "[&_.shiki]:!bg-[var(--shiki-bg)]",
  "[&_.shiki]:h-full",
  "[&_pre]:overflow-auto",
  "[&_code]:w-full",
  "[&_code]:grid",
  "[&_code]:bg-transparent",
  "[&_.line]:px-4",
  "[&_.line]:w-full",
  "[&_.line]:relative"
);

const highlight = (
  html: string,
  language?: BundledLanguage,
  themes?: CodeOptionsMultipleThemes["themes"]
) =>
  codeToHtml(html, {
    lang: language ?? "typescript",
    themes: themes ?? {
      light: "github-light",
      dark: "github-dark-default",
    },
    transformers: [
      transformerNotationDiff({
        matchAlgorithm: "v3",
      }),
      transformerNotationHighlight({
        matchAlgorithm: "v3",
      }),
      transformerNotationWordHighlight({
        matchAlgorithm: "v3",
      }),
      transformerNotationFocus({
        matchAlgorithm: "v3",
      }),
      transformerNotationErrorLevel({
        matchAlgorithm: "v3",
      }),
    ],
  });

/* -------------------------------------------------------------------------- */

type CodeBlockProps = ComponentProps<"div">;

const CodeBlock = ({ className, children, ...props }: CodeBlockProps) => (
  <div
    className={cn("size-full overflow-hidden rounded-md border", className)}
    {...props}
  >
    {children}
  </div>
);

export type CodeBlockContentProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: BundledLanguage;
  themes?: CodeOptionsMultipleThemes["themes"];
  syntaxHighlighting?: boolean;
  lineNumbers?: boolean;
  className?: string;
};

const CodeBlockContent = ({
  code,
  language,
  themes,
  syntaxHighlighting = true,
  lineNumbers = true,
  className,
}: CodeBlockContentProps) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!syntaxHighlighting) {
      return;
    }

    highlight(code, language, themes).then(setHtml).catch(console.error);
  }, [code, language, themes, syntaxHighlighting]);

  if (!(syntaxHighlighting && html)) {
    return (
      <pre className={cn("w-full", className)}>
        <code>
          {code.split("\n").map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: off
            <span className="line" key={i}>
              {line}
            </span>
          ))}
        </code>
      </pre>
    );
  }

  return (
    <div
      className={cn(
        codeBlockClassName,
        lineHighlightClassNames,
        lineDiffClassNames,
        lineFocusedClassNames,
        wordHighlightClassNames,
        darkModeClassNames,
        lineNumbers && lineNumberClassNames,
        "code-block-content"
      )}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: off */}
      <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  code: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

const CodeBlockCopyButton = ({
  asChild,
  code,
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    }, onError);
  };

  if (asChild) {
    return cloneElement(children as ReactElement, {
      // @ts-expect-error - we know this is a button
      onClick: copyToClipboard,
    });
  }

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn("shrink-0", className)}
      iconOnly
      onClick={copyToClipboard}
      variant="ghost"
      {...props}
    >
      {children ?? <Icon className="text-fg-tertiary" size={14} />}
      <div className="sr-only">Copy</div>
    </Button>
  );
};

export { CodeBlock, CodeBlockContent, CodeBlockCopyButton };
