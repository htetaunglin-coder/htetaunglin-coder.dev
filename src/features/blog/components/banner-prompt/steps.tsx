"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupChip } from "@/components/ui/radio-group";
import type { BannerAnswers } from "../../lib/banner-prompt/compile";
import { collectRequiredAnswers } from "../../lib/banner-prompt/compile";
import {
  ART_DIRECTION_BY_ID,
  FIELD_FINISH_BY_ID,
  FIELD_FINISHES,
  LAYOUT_BY_ID,
  LAYOUTS,
  type LayoutId,
  layoutHasArt,
  layoutHasCopy,
  PALETTE_BY_ID,
  PALETTES,
  PLATFORM_BY_ID,
  PLATFORMS,
  TYPOGRAPHY,
  TYPOGRAPHY_BY_ID,
} from "../../lib/banner-prompt/options";
import { ArtStep } from "./art-step";
import { HeadlineField } from "./headline-field";
import { CodeLabel, OptionField } from "./option-field";
import { ReviewStep } from "./review-step";
import {
  FinishSwatch,
  PaletteThumb,
  PlatformRatio,
  TypeSpecimen,
} from "./visuals";

export type StepId =
  | "copy"
  | "platform"
  | "layout"
  | "palette"
  | "art"
  | "finish"
  | "review";

export type Step = {
  id: StepId;
  label: string;
  summary: string;
};

type StepProps = {
  answers: BannerAnswers;
  onPatch: (next: Partial<BannerAnswers>) => void;
  onGoTo: (id: StepId) => void;
};

/** The run for these answers. L3 and L4 drop half the form between them. */
export function visibleSteps(answers: BannerAnswers): Step[] {
  const layout = LAYOUT_BY_ID[answers.layoutId];
  const palette = PALETTE_BY_ID[answers.paletteId];
  const finish = FIELD_FINISH_BY_ID[answers.fieldFinishId];
  const hasArt = layoutHasArt(answers.layoutId);
  const hasCopy = layoutHasCopy(answers.layoutId);
  const steps: Step[] = [];

  if (hasCopy) {
    steps.push({
      id: "copy",
      label: "Your words",
      summary: answers.headline.trim() || "Nothing written yet",
    });
  }

  steps.push(
    {
      id: "platform",
      label: "Platform",
      summary: platformSummary(answers),
    },
    {
      id: "layout",
      label: "Layout",
      summary: `${layout.id} — ${layout.label}`,
    },
    {
      id: "palette",
      label: "Colours",
      summary: `${palette.id} ${palette.label}`,
    }
  );

  if (hasArt) {
    const direction = ART_DIRECTION_BY_ID[answers.artDirectionId];

    steps.push({
      id: "art",
      label: "Artwork",
      summary: `${direction.id} ${direction.label}`,
    });
  }

  steps.push({
    id: "finish",
    label: hasCopy ? "Background and lettering" : "Background",
    summary: hasCopy
      ? `${finish.id} ${finish.label} · ${typographySummary(answers)}`
      : `${finish.id} ${finish.label}`,
  });

  const unfinished = collectRequiredAnswers(answers).filter((one) => !one.done);

  steps.push({
    id: "review",
    label: "Your brief",
    summary:
      unfinished.length > 0
        ? `Still needed: ${unfinished.map((one) => one.label).join(", ")}`
        : "Ready",
  });

  return steps;
}

export function StepControl({
  id,
  answers,
  onPatch,
  onGoTo,
}: StepProps & { id: StepId }) {
  switch (id) {
    case "copy":
      return (
        <HeadlineField
          accentPhrase={answers.accentPhrase}
          headline={answers.headline}
          onChange={onPatch}
          paletteId={answers.paletteId}
        />
      );
    case "platform":
      return <PlatformStep answers={answers} onPatch={onPatch} />;
    case "layout":
      return <LayoutStep answers={answers} onPatch={onPatch} />;
    case "palette":
      return <PaletteStep answers={answers} onPatch={onPatch} />;
    case "art":
      return <ArtStep answers={answers} onPatch={onPatch} />;
    case "finish":
      return <FinishStep answers={answers} onPatch={onPatch} />;
    case "review":
      return <ReviewStep answers={answers} onGoTo={onGoTo} />;
    default:
      return null;
  }
}

