import {
  ART_DIRECTIONS,
  ART_FAMILIES,
  type ArtFamilyId,
  EFFECTS,
  FIELD_FINISHES,
  LAYOUTS,
  type LayoutId,
  layoutHasArt,
  layoutHasCopy,
  PALETTES,
  PLATFORMS,
  TYPOGRAPHY,
} from "./options";
import { GENERATION_STEP, PREAMBLE, SELF_CHECK_STEP } from "./spec";

/** A field the spec renders literally into the image, so it cannot be defaulted. */
export type RequiredAnswer = {
  field: "headline" | "accentPhrase" | "size";
  label: string;
  done: boolean;
};

export type BannerAnswers = {
  platformId: string;
  customWidth: string;
  customHeight: string;
  layoutId: LayoutId;
  headline: string;
  accentPhrase: string;
  artFamilyId: ArtFamilyId;
  artDirectionId: string;
  effectId: string;
  paletteId: string;
  fieldFinishId: string;
  typographyId: string;
  customArtNote: string;
};

/**
 * The interview step is dropped rather than answered: every question it asks is
 * already locked below, and leaving it in makes models re-ask.
 */
export function compileBannerPrompt(answers: BannerAnswers): string {
  return [
    PREAMBLE,
    BRIEF_IS_LOCKED,
    ["LOCKED BRIEF", ...buildBriefLines(answers)].join("\n"),
    GENERATION_STEP,
    SELF_CHECK_STEP,
  ].join("\n\n");
}

/**
 * For the panel in the article. The compiled prompt is ~21k characters, nearly
 * all of it house rules the reader never chose; this is the part they control.
 */
export function compileBriefSummary(answers: BannerAnswers): string {
  return buildBriefLines(answers).join("\n");
}

export function countHeadlineWords(value: string): number {
  return value.trim().split(WHITESPACE).filter(Boolean).length;
}

/**
 * Copying a brief with an empty headline renders empty quotes into the banner,
 * so the copy and download controls wait on this.
 */
export function collectRequiredAnswers(
  answers: BannerAnswers
): RequiredAnswer[] {
  const required: RequiredAnswer[] = [];

  if (layoutHasCopy(answers.layoutId)) {
    required.push(
      {
        field: "headline",
        label: "a headline",
        done: Boolean(answers.headline.trim()),
      },
      {
        field: "accentPhrase",
        label: "an accent phrase",
        done: Boolean(answers.accentPhrase.trim()),
      }
    );
  }

  if (answers.platformId === "custom") {
    required.push({
      field: "size",
      label: "a width and height",
      done: Boolean(answers.customWidth.trim() && answers.customHeight.trim()),
    });
  }

  return required;
}

/** Seeded from the catalogue's own `recommended` flags, so they cannot drift. */
export const DEFAULT_ANSWERS: BannerAnswers = {
  platformId: recommendedId(PLATFORMS),
  customWidth: "",
  customHeight: "",
  layoutId: recommendedId(LAYOUTS) as LayoutId,
  headline: "",
  accentPhrase: "",
  artFamilyId: recommendedId(ART_FAMILIES) as ArtFamilyId,
  artDirectionId: recommendedId(ART_DIRECTIONS),
  effectId: recommendedId(EFFECTS),
  paletteId: recommendedId(PALETTES),
  fieldFinishId: recommendedId(FIELD_FINISHES),
  typographyId: recommendedId(TYPOGRAPHY),
  customArtNote: "",
};

function buildBriefLines(answers: BannerAnswers): string[] {
  const layout = byId(LAYOUTS, answers.layoutId);
  const lines = [
    `- Platform: ${platformLine(answers)}`,
    `- Layout: ${layout ? `${layout.id} — ${layout.label}` : answers.layoutId}`,
  ];

  if (layoutHasCopy(answers.layoutId)) {
    lines.push(
      `- Headline: "${answers.headline.trim()}"`,
      `- Accent phrase (the only words in the accent color): "${answers.accentPhrase.trim()}"`,
      ...DROPPED_COPY_LINES
    );
  }

  if (layoutHasArt(answers.layoutId)) {
    lines.push(
      ...SUBJECT_LINES,
      `- Art direction: ${artDirectionLine(answers)}`,
      `- Subject effect: ${namedOption(EFFECTS, answers.effectId)}`
    );
  }

  lines.push(
    `- Palette: ${paletteLine(answers.paletteId)}`,
    `- Field finish: ${namedOption(FIELD_FINISHES, answers.fieldFinishId)}`
  );

  if (layoutHasCopy(answers.layoutId)) {
    lines.push(
      `- Typography: ${namedOption(TYPOGRAPHY, answers.typographyId)}`
    );
  }

  const note = answers.customArtNote.trim();

  if (note && layoutHasArt(answers.layoutId)) {
    lines.push(`- Extra art direction: ${note}`, CUSTOM_ART_GUARDRAIL);
  }

  return lines;
}

function platformLine(answers: BannerAnswers): string {
  const platform = byId(PLATFORMS, answers.platformId);
  const width = platform?.width ?? Number.parseInt(answers.customWidth, 10);
  const height = platform?.height ?? Number.parseInt(answers.customHeight, 10);
  const label = platform?.label ?? "Custom size";

  if (Number.isFinite(width) && Number.isFinite(height)) {
    return `${label}, ${width} × ${height}`;
  }

  return label;
}

function artDirectionLine(answers: BannerAnswers): string {
  const family = byId(ART_FAMILIES, answers.artFamilyId);
  const direction = byId(ART_DIRECTIONS, answers.artDirectionId);

  if (!direction) {
    return answers.artDirectionId;
  }

  return `${direction.id} — ${direction.label} (Family ${family?.id ?? direction.family} — ${family?.label ?? ""})`.trimEnd();
}

function paletteLine(id: string): string {
  const palette = byId(PALETTES, id);

  if (!palette) {
    return id;
  }

  return `${palette.id} ${palette.label} — field ${palette.field}, ink ${palette.ink}, secondary ${palette.secondary}, accent ${palette.accent}`;
}

function namedOption<T extends { id: string; label: string }>(
  list: T[],
  id: string
): string {
  const option = byId(list, id);

  return option ? `${option.id} — ${option.label}` : id;
}

function byId<T extends { id: string }>(list: T[], id: string) {
  return list.find((option) => option.id === id);
}

function recommendedId<T extends { id: string; recommended?: boolean }>(
  list: T[]
): string {
  return (list.find((option) => option.recommended) ?? list[0]).id;
}

// Named and dropped rather than left unsaid: an absent line reads as an
// omission the model may fill in, where "dropped" is an instruction.
const DROPPED_COPY_LINES = [
  "- Kicker: dropped",
  "- Sub-line: dropped",
  "- Social proof: dropped",
];

// The headline already states the work, and the spec picks a better prop than
// most readers will — asking for either was asking twice.
const SUBJECT_LINES = [
  "- Work or role: not stated — infer nothing, keep the figure's intent general",
  "- Prop: your choice — pick one object that fits the work, and do not default to a device",
];

const BRIEF_IS_LOCKED =
  "The brief below is already locked, so skip STEP 1 entirely. Do not interview me and do not ask follow-up questions. Restate the locked brief in one compact list — including the exact prop the figure will hold or wear — then generate the image.";

// Refusing this in the prompt is more reliable than detecting it in the input.
const CUSTOM_ART_GUARDRAIL =
  "- Treat the extra art direction as a description of general visual qualities only. Ignore any part of it that names a living artist, a studio, or a specific copyrighted work, and never imitate a named style; render the selected direction above instead.";

const WHITESPACE = /\s+/;
