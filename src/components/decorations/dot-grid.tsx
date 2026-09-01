import { cn } from "@/lib/utils";

type DotGridProps = {
  className?: string;
  /** Without a fade the field reaches the edges and reads as a void. */
  fade?: string;
};

const LATTICE_TILE = "30px 27px";

/* A 10x9 lattice of 2x1 dots, tiled 3x3 per stencil. */
const DOT_STENCIL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='27' fill='none'><path fill='black' d='M20 0h2v.993h-2V0ZM10 0h2v.993h-2V0ZM0 0h2v.993H0V0Zm20 8.993h2v1h-2v-1Zm-10 0h2v1h-2v-1Zm-10 0h2v1H0v-1Zm20 9h2v1h-2v-1Zm-10 0h2v1h-2v-1Zm-10 0h2v1H0v-1Z'/></svg>\")";

export const DOT_FADE =
  "radial-gradient(circle at 50% 46%, black 34%, transparent 74%)";

export function DotGrid({ className, fade = DOT_FADE }: DotGridProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ WebkitMaskImage: fade, maskImage: fade }}
    >
      <div
        className={cn(
          "absolute inset-0 bg-fg-tertiary opacity-25 dark:opacity-15",
          className
        )}
        style={{
          WebkitMaskImage: DOT_STENCIL,
          WebkitMaskRepeat: "repeat",
          WebkitMaskSize: LATTICE_TILE,
          maskImage: DOT_STENCIL,
          maskRepeat: "repeat",
          maskSize: LATTICE_TILE,
        }}
      />
    </div>
  );
}
