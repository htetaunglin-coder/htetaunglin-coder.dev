import type {
  FieldFinishId,
  Palette,
  TypographyId,
} from "../../lib/banner-prompt/options";

/** Shared by the preview and the lettering specimens, so a face is named once. */
export const FONT_STACK: Record<TypographyId, string> = {
  T1: 'Inter, "Helvetica Neue", Arial, sans-serif',
  T2: 'Poppins, Avenir, "Century Gothic", "Trebuchet MS", sans-serif',
};

export const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* -------------------------------------------------------------------------- */

const STAGE_WIDTH = 100;
const STAGE_HEIGHT = 35;
const CUSTOM_FRAME_HEIGHT = 31;

const BAR_HEIGHT = 2.8;
const BAR_GAP = 2.4;
const BAR_LEFT = 11;
const BAR_BLOCK = BAR_HEIGHT * 2 + BAR_GAP;

// Frames hang from one edge rather than centring, so the height difference —
// the ratio itself — is what the eye compares.
const FRAME_INSET = 0.7;

// Sized and spaced in absolute units, then centred as one block. Positioning
// each bar at a fraction of the frame left uneven air above and below, by a
// different amount on every platform.

// Neutral rather than palette-coloured: the finish is the variable here, and
// tinting it would make three finishes look like three palettes.
const FINISH_BASE = "#8d857a";
const FINISH_SHADE = "#5d564e";

export function PlatformRatio({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  const ratio = width && height ? width / height : null;
  const frameHeight = ratio
    ? Math.min(STAGE_HEIGHT - FRAME_INSET * 2, STAGE_WIDTH / ratio)
    : CUSTOM_FRAME_HEIGHT;
  const barTop = FRAME_INSET + (frameHeight - BAR_BLOCK) / 2;

  return (
    <svg
      aria-hidden="true"
      className="block w-full text-fg-tertiary duration-300 ease-in-out"
      viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
    >
      <rect
        fill="none"
        height={frameHeight}
        opacity={ratio ? 0.9 : 0.75}
        rx="2"
        stroke="currentColor"
        strokeDasharray={ratio ? undefined : "4 3"}
        strokeWidth="0.5"
        width={STAGE_WIDTH - FRAME_INSET * 2}
        x={FRAME_INSET}
        y={FRAME_INSET}
      />
      {ratio ? (
        <>
          <rect
            fill="currentColor"
            height={BAR_HEIGHT}
            opacity="0.5"
            rx="1.4"
            width="40"
            x={BAR_LEFT}
            y={barTop}
          />
          <rect
            fill="currentColor"
            height={BAR_HEIGHT}
            opacity="0.5"
            rx="1.4"
            width="28"
            x={BAR_LEFT}
            y={barTop + BAR_HEIGHT + BAR_GAP}
          />
        </>
      ) : (
        <text
          fill="currentColor"
          fontFamily="monospace"
          fontSize="9"
          opacity="0.65"
          textAnchor="middle"
          x={STAGE_WIDTH / 2}
          y={FRAME_INSET + frameHeight / 2 + 3.2}
        >
          W × H
        </text>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

export function PaletteThumb({ palette }: { palette: Palette }) {
  return (
    <span
      className="block w-full"
      style={{ aspectRatio: "4 / 1", backgroundColor: palette.field }}
    >
      <span className="relative block size-full">
        <span
          className="absolute top-[26%] left-[8%] block h-[14%] w-[34%] rounded-[1px]"
          style={{ backgroundColor: palette.ink }}
        />
        <span
          className="absolute top-[50%] left-[8%] block h-[12%] w-[20%] rounded-[1px]"
          style={{ backgroundColor: palette.accent }}
        />
        <span
          className="absolute right-[7%] bottom-0 block h-[78%] w-[16%] rounded-t-[40%] opacity-75"
          style={{ backgroundColor: palette.secondary }}
        />
      </span>
    </span>
  );
}

export function FinishSwatch({ id }: { id: FieldFinishId }) {
  if (id === "F1") {
    return (
      <span
        className="block h-10 w-full"
        style={{ backgroundColor: FINISH_BASE }}
      />
    );
  }

  const gradient = id === "F3";

  return (
    <span
      className="relative block h-10 w-full"
      style={
        gradient
          ? {
              backgroundImage: `linear-gradient(115deg, ${FINISH_BASE}, ${FINISH_SHADE})`,
            }
          : { backgroundColor: FINISH_BASE }
      }
    >
      <span
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: GRAIN }}
      />
    </span>
  );
}

/* -------------------------------------------------------------------------- */

export function TypeSpecimen({
  typographyId,
  headline,
}: {
  typographyId: TypographyId;
  headline?: string;
}) {
  return (
    <span
      className="block truncate bg-bg-default px-3 py-2 font-bold text-fg-default/80 text-xl leading-tight tracking-tight"
      style={{ fontFamily: FONT_STACK[typographyId] }}
    >
      {headline?.trim() || "Your headline"}
    </span>
  );
}
