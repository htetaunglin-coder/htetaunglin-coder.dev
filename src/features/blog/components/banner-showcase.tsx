"use client";

import { ChevronDown } from "lucide-react";
import { getCldImageUrl } from "next-cloudinary";
import type { ReactNode } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { buttonStyles } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  type BannerAnswers,
  compileBannerPrompt,
  DEFAULT_ANSWERS,
} from "../lib/banner-prompt/compile";
import {
  ART_DIRECTION_BY_ID,
  type ArtDirectionId,
  EFFECT_BY_ID,
  type EffectId,
  LAYOUT_BY_ID,
  type LayoutId,
  PALETTE_BY_ID,
  type PaletteId,
  PLATFORM_BY_ID,
  type PlatformId,
} from "../lib/banner-prompt/options";

export type BannerItem = {
  /** Cloudinary public ID, or a path starting with "/" for a local file. */
  src: string;
  alt: string;
  /**
   * The file's own pixel size, which is rarely the platform's — the model
   * returns what it likes. Framing by the platform instead pillarboxed six of
   * the nine examples.
   */
  width: number;
  height: number;
  platform: PlatformId;
  layout: LayoutId;
  direction?: ArtDirectionId;
  effect?: EffectId;
  palette: PaletteId;
  /** What the figure holds or wears. The builder has no field for it — the
   *  spec picks the prop itself — so this is display only. */
  prop?: string;
};

type BannerShowcaseProps = {
  items: BannerItem[];
  className?: string;
};

const BannerShowcase = ({ items, className }: BannerShowcaseProps) => {
  let loaded = 0;

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
        {groupByPlatform(items).map((group) => (
          <section className="flex flex-col gap-4" key={group.platform}>
            <GroupHeader group={group} />

            {group.items.map((item) => {
              // Only the first image on the page is worth blocking the render
              // for; the rest are well below the fold.
              const eager = loaded++ === 0;

              return <Example eager={eager} item={item} key={item.src} />;
            })}
          </section>
        ))}
      </div>
    </PhotoProvider>
  );
};

export { BannerShowcase };

type Group = {
  platform: PlatformId;
  items: BannerItem[];
  /** Set only when every example in the group uses it, so it can move up. */
  sharedLayout: LayoutId | null;
};

