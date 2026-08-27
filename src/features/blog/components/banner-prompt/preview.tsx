"use client";

import type { HTMLAttributes } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { CloudinaryImage } from "@/components/cloudinary-image";
import "react-photo-view/dist/react-photo-view.css";
import { cn } from "@/lib/utils";
import type { BannerAnswers } from "../../lib/banner-prompt/compile";
import {
  ART_DIRECTION_BY_ID,
  layoutHasArt,
  layoutHasCopy,
  PALETTE_BY_ID,
  PLATFORM_BY_ID,
  type PlatformId,
} from "../../lib/banner-prompt/options";
import { FONT_STACK, GRAIN } from "./visuals";

type SafeZone = {
  railLeftPct: number;
  railRightPct: number;
  /** The height by which every line of copy must finish. */
  copyEndsPct: number;
  avatar: "left" | "bottom-left" | null;
};

const LINKEDIN_SIZE = { width: 1584, height: 396 };

const COPY_TOP_PCT = 18;

const SAFE_ZONES: Record<PlatformId, SafeZone> = {
  linkedin: {
    railLeftPct: 25,
    railRightPct: 5,
    copyEndsPct: 92,
    avatar: "left",
  },
  x: {
    railLeftPct: 9,
    railRightPct: 5,
    copyEndsPct: 60,
    avatar: "bottom-left",
  },
  custom: {
    railLeftPct: 6,
    railRightPct: 6,
    copyEndsPct: 92,
    avatar: null,
  },
};

/* -------------------------------------------------------------------------- */

export function BannerPreview({ answers }: { answers: BannerAnswers }) {
  const size = bannerSize(answers);
  const ratio = size.width / size.height;

  return (
    <PhotoProvider
      loop={false}
      maskClosable
      maskOpacity={0.9}
      pullClosable
      speed={() => 300}
    >
      <figure className="not-prose m-0 w-full shrink-0">
        {/* Shorter on a phone so a wide banner's letterbox stops eating the
          panel. The trigger takes the banner's real ratio, so the viewer morphs
          from the picture rather than from the surrounding letterbox. */}
        <div className="flex h-[var(--preview-h)] w-full items-center justify-center [--preview-h:7.5rem] sm:[--preview-h:11.25rem]">
          <PhotoView
            height={size.height}
            key={`${size.width}-${size.height}`}
            render={({ attrs }) => (
              <PreviewFrame {...attrs} answers={answers} />
            )}
            width={size.width}
          >
            <button
              aria-label="View banner preview"
              className="m-0 block cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default"
              style={{
                aspectRatio: `${size.width} / ${size.height}`,
                // Height-bound until the banner is wider than the box, then
                // width-bound. `w-full` would squash every platform but the
                // widest against the fixed preview height.
                width: `min(100%, calc(var(--preview-h) * ${ratio}))`,
              }}
              type="button"
            >
              <PreviewFrame answers={answers} className="size-full" />
            </button>
          </PhotoView>
        </div>

        <figcaption className="mt-2 text-fg-tertiary text-xs">
          This shows the layout, not the real colours or art.{" "}
          <a
            className="text-fg-brand underline underline-offset-2"
            href="#examples"
          >
            See Examples
          </a>
          .
        </figcaption>
      </figure>
    </PhotoProvider>
  );
}