function PlatformStep({
  answers,
  onPatch,
}: Pick<StepProps, "answers" | "onPatch">) {
  return (
    <div className="space-y-2 sm:space-y-4">
      <OptionField
        columnsClassName="grid-cols-2 sm:grid-cols-3"
        hideTitle
        hint="Where the banner is going. Everything else is sized to fit it."
        onChange={(value) => onPatch({ platformId: value })}
        options={PLATFORMS.map((platform) => ({
          value: platform.id,
          label: platform.label,
          // The ratio is drawn, so the line only carries the numbers.
          description: platform.width
            ? `${platform.width} × ${platform.height} px`
            : "Any width and height you name.",
          accessory: (
            <PlatformRatio height={platform.height} width={platform.width} />
          ),
        }))}
        title="Platform"
        value={answers.platformId}
      />

      {answers.platformId === "custom" && (
        <div className="flex items-center gap-2 sm:gap-4">
          <Input
            className="w-full text-xs sm:text-sm"
            inputMode="numeric"
            onChange={(event) => onPatch({ customWidth: event.target.value })}
            placeholder="Width"
            size="sm"
            value={answers.customWidth}
          />
          <Input
            className="w-full text-xs sm:text-sm"
            inputMode="numeric"
            onChange={(event) => onPatch({ customHeight: event.target.value })}
            placeholder="Height"
            size="sm"
            value={answers.customHeight}
          />
        </div>
      )}
    </div>
  );
}

function LayoutStep({
  answers,
  onPatch,
}: Pick<StepProps, "answers" | "onPatch">) {
  const headingId = useId();
  const selected = LAYOUT_BY_ID[answers.layoutId];

  return (
    <section>
      {/* Hidden, never dropped: this is what names the radio group. */}
      <h4 className="sr-only" id={headingId}>
        Layout
      </h4>
      <p className="mt-1 text-fg-tertiary text-xs">
        Where the words and the artwork sit.
      </p>

      {/* Chips, not a grid: they wrap as tags, so no `columns`. */}
      <RadioGroup
        aria-labelledby={headingId}
        className="mt-3 flex flex-wrap gap-2"
        onValueChange={(value) => onPatch({ layoutId: value as LayoutId })}
        value={answers.layoutId}
      >
        {LAYOUTS.map((layout) => (
          <RadioGroupChip
            className="data-[state=checked]:px-3 data-[state=checked]:pl-2"
            key={layout.id}
            label={<CodeLabel code={layout.id}>{layout.label}</CodeLabel>}
            value={layout.id}
          />
        ))}
      </RadioGroup>

      {/* A chip has no room for its description, so the chosen layout's line is
        lifted out and announced. */}
      {selected.description && (
        <p aria-live="polite" className="mt-2 text-fg-tertiary text-xs">
          {selected.description}
        </p>
      )}
    </section>
  );
}

function PaletteStep({
  answers,
  onPatch,
}: Pick<StepProps, "answers" | "onPatch">) {
  return (
    <OptionField
      columns={4}
      hideTitle
      hint="One palette for the whole banner: the background, the text, the quieter text, and the one accent. It colours the artwork too, not only the words."
      onChange={(value) => onPatch({ paletteId: value })}
      options={PALETTES.map((palette) => ({
        value: palette.id,
        label: palette.label,
        accessory: <PaletteThumb palette={palette} />,
      }))}
      title="Colours"
      value={answers.paletteId}
    />
  );
}

function FinishStep({
  answers,
  onPatch,
}: Pick<StepProps, "answers" | "onPatch">) {
  return (
    <div className="space-y-8">
      <OptionField
        // Two across from mobile, three from lg.
        columnsClassName="grid-cols-2 lg:grid-cols-3"
        hint="The colour behind everything else."
        onChange={(value) => onPatch({ fieldFinishId: value })}
        options={FIELD_FINISHES.map((finish) => ({
          value: finish.id,
          label: finish.label,
          description: finish.description,
          accessory: <FinishSwatch id={finish.id} />,
        }))}
        title="Background"
        value={answers.fieldFinishId}
      />

      {layoutHasCopy(answers.layoutId) && (
        <OptionField
          // Two faces, two across at every width.
          columnsClassName="grid-cols-2"
          onChange={(value) => onPatch({ typographyId: value })}
          options={TYPOGRAPHY.map((face) => ({
            value: face.id,
            label: face.label,
            description: face.description,
            accessory: (
              <TypeSpecimen
                headline={answers.headline}
                typographyId={face.id}
              />
            ),
          }))}
          title="Lettering"
          value={answers.typographyId}
        />
      )}
    </div>
  );
}

function platformSummary(answers: BannerAnswers): string {
  const platform = PLATFORM_BY_ID[answers.platformId];

  return platform.width
    ? `${platform.label} · ${platform.width} × ${platform.height}`
    : platform.label;
}

function typographySummary(answers: BannerAnswers): string {
  const face = TYPOGRAPHY_BY_ID[answers.typographyId];

  return `${face.id} ${face.label}`;
}