function GroupHeader({ group }: { group: Group }) {
  const platform = PLATFORM_BY_ID[group.platform];
  const layout = group.sharedLayout ? LAYOUT_BY_ID[group.sharedLayout] : null;
  const size =
    platform.width && platform.height
      ? `${platform.width} × ${platform.height}`
      : null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-outline-secondary border-b pb-2.5">
      <h3 className="m-0 font-medium text-fg-default text-sm">
        {platform.label}
      </h3>

      {/* Everything the group shares, said once. Repeating it under all six
          examples buried the three fields that actually differ. */}
      <p className="m-0 font-inter text-fg-tertiary text-xs">
        {[size, layout && `${layout.id} ${layout.label}`]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <p className="m-0 ml-auto text-fg-tertiary text-xs">
        {group.items.length} example{group.items.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function Example({ item, eager }: { item: BannerItem; eager: boolean }) {
  const url = resolveSrc(item);
  const direction = item.direction
    ? ART_DIRECTION_BY_ID[item.direction]
    : undefined;
  const palette = PALETTE_BY_ID[item.palette];

  return (
    <figure className="m-0 flex w-full min-w-0 max-w-full flex-col">
      <PhotoView height={item.height} src={url} width={item.width}>
        {/* The box takes the file's ratio, so `object-cover` crops nothing and
            the art still reaches all four edges. */}
        <div
          className="w-full cursor-zoom-in overflow-hidden rounded-md border border-outline-secondary bg-bg-tertiary"
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
        >
          {/* biome-ignore lint/correctness/useImageSize: sized by the aspect-ratio box */}
          {/* biome-ignore lint/performance/noImgElement: Cloudinary already serves f_auto/q_auto */}
          <img
            alt={item.alt}
            className="size-full object-cover"
            draggable={false}
            loading={eager ? "eager" : "lazy"}
            src={url}
          />
        </div>
      </PhotoView>

      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2">
        {/* The look in plain words. The coded recipe — every ID, layout, effect,
          prop — moves behind the Copy-recipe button so the caption reads at a
          glance. */}
        <span className="inline-flex items-center gap-1.5 text-fg-secondary/90 text-xs">
          <Swatch color={palette.accent} />
          {palette.label}
          {direction && (
            <>
              <span className="text-fg-tertiary/45">·</span>
              {direction.label}
            </>
          )}
        </span>

        <CopySpecControl item={item} />
      </figcaption>
    </figure>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-2.5 shrink-0 rounded-full border border-fg-default/20"
      style={{ backgroundColor: color }}
    />
  );
}

/**
 * One trigger, opened on click. The caption states the look in plain words; this
 * reveals the exact IDs as a read-only grid, with a Copy button pinned to the
 * footer's right edge. Radix portals the content, so the card's `overflow-hidden`
 * never clips it. Copy hands over the full locked prompt — the same one the
 * builder compiles — so the example's options run as-is, not just their labels.
 */
function CopySpecControl({ item }: { item: BannerItem }) {
  const rows = specRows(item);
  const promptText = compileBannerPrompt(itemToAnswers(item));

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonStyles({ size: "sm" }).base(),
          "ml-auto h-auto gap-1 rounded-sm py-0.75 pr-1.5 pl-2 text-xs [&[data-state=open]_svg]:rotate-180 [&_svg]:size-3.5 [&_svg]:text-fg-tertiary"
        )}
      >
        Copy recipe
        <ChevronDown className="transition-transform duration-300" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-auto min-w-64 p-0"
        sideOffset={6}
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 p-3 text-xs">
          {rows.map((row) => (
            <SpecRow
              code={row.code}
              key={row.label}
              label={row.label}
              swatch={
                row.swatchColor ? <Swatch color={row.swatchColor} /> : undefined
              }
            >
              {row.value}
            </SpecRow>
          ))}
        </dl>
        <div className="flex justify-end border-outline-secondary border-t px-3 py-2">
          <CopyButton
            className="h-7 px-2 text-xs [&_svg]:size-3.5"
            content={promptText}
            label="Copy"
            size="sm"
            variant="inverse"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * The example's options as builder answers, so `compileBannerPrompt` produces
 * the identical locked prompt. Fields the showcase does not carry (finish,
 * typography, and the headline/accent copy) fall back to the defaults; those
 * copy blanks compile to `(ask me)`, so a copied L1/L2 prompt locks every visual
 * choice and interviews only for the reader's own words. Prop is display only —
 * the spec still picks it, matching the builder.
 */
function itemToAnswers(item: BannerItem): BannerAnswers {
  const direction = item.direction
    ? ART_DIRECTION_BY_ID[item.direction]
    : undefined;

  return {
    ...DEFAULT_ANSWERS,
    platformId: item.platform,
    customWidth: item.platform === "custom" ? String(item.width) : "",
    customHeight: item.platform === "custom" ? String(item.height) : "",
    layoutId: item.layout,
    artFamilyId: direction?.family ?? DEFAULT_ANSWERS.artFamilyId,
    artDirectionId: item.direction ?? DEFAULT_ANSWERS.artDirectionId,
    effectId: item.effect ?? DEFAULT_ANSWERS.effectId,
    paletteId: item.palette,
  };
}

type SpecRowData = {
  label: string;
  value: string;
  code?: string;
  swatchColor?: string;
};

/** Single source for the popover grid and the copied text, so the two never
  drift. */
function specRows(item: BannerItem): SpecRowData[] {
  const platform = PLATFORM_BY_ID[item.platform];
  const layout = LAYOUT_BY_ID[item.layout];
  const direction = item.direction
    ? ART_DIRECTION_BY_ID[item.direction]
    : undefined;
  const effect = item.effect ? EFFECT_BY_ID[item.effect] : undefined;
  const palette = PALETTE_BY_ID[item.palette];
  const size =
    platform.width && platform.height
      ? `${platform.width} × ${platform.height}`
      : null;

  const rows: SpecRowData[] = [
    { label: "Platform", value: platform.label + (size ? ` · ${size}` : "") },
    { code: layout.id, label: "Layout", value: layout.label },
  ];

  if (direction) {
    rows.push({ code: direction.id, label: "Art", value: direction.label });
  }
  if (effect) {
    rows.push({ code: effect.id, label: "Effect", value: effect.label });
  }
  rows.push({
    code: palette.id,
    label: "Palette",
    swatchColor: palette.accent,
    value: palette.label,
  });
  if (item.prop) {
    rows.push({ label: "Prop", value: item.prop });
  }

  return rows;
}

/** One row of the recipe: a muted label, then the value keyed by its spec ID. */
function SpecRow({
  label,
  code,
  swatch,
  children,
}: {
  label: string;
  code?: string;
  swatch?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <dt className="text-fg-tertiary">{label}</dt>
      <dd className="m-0 flex items-center gap-1.5 text-fg-secondary/90">
        {swatch}
        {code && <span className="font-inter text-fg-tertiary">{code}</span>}
        {children}
      </dd>
    </>
  );
}

function groupByPlatform(items: BannerItem[]): Group[] {
  const groups: Group[] = [];

  for (const item of items) {
    const group = groups.find((one) => one.platform === item.platform);

    if (group) {
      group.items.push(item);
    } else {
      groups.push({
        platform: item.platform,
        items: [item],
        sharedLayout: null,
      });
    }
  }

  for (const group of groups) {
    const first = group.items[0].layout;

    group.sharedLayout = group.items.every((one) => one.layout === first)
      ? first
      : null;
  }

  return groups;
}

const resolveSrc = (item: BannerItem) =>
  item.src.startsWith("/")
    ? item.src
    : // Width only: passing the height too would crop to that box, and nothing
      // here should get cropped.
      getCldImageUrl({ src: item.src, width: Math.min(item.width, 1600) });
