"use client";

import { Check, Download } from "lucide-react";
import { Fragment, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import {
  type BannerAnswers,
  collectRequiredAnswers,
  compileBannerPrompt,
  type RequiredAnswer,
} from "../../lib/banner-prompt/compile";
import {
  ART_DIRECTION_BY_ID,
  EFFECT_BY_ID,
  FIELD_FINISH_BY_ID,
  LAYOUT_BY_ID,
  layoutHasArt,
  layoutHasCopy,
  PALETTE_BY_ID,
  PLATFORM_BY_ID,
  TYPOGRAPHY_BY_ID,
} from "../../lib/banner-prompt/options";
import type { StepId } from "./steps";

type AnswerRow = {
  label: string;
  value: string;
  /** Where the "Change" link jumps to. */
  stepId: StepId;
  missing?: boolean;
};

export function ReviewStep({
  answers,
  onGoTo,
}: {
  answers: BannerAnswers;
  onGoTo: (id: StepId) => void;
}) {
  const prompt = useMemo(() => compileBannerPrompt(answers), [answers]);
  const unfinished = collectRequiredAnswers(answers).filter((one) => !one.done);

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([prompt], { type: "text/markdown" })
    );
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "banner-prompt.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <dl className="divide-y divide-outline-default/30 border-outline-default/30 border-y">
        {buildAnswerRows(answers).map((row) => (
          <div
            className="grid grid-cols-[7rem_minmax(0,1fr)_auto] items-baseline gap-3 py-1"
            key={row.label}
          >
            <dt className="text-fg-tertiary text-xs">{row.label}</dt>
            <dd
              className={cn(
                "m-0 text-[0.8125rem]",
                row.missing ? "text-fg-warning" : "text-fg-default"
              )}
            >
              {row.value}
            </dd>
            <button
              className="cursor-pointer text-fg-brand text-xs underline underline-offset-2"
              onClick={() => onGoTo(row.stepId)}
              type="button"
            >
              {row.missing ? "Add" : "Change"}
            </button>
          </div>
        ))}
      </dl>

      {unfinished.length > 0 ? (
        <p className="text-fg-warning text-xs">
          Your banner still needs{" "}
          {unfinished.map((one, index) => (
            <Fragment key={one.field}>
              {index > 0 ? ", " : null}
              <button
                className="cursor-pointer underline underline-offset-2 hover:text-fg-default"
                onClick={() => onGoTo(STEP_BY_FIELD[one.field])}
                type="button"
              >
                {one.label}
              </button>
            </Fragment>
          ))}
          . Copy now and the prompt asks you for{" "}
          {unfinished.length === 1 ? "it" : "them"} in your image generator, or
          add {unfinished.length === 1 ? "it" : "them"} here first.
        </p>
      ) : (
        <p className="flex items-center gap-1.5 text-fg-tertiary text-xs">
          <Check className="size-3.5 text-fg-brand" />
          Everything the prompt needs is answered.
        </p>
      )}

      <div className="flex w-full items-center justify-end gap-2">
        <Button
          className="text-xs sm:text-sm"
          onClick={download}
          size="sm"
          type="button"
          variant="secondary"
        >
          <Download className="size-4" /> Download .md
        </Button>

        <CopyButton
          className="h-auto gap-1.5 py-1.5 text-xs sm:text-sm"
          content={prompt}
          label="Copy"
          variant="inverse"
        />
      </div>
    </div>
  );
}

/**
 * The reader's own choices only. Not `buildBriefLines` — that also carries house
 * rules nobody picked, and those must not get a "Change" link.
 */
function buildAnswerRows(answers: BannerAnswers): AnswerRow[] {
  const layout = LAYOUT_BY_ID[answers.layoutId];
  const headline = answers.headline.trim();
  const accent = answers.accentPhrase.trim();
  const note = answers.customArtNote.trim();
  const sized = Boolean(
    answers.customWidth.trim() && answers.customHeight.trim()
  );

  const rows: AnswerRow[] = [
    {
      label: "Platform",
      value: platformValue(answers),
      stepId: "platform",
      missing: answers.platformId === "custom" && !sized,
    },
    {
      label: "Layout",
      value: `${layout.id} — ${layout.label}`,
      stepId: "layout",
    },
  ];

  if (layoutHasCopy(answers.layoutId)) {
    rows.push(
      {
        label: "Headline",
        value: headline || "Not written yet",
        stepId: "copy",
        missing: !headline,
      },
      {
        label: "Accent phrase",
        value: accent || "Not chosen yet",
        stepId: "copy",
        missing: !accent,
      }
    );
  }

  if (layoutHasArt(answers.layoutId)) {
    const direction = ART_DIRECTION_BY_ID[answers.artDirectionId];
    const effect = EFFECT_BY_ID[answers.effectId];

    rows.push(
      {
        label: "Artwork",
        value: `${direction.id} ${direction.label}`,
        stepId: "art",
      },
      {
        label: "Edge effect",
        value: `${effect.id} ${effect.label}`,
        stepId: "art",
      }
    );
  }

  const palette = PALETTE_BY_ID[answers.paletteId];
  const finish = FIELD_FINISH_BY_ID[answers.fieldFinishId];

  rows.push(
    {
      label: "Colours",
      value: `${palette.id} ${palette.label}`,
      stepId: "palette",
    },
    {
      label: "Background",
      value: `${finish.id} ${finish.label}`,
      stepId: "finish",
    }
  );

  if (layoutHasCopy(answers.layoutId)) {
    const face = TYPOGRAPHY_BY_ID[answers.typographyId];

    rows.push({
      label: "Lettering",
      value: `${face.id} ${face.label}`,
      stepId: "finish",
    });
  }

  if (layoutHasArt(answers.layoutId) && note) {
    rows.push({ label: "Extra note", value: note, stepId: "art" });
  }

  return rows;
}

function platformValue(answers: BannerAnswers): string {
  const platform = PLATFORM_BY_ID[answers.platformId];
  const width = answers.customWidth.trim();
  const height = answers.customHeight.trim();

  if (platform.width && platform.height) {
    return `${platform.label} — ${platform.width} × ${platform.height}`;
  }

  return width && height
    ? `${platform.label} — ${width} × ${height}`
    : platform.label;
}

const STEP_BY_FIELD: Record<RequiredAnswer["field"], StepId> = {
  headline: "copy",
  accentPhrase: "copy",
  size: "platform",
};
