import type React from "react";

type BasicMarkdownToken = {
  type: "text" | "bold" | "italic" | "underline" | "code" | "break";
  content: string;
  id: string;
};

const tokenize = (text: string): BasicMarkdownToken[] => {
  const tokens: BasicMarkdownToken[] = [];
  let tokenCounter = 0; // For generating unique IDs

  // Split by line breaks first to preserve paragraph structure
  const lines = text.split("\n");

  lines.forEach((line, lineIndex) => {
    let remaining = line;

    const patterns = [
      { type: "bold" as const, regex: /\*\*(.+?)\*\*/g },
      { type: "italic" as const, regex: /\*(.+?)\*/g },
      { type: "underline" as const, regex: /__(.+?)__/g },
      { type: "code" as const, regex: /`(.+?)`/g },
    ];

    while (remaining.length > 0) {
      let earliestMatch: {
        index: number;
        length: number;
        type: BasicMarkdownToken["type"];
        content: string;
      } | null = null;

      // Find the earliest pattern match
      for (const pattern of patterns) {
        const match = pattern.regex.exec(remaining);
        if (
          match &&
          (earliestMatch === null || match.index < earliestMatch.index)
        ) {
          earliestMatch = {
            index: match.index,
            length: match[0].length,
            type: pattern.type,
            content: match[1],
          };
        }
        pattern.regex.lastIndex = 0;
      }

      if (earliestMatch) {
        // Add text before the match
        if (earliestMatch.index > 0) {
          tokens.push({
            type: "text",
            content: remaining.slice(0, earliestMatch.index),
            id: `token-${tokenCounter++}`,
          });
        }

        // Add the matched token
        tokens.push({
          type: earliestMatch.type,
          content: earliestMatch.content,
          id: `token-${tokenCounter++}`,
        });

        remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
      } else {
        // No more matches, add remaining text
        if (remaining.length > 0) {
          tokens.push({
            type: "text",
            content: remaining,
            id: `token-${tokenCounter++}`,
          });
        }
        break;
      }
    }

    // Add line break after each line except the last
    if (lineIndex < lines.length - 1) {
      tokens.push({
        type: "break",
        content: "",
        id: `token-${tokenCounter++}`,
      });
    }
  });

  return tokens;
};

/**
 * Render a single token with appropriate styling
 */
const renderToken = (token: BasicMarkdownToken): React.ReactNode => {
  switch (token.type) {
    case "bold":
      return (
        <strong className="font-semibold" key={token.id}>
          {token.content}
        </strong>
      );
    case "italic":
      return (
        <em className="italic" key={token.id}>
          {token.content}
        </em>
      );
    case "underline":
      return (
        <span className="underline" key={token.id}>
          {token.content}
        </span>
      );
    case "code":
      return (
        <code
          className="rounded bg-bg-tertiary px-1.5 py-0.5 font-mono text-sm"
          key={token.id}
        >
          {token.content}
        </code>
      );
    case "break":
      return <br key={token.id} />;
    case "text":
    default:
      return token.content;
  }
};

/**
 * Parse and render markdown text
 * @param text - Text with markdown syntax
 * @returns React nodes with styled elements
 */
export const parseBasicMarkdown = (text: string): React.ReactNode[] => {
  const tokens = tokenize(text);
  return tokens.map((token) => renderToken(token));
};

/**
 * A lightweight Markdown parser for basic inline formatting.
 *
 * Handles:
 * - **Bold** (`**text**`)
 * - *Italic* (`*text*`)
 * - __Underline__ (`__text__`)
 * - `Inline code` (`` `text` ``)
 * - Line breaks (`\n`)
 *
 * For complex content (blogs, docs), use `react-markdown` instead.
 */
export const BasicMarkdown = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const content = parseBasicMarkdown(children);

  return <span className={className}>{content}</span>;
};
