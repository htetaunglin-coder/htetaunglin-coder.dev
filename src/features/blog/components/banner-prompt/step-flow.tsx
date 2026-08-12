"use client";

import {
  ArrowLeft,
  ArrowRight,
  Download,
  RotateCcw,
  Ruler,
} from "lucide-react";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type BannerAnswers,
  collectRequiredAnswers,
  compileBannerPrompt,
  compileBriefSummary,
  countHeadlineWords,
  DEFAULT_ANSWERS,
  type RequiredAnswer,
} from "../../lib/banner-prompt/compile";
import {
  ART_DIRECTIONS,
  ART_FAMILIES,
  type ArtFamilyId,
  EFFECTS,
  FIELD_FINISHES,
  HEADLINE_WORD_LIMIT,
  LAYOUTS,
  type LayoutId,
  layoutHasArt,
  layoutHasCopy,
  PALETTES,
  PLATFORMS,
  TYPOGRAPHY,
} from "../../lib/banner-prompt/options";
import { OptionField } from "./option-field";

type Step = {
  id: string;
  label: string;
  summary?: string;
  /** Called only for the open step, so the other nine never build a subtree. */
  renderControl: () => ReactNode;
};

export function BannerStepFlow() {
  const [answers, setAnswers] = useState<BannerAnswers>(DEFAULT_ANSWERS);
  const [activeId, setActiveId] = useState<string>("copy");

  const update = useCallback(
    <K extends keyof BannerAnswers>(key: K, value: BannerAnswers[K]) => {
      setAnswers((previous) => ({ ...previous, [key]: value }));
    },
    []
  );

  // A direction belongs to one family, so keeping the old pick would compile a
  // brief the spec cannot render.
  const selectArtFamily = useCallback((value: string) => {
    const family = value as ArtFamilyId;
    const directions = ART_DIRECTIONS.filter((one) => one.family === family);
    const next = directions.find((one) => one.recommended) ?? directions[0];

    setAnswers((previous) => ({
      ...previous,
      artFamilyId: family,
      artDirectionId: next?.id ?? previous.artDirectionId,
    }));
  }, []);

  const prompt = useMemo(() => compileBannerPrompt(answers), [answers]);
  const summary = useMemo(() => compileBriefSummary(answers), [answers]);
  const required = useMemo(() => collectRequiredAnswers(answers), [answers]);

  const download = useCallback(() => {
    const url = URL.createObjectURL(
      new Blob([prompt], { type: "text/markdown" })
    );
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "banner-prompt.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [prompt]);

  const steps = buildSteps({
    answers,
    download,
    onFix: (field) => setActiveId(STEP_BY_FIELD[field]),
    prompt,
    required,
    reset: () => setAnswers(DEFAULT_ANSWERS),
    selectArtFamily,
    summary,
    update,
  });

  // Layouts L3 and L4 drop whole steps, so the open one is tracked by id: an
  // index would point at a different question the moment the run gets shorter.
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === activeId)
  );
  const active = steps[activeIndex];
  const isLast = activeIndex === steps.length - 1;
  const upcoming = steps.slice(activeIndex + 1);

  const goTo = (index: number) => setActiveId(steps[index].id);

  return (
    <div className="thin_scrollbar flex h-96 flex-col gap-3 overflow-y-auto">
      <div className="sticky top-0 z-10 flex shrink-0 items-center gap-3 bg-bg-default">
        <p className="not-prose flex min-w-0 flex-1 items-center gap-2">
          <span className="shrink-0 font-departure-mono text-fg-tertiary text-xs tabular-nums">
            {activeIndex + 1}/{steps.length}
          </span>
          <span className="truncate font-medium text-fg-default text-sm">
            {active.label}
          </span>
        </p>

        <StepIndicator
          className="hidden sm:inline-flex"
          current={activeIndex + 1}
          onSelect={goTo}
          steps={steps.map((step) => step.label)}
        />

        <div className="flex shrink-0 items-center gap-1">
          <Button
            aria-label="Previous step"
            disabled={activeIndex === 0}
            iconOnly
            onClick={() => goTo(activeIndex - 1)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            disabled={isLast}
            onClick={() => goTo(activeIndex + 1)}
            size="sm"
            type="button"
            variant="outlined"
          >
            Next <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Without shrink-0 flex squashes this box while the step keeps its real
          height, and the cards spill over the ramp. */}
      <div className="shrink-0 p-1" key={active.id}>
        {active.renderControl()}
      </div>

      <div
        aria-hidden="true"
        className="min-h-23 flex-1 basis-0 select-none space-y-1 overflow-hidden"
      >
        {upcoming.map((step, offset) => (
          <StepRow
            fade={fadeAt(offset + 1)}
            index={activeIndex + offset + 1}
            key={step.id}
            label={step.label}
            summary={step.summary}
          />
        ))}
      </div>
    </div>
  );
}

