import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type DashedDividerProps = {
  className?: string;
  maskImage?: CSSProperties["maskImage"];
  orientation?: "horizontal" | "vertical";
  stroke?: string;
};

const DEFAULT_MASK: Record<"horizontal" | "vertical", string> = {
  horizontal:
    "[mask-image:linear-gradient(to_left,transparent,white_12rem,white_calc(100%_-_12rem),transparent)]",
  vertical:
    "[mask-image:linear-gradient(to_bottom,transparent,white_5rem,white_calc(100%_-_16rem),transparent)]",
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
      className={cn(
        isHorizontal ? "h-px" : "w-px",
        maskImage ? undefined : DEFAULT_MASK[orientation],
        className
      )}
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
