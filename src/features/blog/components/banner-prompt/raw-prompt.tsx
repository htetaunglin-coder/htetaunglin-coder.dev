"use client";

import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { FULL_SPEC } from "../../lib/banner-prompt/spec";

const LINES = FULL_SPEC.split("\n");

const WORD_COUNT = `~${(FULL_SPEC.split(/\s+/).length / 1000).toFixed(1)}k words`;

export function RawPrompt() {
  const [isScrollable, setIsScrollable] = useState(false);
  const bodyRef = useRef<HTMLElement>(null);

  // Focus the region as it becomes scrollable, or the keyboard reader who
  // pressed the button has nothing to arrow through.
  const unlock = () => {
    setIsScrollable(true);
    bodyRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-outline-default/60 border-b pb-2">
        <span className="font-inter text-fg-tertiary text-xs">prompt.md</span>
        <span className="hidden font-inter text-fg-tertiary text-xs sm:inline-block">
          · markdown · <span className="text-fg-brand">{WORD_COUNT}</span>
        </span>
        <CopyButton
          className="ml-auto h-auto gap-1.5 px-3 py-2 text-xs [&_svg]:size-3.5"
          content={FULL_SPEC}
          label="Copy prompt"
          size="sm"
          variant="ghost"
        />
      </div>

      <div className="relative min-h-0 flex-1">
        <section
          aria-label="Full prompt"
          className={cn(
            "h-full pt-3.5 outline-none focus-visible:ring-2 focus-visible:ring-outline-brand",
            isScrollable ? "thin_scrollbar overflow-y-auto" : "overflow-hidden"
          )}
          ref={bodyRef}
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 calc(100% - 4rem), transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 calc(100% - 4rem), transparent)",
          }}
          tabIndex={isScrollable ? 0 : undefined}
        >
          <pre className="m-0 whitespace-pre-wrap pb-16 font-inter text-[13px] text-fg-secondary leading-[1.7]">
            {LINES.map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed text, never reordered
              <Line key={index} text={line} />
            ))}
          </pre>
        </section>

        {!isScrollable && (
          <button
            className="group/read-more absolute inset-x-0 bottom-0 flex h-16 cursor-pointer items-end justify-center"
            onClick={unlock}
            type="button"
          >
            <span
              className={cn(
                buttonStyles().base({ variant: "ghost", size: "sm" }),
                "inline-flex h-auto gap-1 bg-bg-secondary px-3 py-1.5 text-xs"
              )}
            >
              Read more <ArrowDown className="mt-0.5 size-3.5" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function Line({ text }: { text: string }) {
  if (text.startsWith("STEP ")) {
    return (
      <span className="font-medium text-fg-default">
        {text}
        {"\n"}
      </span>
    );
  }

  if (text.startsWith("- ")) {
    return (
      <>
        <span className="text-fg-brand">-</span>
        {text.slice(1)}
        {"\n"}
      </>
    );
  }

  return (
    <>
      {text}
      {"\n"}
    </>
  );
}