function StepRow({
  index,
  label,
  summary,
  fade,
}: {
  index: number;
  label: string;
  summary?: string;
  fade: (typeof FADE)[number];
}) {
  return (
    <div
      className="pointer-events-none flex h-7 items-center gap-2 transition-[opacity,filter] duration-500 ease-out motion-reduce:transition-none"
      style={{ filter: `blur(${fade.blur}px)`, opacity: fade.opacity }}
    >
      <span className="w-4 shrink-0 font-departure-mono text-fg-tertiary text-xs tabular-nums">
        {index + 1}
      </span>
      <span className="shrink-0 font-medium text-fg-tertiary text-sm">
        {label}
      </span>
      {summary && (
        <span className="inline-flex h-6 min-w-0 flex-1 items-center gap-1.5 truncate rounded-sm bg-bg-secondary/60 px-2 text-fg-tertiary text-xs">
          <span className="truncate">{summary}</span>
        </span>
      )}
    </div>
  );
}

function buildSteps({
  answers,
  download,
  onFix,
  prompt,
  required,
  reset,
  selectArtFamily,
  summary,
  update,
}: {
  answers: BannerAnswers;
  download: () => void;
  onFix: (field: RequiredAnswer["field"]) => void;
  prompt: string;
  required: RequiredAnswer[];
  reset: () => void;
  selectArtFamily: (value: string) => void;
  summary: string;
  update: <K extends keyof BannerAnswers>(
    key: K,
    value: BannerAnswers[K]
  ) => void;
}): Step[] {
  const unfinished = required.filter((one) => !one.done);
  const hasArt = layoutHasArt(answers.layoutId);
  const hasCopy = layoutHasCopy(answers.layoutId);
  const isCustomSize = answers.platformId === "custom";
  const headlineWords = countHeadlineWords(answers.headline);
  const directions = ART_DIRECTIONS.filter(
    (one) => one.family === answers.artFamilyId
  );
  const steps: Step[] = [];

  if (hasCopy) {
    steps.push({
      id: "copy",
      label: "Your words",
      summary: answers.headline.trim() || "Nothing written yet",
      renderControl: () => (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner-headline">Headline (required)</Label>
            <Textarea
              aria-describedby="banner-headline-count"
              aria-required="true"
              className="min-h-16 text-sm"
              id="banner-headline"
              onChange={(event) => update("headline", event.target.value)}
              placeholder="Frontend engineer building product interfaces and design systems."
              value={answers.headline}
            />
            <p
              className={cn(
                "text-xs",
                headlineWords > HEADLINE_WORD_LIMIT
                  ? "text-fg-danger"
                  : "text-fg-tertiary"
              )}
              id="banner-headline-count"
            >
              {headlineWords} of {HEADLINE_WORD_LIMIT} words
              {headlineWords > HEADLINE_WORD_LIMIT &&
                " — the spec cuts long headlines rather than shrinking them."}
            </p>
          </div>

          <Input
            aria-required="true"
            className="text-sm"
            onChange={(event) => update("accentPhrase", event.target.value)}
            placeholder="Accent phrase (required)"
            size="sm"
            value={answers.accentPhrase}
          />
          <p className="text-fg-tertiary text-xs">
            The accent phrase is the only part of the headline printed in the
            palette&apos;s accent colour. It has to appear in the headline.
          </p>
        </div>
      ),
    });
  }

  steps.push(
    {
      id: "platform",
      label: "Platform",
      summary: describe(PLATFORMS, answers.platformId, (platform) =>
        platform.width
          ? `${platform.label} · ${platform.width} × ${platform.height}`
          : platform.label
      ),
      renderControl: () => (
        <div className="space-y-4">
          <OptionField
            columns={3}
            hideTitle
            hint="Where the banner is going. Everything else is sized to fit it."
            onChange={(value) => update("platformId", value)}
            options={PLATFORMS.map((platform) => ({
              value: platform.id,
              icon: PLATFORM_ICON[platform.id],
              label: platform.label,
              description: platform.description,
            }))}
            title="Platform"
            value={answers.platformId}
          />

          {isCustomSize && (
            <div className="flex items-center gap-4">
              <Input
                className="w-full text-sm"
                inputMode="numeric"
                onChange={(event) => update("customWidth", event.target.value)}
                placeholder="Width"
                size="sm"
                value={answers.customWidth}
              />
              <Input
                className="w-full text-sm"
                inputMode="numeric"
                onChange={(event) => update("customHeight", event.target.value)}
                placeholder="Height"
                size="sm"
                value={answers.customHeight}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "layout",
      label: "Layout",
      summary: describe(
        LAYOUTS,
        answers.layoutId,
        (layout) => `${layout.id} — ${layout.label}`
      ),
      renderControl: () => (
        <OptionField
          hideTitle
          hint="Where the words and the artwork sit."
          onChange={(value) => update("layoutId", value as LayoutId)}
          options={LAYOUTS.map((layout) => ({
            value: layout.id,
            code: layout.id,
            label: layout.label,
            description: layout.description,
          }))}
          title="Layout"
          value={answers.layoutId}
        />
      ),
    },
    {
      id: "palette",
      label: "Colours",
      summary: describe(
        PALETTES,
        answers.paletteId,
        (palette) => `${palette.id} ${palette.label}`
      ),
      renderControl: () => (
        <OptionField
          hideTitle
          hint="Four per set: the background, the text, the quieter text, and the one accent."
          onChange={(value) => update("paletteId", value)}
          options={PALETTES.map((palette) => ({
            value: palette.id,
            code: palette.id,
            label: palette.label,
            accessory: (
              <span className="mt-1 flex gap-1">
                {[
                  palette.field,
                  palette.ink,
                  palette.secondary,
                  palette.accent,
                ].map((color) => (
                  <span
                    className="size-5 rounded-xs border border-outline-default"
                    key={color}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
            ),
          }))}
          title="Colours"
          value={answers.paletteId}
        />
      ),
    }
  );

  if (hasArt) {
    steps.push(
      {
        id: "art",
        label: "Artwork",
        summary: describe(
          ART_DIRECTIONS,
          answers.artDirectionId,
          (direction) => `${direction.id} ${direction.label}`
        ),
        renderControl: () => (
          <div className="space-y-8">
            <OptionField
              onChange={selectArtFamily}
              options={ART_FAMILIES.map((family) => ({
                value: family.id,
                code: family.id,
                label: family.label,
                description: family.description,
              }))}
              title="Art style"
              value={answers.artFamilyId}
            />

            <OptionField
              columns={3}
              onChange={(value) => update("artDirectionId", value)}
              options={directions.map((direction) => ({
                value: direction.id,
                code: direction.id,
                label: direction.label,
                description: direction.description,
              }))}
              title="Pose and framing"
              value={answers.artDirectionId}
            />
          </div>
        ),
      },
      {
        id: "effect",
        label: "Edge effect",
        summary: describe(
          EFFECTS,
          answers.effectId,
          (effect) => `${effect.id} ${effect.label}`
        ),
        renderControl: () => (
          <OptionField
            columns={3}
            hideTitle
            hint="How one side of the figure meets the background. The rest stays sharp."
            onChange={(value) => update("effectId", value)}
            options={EFFECTS.map((effect) => ({
              value: effect.id,
              code: effect.id,
              label: effect.label,
              description: effect.description,
            }))}
            title="Edge effect"
            value={answers.effectId}
          />
        ),
      },
      {
        id: "art-note",
        label: "Anything else (Optional)",
        summary: answers.customArtNote.trim() || "Nothing added",
        renderControl: () => (
          <div className="space-y-2">
            <Label htmlFor="banner-art-note">
              Tweak the look in your own words
            </Label>
            <Textarea
              className="min-h-16 text-sm"
              id="banner-art-note"
              onChange={(event) => update("customArtNote", event.target.value)}
              placeholder="Cooler light, a heavier drape, a calmer pose."
              value={answers.customArtNote}
            />
            <p className="text-fg-tertiary text-xs">
              Describe general visual qualities. Naming a living artist or a
              copyrighted work will not work — the prompt tells the model to
              ignore it.
            </p>
          </div>
        ),
      }
    );
  }

  steps.push({
    id: "finish",
    label: hasCopy ? "Background and lettering" : "Background",
    summary: [
      describe(
        FIELD_FINISHES,
        answers.fieldFinishId,
        (finish) => `${finish.id} ${finish.label}`
      ),
      hasCopy &&
        describe(
          TYPOGRAPHY,
          answers.typographyId,
          (face) => `${face.id} ${face.label}`
        ),
    ]
      .filter(Boolean)
      .join(" · "),
    renderControl: () => (
      <div className="space-y-8">
        <OptionField
          columns={3}
          hint="The colour behind everything else."
          onChange={(value) => update("fieldFinishId", value)}
          options={FIELD_FINISHES.map((finish) => ({
            value: finish.id,
            code: finish.id,
            label: finish.label,
            description: finish.description,
          }))}
          title="Background"
          value={answers.fieldFinishId}
        />

        {hasCopy && (
          <OptionField
            onChange={(value) => update("typographyId", value)}
            options={TYPOGRAPHY.map((face) => ({
              value: face.id,
              code: face.id,
              label: face.label,
              description: face.description,
            }))}
            title="Lettering"
            value={answers.typographyId}
          />
        )}
      </div>
    ),
  });

  steps.push({
    id: "review",
    label: "Your brief",
    summary:
      unfinished.length > 0
        ? `Still needed: ${unfinished.map((one) => one.label).join(", ")}`
        : "Ready",
    renderControl: () => (
      <div className="space-y-3">
        {/* Capped: the panel around it scrolls too, and two nested scrollbars
            would bury the copy button under the brief. */}
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-sm bg-bg-default-alt p-3 font-departure-mono text-fg-secondary text-xs leading-relaxed">
          {summary}
        </pre>

        {unfinished.length > 0 ? (
          <p className="text-fg-warning text-xs">
            Still needed before you can copy:{" "}
            {unfinished.map((one, index) => (
              <Fragment key={one.field}>
                {index > 0 ? ", " : null}
                <button
                  className="cursor-pointer underline underline-offset-2 hover:text-fg-default"
                  onClick={() => onFix(one.field)}
                  type="button"
                >
                  {one.label}
                </button>
              </Fragment>
            ))}
            .
          </p>
        ) : (
          <p className="text-fg-tertiary text-xs">
            Copy hands over the full prompt — this brief plus the house rules
            that keep the result on-style.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <CopyButton
            content={prompt}
            disabled={unfinished.length > 0}
            size="sm"
            variant="outlined"
          />
          <Button
            aria-label="Download the prompt"
            disabled={unfinished.length > 0}
            iconOnly
            onClick={download}
            size="sm"
            type="button"
            variant="outlined"
          >
            <Download className="size-4" />
          </Button>
          <Button
            className="ml-auto"
            onClick={reset}
            size="sm"
            type="button"
            variant="ghost"
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>
      </div>
    ),
  });

  return steps;
}

function describe<T extends { id: string }>(
  list: T[],
  id: string,
  format: (option: T) => string
): string {
  const option = list.find((one) => one.id === id);

  return option ? format(option) : id;
}

// Other companies' brand constants rather than this site's palette, so the hex
// stays inline instead of becoming a semantic token. X has no brand colour
// beyond black and white, so its mark follows the foreground.
const PLATFORM_ICON: Record<string, ReactNode> = {
  linkedin: <Icons.linkedin />,
  x: <Icons.x />,
  custom: <Ruler />,
};

const STEP_BY_FIELD: Record<RequiredAnswer["field"], string> = {
  headline: "copy",
  accentPhrase: "copy",
  size: "platform",
};

const FADE = [
  { opacity: 1, blur: 0 },
  { opacity: 0.46, blur: 1 },
  { opacity: 0.22, blur: 2 },
  { opacity: 0.09, blur: 3.5 },
  { opacity: 0, blur: 4 },
] as const;

// Rows past the ramp stay at its last, invisible level: a short step leaves
// nine rows of slack, and nine blurred near-black rows read as a rendering
// fault. They still hold the box open.
const fadeAt = (depth: number) => FADE[Math.min(depth, FADE.length - 1)];
