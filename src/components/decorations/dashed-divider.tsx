import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type DashedDividerProps = {
  className?: string;
  maskImage?: CSSProperties["maskImage"];
  orientation?: "horizontal" | "vertical";
  stroke?: string;
};

const DEFAULT_MASK_IMAGE: Record<"horizontal" | "vertical", string> = {
  horizontal:
    "linear-gradient(to left, transparent, white 12rem, white calc(100% - 12rem), transparent)",
  vertical:
    "linear-gradient(to bottom, transparent, white 5rem, white calc(100% - 16rem), transparent)",
};

export function DashedDivider({
  className,
  maskImage,
  orientation = "horizontal",
  stroke = "currentColor",
}: DashedDividerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(isHorizontal ? "h-px" : "w-px", className)}
      style={{ maskImage: maskImage ?? DEFAULT_MASK_IMAGE[orientation] }}
    >
      <svg
        aria-hidden="true"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <line
          stroke={stroke}
          strokeDasharray="1 3"
          strokeWidth={2}
          x1={0}
          x2={isHorizontal ? "100%" : 0}
          y1={0}
          y2={isHorizontal ? 0 : "100%"}
        />
      </svg>
    </div>
  );
}
