import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DashedDivider } from "./dashed-divider";

type Edge = "top" | "right" | "bottom" | "left";

type DashedFrameProps = {
  children: ReactNode;
  className?: string;
  /** Drop an edge a neighbour already draws — a tab list's own rule, say. */
  edges?: Edge[];
  /**
   * How far each line fades in from its ends. `min()` so a short edge fades
   * proportionally instead of vanishing: a fixed 6rem inset on a 6rem-wide box
   * masks the whole line away.
   */
  fade?: string;
  /** Per-edge overrides — opacity, or negative margins to bleed past the box. */
  classNames?: Partial<Record<Edge, string>>;
};

/**
 * Four gradient-masked dashed lines drawn on the inside edges of a box. The
 * lines are absolute, so they cost no layout and never overflow the frame; a
 * caller that wants them to bleed outward opts in per edge via `classNames`.
 */
export function DashedFrame({
  children,
  className,
  edges = ALL_EDGES,
  fade = "min(6rem, 20%)",
  classNames,
}: DashedFrameProps) {
  return (
    <div className={cn("relative", className)}>
      {edges.map((edge) => {
        const isHorizontal = edge === "top" || edge === "bottom";

        return (
          <DashedDivider
            className={cn(
              "absolute opacity-40 dark:opacity-20",
              EDGE_POSITION[edge],
              classNames?.[edge]
            )}
            key={edge}
            maskImage={`linear-gradient(to ${isHorizontal ? "right" : "bottom"}, transparent, white ${fade}, white calc(100% - ${fade}), transparent)`}
            orientation={isHorizontal ? "horizontal" : "vertical"}
          />
        );
      })}

      {children}
    </div>
  );
}

const ALL_EDGES: Edge[] = ["top", "right", "bottom", "left"];

const EDGE_POSITION: Record<Edge, string> = {
  top: "inset-x-0 top-0",
  right: "inset-y-0 right-0",
  bottom: "inset-x-0 bottom-0",
  left: "inset-y-0 left-0",
};
