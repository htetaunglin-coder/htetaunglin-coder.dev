"use client";

import { Check, Copy } from "lucide-react";
import { getCldImageUrl } from "next-cloudinary";
import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { cn } from "@/lib/utils";

const PLATFORMS = {
  linkedin: { label: "LinkedIn cover", width: 1584, height: 396 },
  x: { label: "X header", width: 1500, height: 500 },
} as const;

const LAYOUTS = {
  L1: "Text left, art right",
  L2: "Art left, text right",
  L3: "Typography only",
  L4: "Artwork only",
} as const;

const DIRECTIONS = {
  A1: "Serene Marble",
  A2: "Seated Scholar",
  A3: "Standing Figure",
  A4: "Veiled Muse",
  A5: "Draped Motion",
  A6: "Winged Angel",
  B1: "Seated Reader",
  B2: "Heroic Gesture",
  B3: "Ascending Angel",
  B4: "Storybook Gentleman",
  B5: "Cloud Daydreamer",
  B6: "Victorian Parlor",
} as const;

const EFFECTS = {
  E0: "Clean Cutout",
  E1: "Particle Dissolve",
  E2: "Halftone Fade",
  E3: "Engraving Fade",
  E4: "Blueprint Fade",
} as const;

const PALETTES = {
  P1: { name: "Rust Editorial", accent: "#A63B1F" },
  P2: { name: "Imperial Purple", accent: "#4A3A78" },
  P3: { name: "Deep Cobalt", accent: "#31558A" },
  P4: { name: "Forest Editorial", accent: "#365A48" },
} as const;

export type BannerItem = {
  /** Cloudinary public ID, or a path starting with "/" for a local file. */
  src: string;
  alt: string;
  platform: keyof typeof PLATFORMS;
  layout: keyof typeof LAYOUTS;
  direction?: keyof typeof DIRECTIONS;
  effect?: keyof typeof EFFECTS;
  palette: keyof typeof PALETTES;
  /** What the figure holds or wears, or "none" for empty hands. */
  prop?: string;
};

type BannerShowcaseProps = {
  items: BannerItem[];
  className?: string;
};

const resolveSrc = (
  src: string,
  { width, height }: { width: number; height: number }
) => (src.startsWith("/") ? src : getCldImageUrl({ src, width, height }));

const buildRows = (item: BannerItem) => {
  const platform = PLATFORMS[item.platform];
  const palette = PALETTES[item.palette];
  const rows: { label: string; value: string }[] = [
    {
      label: "Platform",
      value: `${platform.label} (${platform.width}×${platform.height})`,
    },
    { label: "Layout", value: `${item.layout} — ${LAYOUTS[item.layout]}` },
  ];

  if (item.direction) {
    const family = item.direction.startsWith("A")
      ? "Marble sculpture"
      : "Painted storybook";
    rows.push({
      label: "Art",
      value: `${family} — ${item.direction} ${DIRECTIONS[item.direction]}`,
    });
  }

  if (item.effect) {
    rows.push({
      label: "Effect",
      value: `${item.effect} ${EFFECTS[item.effect]}`,
    });
  }

  rows.push({ label: "Palette", value: `${item.palette} ${palette.name}` });

  if (item.prop) {
    rows.push({ label: "Prop", value: item.prop });
  }

  return rows;
};

const CopyBriefButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="-ml-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-fg-tertiary text-xs transition-colors hover:bg-bg-default hover:text-fg-default"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      type="button"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy this brief"}
    </button>
  );
};

const BannerShowcase = ({ items, className }: BannerShowcaseProps) => {
  return (
    <PhotoProvider
      loop={false}
      maskClosable
      maskOpacity={0.9}
      pullClosable
      speed={() => 300}
    >
      <div
        className={cn(
          "not-prose my-8 flex w-full max-w-full flex-col gap-10",
          className
        )}
      >
        {items.map((item, index) => {
          const platform = PLATFORMS[item.platform];
          const url = resolveSrc(item.src, platform);
          const rows = buildRows(item);
          const brief = rows.map((r) => `${r.label}: ${r.value}`).join("\n");

          return (
            <figure
              className="m-0 w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-outline-secondary"
              key={item.src}
            >
              <PhotoView
                height={platform.height}
                src={url}
                width={platform.width}
              >
                <div
                  className="w-full cursor-zoom-in bg-bg-tertiary"
                  style={{
                    aspectRatio: `${platform.width} / ${platform.height}`,
                  }}
                >
                  {/* biome-ignore lint/correctness/useImageSize: sized by the aspect-ratio box */}
                  {/* biome-ignore lint/performance/noImgElement: Cloudinary already serves f_auto/q_auto */}
                  <img
                    alt={item.alt}
                    className="size-full object-contain"
                    draggable={false}
                    loading={index === 0 ? "eager" : "lazy"}
                    src={url}
                  />
                </div>
              </PhotoView>

              <figcaption className="bg-bg-accent p-4 text-xs">
                <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  {rows.map((row) => (
                    <div className="contents" key={row.label}>
                      <dt className="m-0 text-fg-tertiary">{row.label}</dt>
                      <dd className="m-0 flex items-center gap-2 text-fg-secondary/90">
                        {row.label === "Palette" && (
                          <span
                            aria-hidden="true"
                            className="inline-block size-3 shrink-0 rounded-full"
                            style={{
                              backgroundColor: PALETTES[item.palette].accent,
                            }}
                          />
                        )}
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-1.5">
                  <CopyBriefButton text={brief} />
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </PhotoProvider>
  );
};

export { BannerShowcase };
