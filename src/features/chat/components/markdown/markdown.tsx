// biome-ignore-all lint/performance/useTopLevelRegex: off

"use client";

import type { HTMLAttributes } from "react";
import React, { memo, useId, useMemo } from "react";
import ReactMarkdown, { type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { getIconForFilename } from "@/components/file-name-icon-map";
import { cn } from "@/lib/utils";
import {
  type BundledLanguage,
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "../code-block";
import { parseMarkdownIntoBlocks } from "./parse-block";
import { parseIncompleteMarkdown } from "./parse-incomplete-markdown";
import remarkYoutubePlugin from "./remark-youtube";

const MarkdownComponents: Options["components"] = {
  h1: ({ node: _, ...props }) => (
    <h1 className="font-semibold text-2xl sm:text-3xl" {...props} />
  ),
  h2: ({ node: _, ...props }) => (
    <h2 className="font-semibold text-xl sm:text-2xl" {...props} />
  ),
  h3: ({ node: _, ...props }) => (
    <h3 className="font-semibold text-lg sm:text-xl" {...props} />
  ),
  h4: ({ node: _, ...props }) => (
    <h4 className="font-semibold text-md sm:text-lg" {...props} />
  ),
  h5: ({ node: _, ...props }) => (
    <h5 className="font-semibold text-base" {...props} />
  ),
  h6: ({ node: _, ...props }) => (
    <h6 className="font-semibold text-sm" {...props} />
  ),
  pre: ({ node: _, className, ...props }) => (
    <pre className={cn("not-prose w-full", className)} {...props} />
  ),

  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const codeContent = String(children).replace(/\n$/, "");

    if (match) {
      let filename: string | null = null;
      if (node?.data?.meta) {
        const metaString = node.data.meta as string;
        const filenameMatch = metaString.match(/filename=["']([^"]+)["']/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      return (
        <FencedCodeBlock
          code={codeContent}
          filename={filename}
          language={match[1]}
        />
      );
    }

    return (
      <code
        className={cn(
          "whitespace-pre-wrap break-all rounded-md bg-bg-tertiary px-1.5 py-0.5 text-sm",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
};

/* -------------------------------------------------------------------------- */

type BlockProps = Options & {
  content: string;
};

const PureBlock = ({ content, ...props }: BlockProps) => {
  const parsedContent = useMemo(
    () =>
      typeof content === "string"
        ? parseIncompleteMarkdown(content.trim())
        : content,
    [content]
  );

  return <ReactMarkdown {...props}>{parsedContent}</ReactMarkdown>;
};

const Block = memo(
  PureBlock,
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

/* -------------------------------------------------------------------------- */

export type MarkdownProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options;
  children: Options["children"];
};

const PureMarkdown = ({
  className,
  options,
  children,
  ...props
}: MarkdownProps) => {
  const blocks = useMemo(
    () => parseMarkdownIntoBlocks(typeof children === "string" ? children : ""),
    [children]
  );
  const generatedId = useId();

  return (
    <div
      className={cn(
        "markdown size-full max-w-[var(--chat-view-max-width)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    >
      {blocks.map((block, index) => (
        <Block
          components={{ ...MarkdownComponents, ...options?.components }}
          content={block}
          // biome-ignore lint/suspicious/noArrayIndexKey: off
          key={`${generatedId}-block-${index}`}
          remarkPlugins={[remarkGfm, remarkYoutubePlugin]}
          {...options}
        />
      ))}
    </div>
  );
};
export const Markdown = memo(
  PureMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

/* -------------------------------------------------------------------------- */

type FencedCodeBlockProps = {
  language: string;
  filename: string | null;
  code: string;
};

const PureFencedCodeBlock = ({
  language,
  filename,
  code,
}: FencedCodeBlockProps) => (
  <CodeBlock className="not-prose relative my-4 max-h-[32.5rem] w-full overflow-y-auto md:max-w-lg lg:max-w-none">
    {filename && (
      <div className="flex items-center justify-between border-b bg-bg-tertiary/50 px-4 py-2">
        <div className="flex items-center gap-2">
          {getIconForFilename(filename) && (
            <div className="flex size-4 items-center justify-center">
              {/* biome-ignore lint/style/noNonNullAssertion: off */}
              {React.createElement(getIconForFilename(filename)!, { size: 14 })}
            </div>
          )}
          <span className="font-medium text-fg-tertiary text-sm">
            {filename}
          </span>
        </div>
        <CodeBlockCopyButton code={code} size="sm" />
      </div>
    )}

    {!filename && (
      <CodeBlockCopyButton
        className="absolute top-2 right-2 z-10"
        code={code}
        size="sm"
      />
    )}

    <CodeBlockContent
      className="text-sm"
      code={code}
      language={language as BundledLanguage}
      lineNumbers={true}
      syntaxHighlighting={true}
    />
  </CodeBlock>
);

const FencedCodeBlock = memo(PureFencedCodeBlock);
