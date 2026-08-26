"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

type CopyButtonProps = {
  content: string;
  /** Turns the button from icon-only into a labelled one, tooltip dropped. */
  label?: string;
  className?: string;
} & ButtonProps;

export function CopyButton({
  content: text,
  label,
  className,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, [text]);

  const button = (
    <Button
      aria-label={label ? undefined : "Copy to clipboard"}
      className={cn("pr-3 pl-2", className)}
      disabled={isCopied}
      iconOnly={!label}
      onClick={handleCopy}
      type="button"
      {...props}
    >
      {label ? (
        // Both states stack in one grid cell, so the button locks to the wider
        // label's width and never resizes mid-click. The icon rides inside each
        // layer — kept outside, it would not shift with the text, and the two
        // unequal labels ("Copy" vs "Copied") would land off-centre.
        <span className="grid">
          <span
            aria-hidden={isCopied}
            className={cn(
              "col-start-1 row-start-1 flex items-center justify-center gap-1.5",
              isCopied && "invisible"
            )}
          >
            <Copy className="size-4" />
            {label}
          </span>
          <span
            aria-hidden={!isCopied}
            className={cn(
              "col-start-1 row-start-1 flex items-center justify-center gap-1.5",
              !isCopied && "invisible"
            )}
          >
            <Check className="size-4" />
            Copied
          </span>
        </span>
      ) : isCopied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );

  // A labelled button already says what it does, so the tooltip would only
  // repeat it.
  if (label) {
    return button;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs" side="bottom">
          {isCopied ? "Copied!" : "Copy"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
