"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type BannerAnswers,
  DEFAULT_ANSWERS,
} from "../../lib/banner-prompt/compile";
import { onBannerPreset } from "../../lib/banner-prompt/preset";
import { BannerPreview } from "./preview";
import { StepControl, type StepId, visibleSteps } from "./steps";

// Blur still steps by depth, because it is a property of the row rather than of
// the distance down the ramp.
const BLUR = [0, 1, 2, 3, 3.5, 4] as const;

const blurAt = (depth: number) => BLUR[Math.min(depth, BLUR.length - 1)];

export function BannerStepFlow() {
  const [answers, setAnswers] = useState<BannerAnswers>(DEFAULT_ANSWERS);
  const [openStepId, setOpenStepId] = useState<StepId>("copy");

  const patch = useCallback((next: Partial<BannerAnswers>) => {
    setAnswers((previous) => ({ ...previous, ...next }));
  }, []);

  // An example in the post below fills in everything except the words. Landing
  // on "Your words" is the whole point — it is what the reader still owes.
  useEffect(
    () =>
      onBannerPreset((preset) => {
        setAnswers((previous) => ({ ...previous, ...preset }));
        setOpenStepId("copy");
      }),
    []
  );

  const steps = visibleSteps(answers);

  // Tracked by id, not index: L3 and L4 drop whole steps, so an index would
  // point at a different question the moment the run gets shorter.
  const openIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === openStepId)
  );
  const open = steps[openIndex];
  const isLast = openIndex === steps.length - 1;
  const upcoming = steps.slice(openIndex + 1);

  const goTo = (index: number) => setOpenStepId(steps[index].id);

  return (
    <>
      <BannerPreview answers={answers} />

      <div className="thin_scrollbar flex max-h-[min(30rem,50dvh)] min-h-40 flex-col overflow-y-auto [scrollbar-gutter:stable] sm:max-h-[min(30rem,40dvh)] sm:min-h-52 sm:gap-3">
        <div className="sticky top-0 z-20 flex shrink-0 items-center gap-3 bg-bg-default">
          <p className="not-prose flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 font-inter text-[0.625rem] text-fg-tertiary tabular-nums sm:text-xs">
              {openIndex + 1}/{steps.length}
            </span>
            <span className="truncate font-medium text-fg-default text-xs sm:text-sm">
              {open.label}
            </span>
          </p>

          <div className="flex shrink-0 items-center sm:gap-1">
            <Button
              aria-label="Previous step"
              disabled={openIndex === 0}
              iconOnly
              onClick={() => goTo(openIndex - 1)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <ArrowLeft className="size-3 sm:size-3.5" />
            </Button>
            <Button
              className="h-auto gap-1 py-1.5 pr-2.5 pl-3 text-xs sm:gap-1.5 sm:text-sm"
              disabled={isLast}
              onClick={() => goTo(openIndex + 1)}
              size="sm"
              type="button"
              variant="outlined"
            >
              Next <ArrowRight className="size-3 sm:size-3.5" />
            </Button>
          </div>
        </div>

        <div className="shrink-0 p-1" key={open.id}>
          <StepControl
            answers={answers}
            id={open.id}
            onGoTo={setOpenStepId}
            onPatch={patch}
          />
        </div>

        {upcoming.length > 0 && (
          <div
            aria-hidden="true"
            className="min-h-0 flex-1 basis-0 select-none space-y-1 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.08) 76%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.08) 76%, transparent)",
            }}
          >
            {upcoming.map((step, offset) => (
              <StepRow
                blur={blurAt(offset + 1)}
                index={openIndex + offset + 1}
                key={step.id}
                label={step.label}
                summary={step.summary}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StepRow({
  index,
  label,
  summary,
  blur,
}: {
  index: number;
  label: string;
  summary?: string;
  blur: number;
}) {
  return (
    <div
      className="pointer-events-none flex h-7 items-center gap-1 transition-[filter] duration-500 ease-out motion-reduce:transition-none sm:gap-2"
      style={{ filter: `blur(${blur}px)` }}
    >
      <span className="w-3 shrink-0 font-inter text-[0.625rem] text-fg-tertiary tabular-nums sm:w-4 sm:text-xs">
        {index + 1}
      </span>
      <span className="shrink-0 font-medium text-fg-tertiary text-xs sm:text-sm">
        {label}
      </span>
      {summary && (
        <span className="inline-flex h-4 min-w-0 flex-1 items-center gap-1.5 truncate rounded-sm bg-bg-secondary/60 px-2 text-[0.625rem] text-fg-tertiary sm:h-6 sm:text-xs">
          <span className="truncate">{summary}</span>
        </span>
      )}
    </div>
  );
}