function PreviewFrame({
  answers,
  className,
  style,
  ...props
}: { answers: BannerAnswers } & HTMLAttributes<HTMLDivElement>) {
  const palette = PALETTE_BY_ID[answers.paletteId];
  const safe = SAFE_ZONES[answers.platformId];
  const hasArt = layoutHasArt(answers.layoutId);
  const hasCopy = layoutHasCopy(answers.layoutId);
  const artImage = ART_DIRECTION_BY_ID[answers.artDirectionId].image;
  const size = bannerSize(answers);
  const frame = {
    start: safe.railLeftPct,
    width: 100 - safe.railLeftPct - safe.railRightPct,
  };
  const columns = splitFrame(frame, answers.layoutId);

  return (
    <div
      {...props}
      className={cn("relative overflow-hidden", className)}
      style={{
        ...style,
        aspectRatio: `${size.width} / ${size.height}`,
        backgroundColor: palette.field,
        containerType: "size",
      }}
    >
      {answers.fieldFinishId === "F3" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(115deg, ${palette.field}, color-mix(in oklab, ${palette.field}, black 9%))`,
          }}
        />
      )}

      {answers.fieldFinishId !== "F1" && (
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{ backgroundImage: GRAIN }}
        />
      )}

      {hasArt && (
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            color: palette.secondary,
            left: `${columns.art.start}%`,
            width: `${columns.art.width}%`,
            // Top keeps the spec's ~5% clear field; the bottom deliberately
            // drops it so the figure stands on the banner's edge instead of
            // floating above it.
            top: "5cqh",
            bottom: "-3cqh",
          }}
        >
          {artImage ? (
            <div className="flex size-full items-end justify-center">
              <CloudinaryImage
                alt=""
                className="h-full w-auto"
                height={artImage.height}
                sizes="45vw"
                src={artImage.src}
                width={artImage.width}
              />
            </div>
          ) : (
            <div className="flex size-full items-center justify-center rounded-sm border border-current/25 border-dashed">
              <span
                style={{
                  color: palette.secondary,
                  fontFamily: FONT_STACK.T1,
                  fontSize: "7cqh",
                  letterSpacing: "0.14em",
                  opacity: 0.5,
                  textTransform: "uppercase",
                }}
              >
                artwork
              </span>
            </div>
          )}
        </div>
      )}

      {hasCopy && (
        <div
          className="absolute"
          style={{
            left: `${columns.text.start}%`,
            width: `${columns.text.width}%`,
            top: `${COPY_TOP_PCT}cqh`,
            maxHeight: `${safe.copyEndsPct - COPY_TOP_PCT}cqh`,
          }}
        >
          <p
            style={{
              color: palette.ink,
              fontFamily: FONT_STACK[answers.typographyId],
              fontSize: "10cqh",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.14,
              margin: 0,
              textAlign: answers.layoutId === "L2" ? "right" : "left",
            }}
          >
            {headlineParts(answers).map((part) => (
              <span
                key={`${part.text}-${part.accent}`}
                style={{
                  color: part.accent ? palette.accent : undefined,
                  opacity: part.placeholder ? 0.35 : 1,
                }}
              >
                {part.text}
              </span>
            ))}
          </p>
        </div>
      )}

      {safe.avatar && (
        <div
          aria-hidden="true"
          className="absolute flex items-start justify-center rounded-full border border-current/30 border-dashed pt-[6cqh]"
          style={{
            color: palette.secondary,
            ...(safe.avatar === "left"
              ? {
                  height: "62cqh",
                  width: "62cqh",
                  left: "3cqw",
                  top: "52cqh",
                }
              : {
                  height: "44cqh",
                  width: "44cqh",
                  left: "6cqw",
                  top: "58cqh",
                }),
          }}
        >
          <span
            style={{
              color: palette.secondary,
              fontFamily: FONT_STACK.T1,
              fontSize: "6cqh",
              letterSpacing: "0.12em",
              opacity: 0.55,
              textTransform: "uppercase",
            }}
          >
            avatar
          </span>
        </div>
      )}
    </div>
  );
}

function splitFrame(
  frame: { start: number; width: number },
  layoutId: BannerAnswers["layoutId"]
) {
  const text = frame.width * 0.55;
  const art = frame.width * 0.45;

  if (layoutId === "L3") {
    return {
      text: { start: frame.start, width: frame.width },
      art: { start: frame.start, width: 0 },
    };
  }

  if (layoutId === "L4") {
    return {
      text: { start: frame.start, width: 0 },
      art: { start: frame.start, width: frame.width },
    };
  }

  if (layoutId === "L2") {
    return {
      text: { start: frame.start + art, width: text },
      art: { start: frame.start, width: art },
    };
  }

  return {
    text: { start: frame.start, width: text },
    art: { start: frame.start + text, width: art },
  };
}

function headlineParts(answers: BannerAnswers) {
  const headline = answers.headline.trim();

  if (!headline) {
    return [
      { text: "Your headline lands here", accent: false, placeholder: true },
    ];
  }

  const accent = answers.accentPhrase.trim();
  const at = accent ? headline.toLowerCase().indexOf(accent.toLowerCase()) : -1;

  if (at === -1) {
    return [{ text: headline, accent: false, placeholder: false }];
  }

  return [
    { text: headline.slice(0, at), accent: false, placeholder: false },
    {
      text: headline.slice(at, at + accent.length),
      accent: true,
      placeholder: false,
    },
    {
      text: headline.slice(at + accent.length),
      accent: false,
      placeholder: false,
    },
  ].filter((part) => part.text);
}

function bannerSize(answers: BannerAnswers): { width: number; height: number } {
  const platform = PLATFORM_BY_ID[answers.platformId];

  if (platform.width && platform.height) {
    return { width: platform.width, height: platform.height };
  }

  const width = Number.parseInt(answers.customWidth, 10);
  const height = Number.parseInt(answers.customHeight, 10);

  if (width > 0 && height > 0) {
    return { width, height };
  }

  return LINKEDIN_SIZE;
}
