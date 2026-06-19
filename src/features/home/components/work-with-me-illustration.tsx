"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* pixloader — brew loader. Pixel-art coffee mug with animated rising steam,
   drawn on a 48x48 grid and scaled up crisp. Color comes from the theme (the
   canvas `color`) and is applied via globalAlpha per pixel, so it stays
   monotone and adapts to light/dark. */

const E = 48; // logical grid

// handle pixels (the rest of the mug is generated with loops below)
const HANDLE: ReadonlyArray<readonly [number, number]> = [
  [4, 0],
  [5, 0],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [4, 4],
  [4, 1],
  [4, 3],
];

const STEAM = [
  { phOff: 0, speed: 0.000_75, x: -1.5 },
  { phOff: 2.2, speed: 0.0007, x: 0 },
  { phOff: 4.4, speed: 0.0008, x: 1.5 },
];

const draw = (ctx: CanvasRenderingContext2D, e: number, t: number) => {
  ctx.clearRect(0, 0, e, e);
  const o = e / 2;
  const h = e > 30 ? 2 : 1;
  const plot = (x: number, y: number, a: number) => {
    ctx.globalAlpha = a;
    ctx.fillRect(Math.round(o + x * h), Math.round(o + y * h), h, h);
  };

  // mug body
  for (let y = 0; y <= 3; y++) {
    for (let x = -3; x <= 3; x++) {
      plot(x, y, 0.62);
    }
  }
  // rim
  for (let x = -3; x <= 3; x++) {
    plot(x, -1, 0.72);
  }
  // base
  for (let x = -2; x <= 2; x++) {
    plot(x, 4, 0.65);
  }
  // handle
  for (const [x, y] of HANDLE) {
    plot(x, y, 0.58);
  }
  // coffee surface
  for (let x = -2; x <= 2; x++) {
    plot(x, 0, 0.82);
  }

  // steam
  const i = e > 30 ? 11 : 7;
  for (const col of STEAM) {
    const m = t * col.speed + col.phOff;
    const f = (Math.sin(m) + 1) / 2;
    const d = Math.round(f * i);
    for (let s = 0; s <= d; s++) {
      const frac = s / i;
      const wob = 1.5 * Math.sin(1.2 * m + frac * Math.PI * 1.8);
      const alpha = (1 - frac) * 0.48 * f;
      if (alpha <= 0.03) {
        continue;
      }
      plot(col.x + wob, -2 - s, alpha);
      if (s > 0) {
        const prevWob =
          1.5 * Math.sin(1.2 * m + (frac - 1 / i) * Math.PI * 1.8);
        if (Math.abs(Math.round((wob - prevWob) * h)) > h) {
          plot(col.x + (wob + prevWob) / 2, -2 - s, 0.65 * alpha);
        }
      }
    }
  }

  ctx.globalAlpha = 1;
};

type PixelCoffeeProps = { size?: number };

const PixelCoffee = ({ size = 120 }: PixelCoffeeProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!(cv && ctx)) {
      return;
    }

    const sc = window.devicePixelRatio || 2;
    cv.width = E * sc;
    cv.height = E * sc;
    ctx.scale(sc, sc);

    let color = getComputedStyle(cv).color;
    const observer = new MutationObserver(() => {
      color = getComputedStyle(cv).color;
    });
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      ctx.fillStyle = color;
      draw(ctx, E, 1500);
      return () => observer.disconnect();
    }

    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      ctx.fillStyle = color;
      draw(ctx, E, performance.now() - t0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      aria-hidden
      className="relative text-fg-tertiary/40"
      height={E}
      ref={ref}
      style={{ height: size, imageRendering: "pixelated", width: size }}
      width={E}
    />
  );
};

const DOT_MASK =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='27' fill='none'><path fill='black' d='M20 0h2v.993h-2V0ZM10 0h2v.993h-2V0ZM0 0h2v.993H0V0Zm20 8.993h2v1h-2v-1Zm-10 0h2v1h-2v-1Zm-10 0h2v1H0v-1Zm20 9h2v1h-2v-1Zm-10 0h2v1h-2v-1Zm-10 0h2v1H0v-1Z'/></svg>\")";

const DOT_FADE =
  "radial-gradient(circle at 50% 46%, black 34%, transparent 74%)";

type WorkWithMeIllustrationProps = { className?: string };

const WorkWithMeIllustration = ({ className }: WorkWithMeIllustrationProps) => (
  <div
    className={cn(
      "mx-auto flex aspect-square w-full max-w-[280px] flex-col items-center justify-center",
      className
    )}
  >
    {/* dot grid, faded toward the edges so it reads as a tile, not a void */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ WebkitMaskImage: DOT_FADE, maskImage: DOT_FADE }}
    >
      <div
        className="absolute inset-0 bg-fg-tertiary opacity-25 dark:opacity-15"
        style={{
          WebkitMaskImage: DOT_MASK,
          WebkitMaskRepeat: "repeat",
          WebkitMaskSize: "30px 27px",
          maskImage: DOT_MASK,
          maskRepeat: "repeat",
          maskSize: "30px 27px",
        }}
      />
    </div>

    <PixelCoffee size={150} />
    <span className="relative mt-4 font-departure-mono text-[11px] text-fg-tertiary/70 tracking-wide">
      brewed by a human
    </span>
  </div>
);

export { WorkWithMeIllustration };
