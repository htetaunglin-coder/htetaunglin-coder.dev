import { cn } from "@/lib/utils";

type DashedLineProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
  color?: string;
};

export function DashedLine({
  orientation = "horizontal",
  className,
  color = "currentColor",
}: DashedLineProps) {
  const isHorizontal = orientation === "horizontal";

  const gradientDirection = isHorizontal ? "to right" : "to bottom";
  const maskImage = `linear-gradient(${gradientDirection}, transparent, white 5rem, white calc(100% - 5rem), transparent)`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        isHorizontal ? "sm:bottom-px" : "sm:right-px",
        className
      )}
    >
      <div
        className={cn(
          "absolute",
          isHorizontal
            ? "inset-x-0 bottom-1/2 h-px translate-y-1/2"
            : "inset-y-0 right-1/2 w-px translate-x-1/2"
        )}
      >
        <div
          className={cn(
            "absolute",
            isHorizontal
              ? "inset-x-0 mt-0.5 mr-[-5rem] ml-[-5rem] h-1"
              : "inset-y-0 mt-[-2.5rem] mb-[-2.5rem] w-px",
            "opacity-35 dark:opacity-15"
          )}
          style={{ maskImage }}
        >
          <svg
            aria-hidden="true"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <line
              stroke={color}
              strokeDasharray="1 3"
              strokeWidth={2}
              x1={isHorizontal ? 0 : "50%"}
              x2={isHorizontal ? "100%" : "50%"}
              y1={isHorizontal ? "50%" : 0}
              y2={isHorizontal ? "50%" : "100%"}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
