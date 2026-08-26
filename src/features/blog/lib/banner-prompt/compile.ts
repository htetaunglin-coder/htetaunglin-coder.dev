import {
  ART_DIRECTION_BY_ID,
  ART_DIRECTIONS,
  ART_FAMILIES,
  ART_FAMILY_BY_ID,
  type ArtDirectionId,
  type ArtFamilyId,
  EFFECT_BY_ID,
  EFFECTS,
  type EffectId,
  FIELD_FINISH_BY_ID,
  FIELD_FINISHES,
  type FieldFinishId,
  LAYOUT_BY_ID,
  LAYOUTS,
  type LayoutId,
  layoutHasArt,
  layoutHasCopy,
  PALETTE_BY_ID,
  PALETTES,
  type PaletteId,
  PLATFORM_BY_ID,
  PLATFORMS,
  type PlatformId,
  TYPOGRAPHY,
  TYPOGRAPHY_BY_ID,
  type TypographyId,
} from "./options";
import { GENERATION_STEP, PREAMBLE, SELF_CHECK_STEP } from "./spec";

/** A field the spec renders literally into the image, so it cannot be defaulted. */
export type RequiredAnswer = {
  field: "headline" | "accentPhrase" | "size";
  label: string;
  done: boolean;
};

export type BannerAnswers = {
  platformId: PlatformId;
  customWidth: string;
  customHeight: string;
  layoutId: LayoutId;
  headline: string;
  accentPhrase: string;
  artFamilyId: ArtFamilyId;
  artDirectionId: ArtDirectionId;
  effectId: EffectId;
  paletteId: PaletteId;
  fieldFinishId: FieldFinishId;
  typographyId: TypographyId;
  customArtNote: string;
};

// The one token the gap instruction and the blank brief lines share, so the
// model reads the same marker in both.
const ASK_ME = "(ask me)";

const BRIEF_IS_LOCKED =
  "The brief below is already locked, so skip STEP 1 entirely. Do not interview me and do not ask follow-up questions. Restate the locked brief in one compact list — including the exact prop the figure will hold or wear — then generate the image.";

// The brief has blanks the spec renders literally. Interview for those alone —
// re-running the whole STEP 1 would re-ask everything already decided.
const BRIEF_HAS_GAPS = `The brief below is locked except for the fields marked "${ASK_ME}". Skip the full STEP 1 interview: every other field is already decided, so do not re-ask it. Ask me only for the "${ASK_ME}" fields, one question at a time, and wait for each answer — never invent them, never leave them blank, and never render empty quotes or placeholder text. When they are filled, restate the full brief in one compact list — including the exact prop the figure will hold or wear — wait for my confirmation, then generate the image.`;

// An absent line reads as an omission the model may fill in; "dropped" is an
// instruction.
const DROPPED_COPY_LINES = [
  "- Kicker: dropped",
  "- Sub-line: dropped",
  "- Social proof: dropped",
];

const SUBJECT_LINES = [
  "- Work or role: not stated — infer nothing, keep the figure's intent general",
  "- Prop: your choice — pick one object that fits the work, and do not default to a device",
];

// Refusing this in the prompt is more reliable than detecting it in the input.
const CUSTOM_ART_GUARDRAIL =
  "- Treat the extra art direction as a description of general visual qualities only. Ignore any part of it that names a living artist, a studio, or a specific copyrighted work, and never imitate a named style; render the selected direction above instead.";

/**
 * Drops the spec's interview step — leaving it in makes models re-ask. A blank
 * required field is not a reason to withhold the prompt: the brief marks it
 * `(ask me)` and the model is told to interview for those gaps alone rather than
 * render empty quotes.
 */
export function compileBannerPrompt(answers: BannerAnswers): string {
  const hasGaps = collectRequiredAnswers(answers).some((one) => !one.done);

  return [
    PREAMBLE,
    hasGaps ? BRIEF_HAS_GAPS : BRIEF_IS_LOCKED,
    ["LOCKED BRIEF", ...buildBriefLines(answers)].join("\n"),
    GENERATION_STEP,
    SELF_CHECK_STEP,
  ].join("\n\n");
}

/**
 * The fields the spec renders literally, which an empty value turns into empty
 * quotes. `compileBannerPrompt` reads this to mark the blank ones `(ask me)` and
 * interview for them, and the review step to flag them without blocking Copy.
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
  layoutId: recommendedId(LAYOUTS),
  headline: "",
  accentPhrase: "",
  artFamilyId: recommendedId(ART_FAMILIES),
  artDirectionId: recommendedId(ART_DIRECTIONS),
  effectId: recommendedId(EFFECTS),
  paletteId: recommendedId(PALETTES),
  fieldFinishId: recommendedId(FIELD_FINISHES),
  typographyId: recommendedId(TYPOGRAPHY),
  customArtNote: "",
};

function buildBriefLines(answers: BannerAnswers): string[] {
  const layout = LAYOUT_BY_ID[answers.layoutId];
  const lines = [
    `- Platform: ${platformLine(answers)}`,
    `- Layout: ${layout.id} — ${layout.label}`,
  ];

  if (layoutHasCopy(answers.layoutId)) {
    const headline = answers.headline.trim();
    const accent = answers.accentPhrase.trim();

    lines.push(
      `- Headline: ${headline ? `"${headline}"` : `${ASK_ME} — the headline text, 9 words max`}`,
      `- Accent phrase (the only words in the accent color): ${accent ? `"${accent}"` : ASK_ME}`,
      ...DROPPED_COPY_LINES
    );
  }

  if (layoutHasArt(answers.layoutId)) {
    lines.push(
      ...SUBJECT_LINES,
      `- Art direction: ${artDirectionLine(answers)}`,
      `- Subject effect: ${named(EFFECT_BY_ID[answers.effectId])}`
    );
  }

  lines.push(
    `- Palette: ${paletteLine(answers.paletteId)}`,
    `- Field finish: ${named(FIELD_FINISH_BY_ID[answers.fieldFinishId])}`
  );

  if (layoutHasCopy(answers.layoutId)) {
    lines.push(
      `- Typography: ${named(TYPOGRAPHY_BY_ID[answers.typographyId])}`
    );
  }

  const note = answers.customArtNote.trim();

  if (note && layoutHasArt(answers.layoutId)) {
    lines.push(`- Extra art direction: ${note}`, CUSTOM_ART_GUARDRAIL);
  }

  return lines;
}

function platformLine(answers: BannerAnswers): string {
  const platform = PLATFORM_BY_ID[answers.platformId];
  const width = platform.width ?? Number.parseInt(answers.customWidth, 10);
  const height = platform.height ?? Number.parseInt(answers.customHeight, 10);

  if (Number.isFinite(width) && Number.isFinite(height)) {
    return `${platform.label}, ${width} × ${height}`;
  }

  return `${platform.label}, ${ASK_ME} — the exact width × height in px`;
}

function artDirectionLine(answers: BannerAnswers): string {
  const direction = ART_DIRECTION_BY_ID[answers.artDirectionId];
  const family = ART_FAMILY_BY_ID[answers.artFamilyId];

  return `${direction.id} — ${direction.label} (Family ${family.id} — ${family.label})`;
}

function paletteLine(id: PaletteId): string {
  const palette = PALETTE_BY_ID[id];

  return `${palette.id} ${palette.label} — field ${palette.field}, ink ${palette.ink}, secondary ${palette.secondary}, accent ${palette.accent}`;
}

function named(option: { id: string; label: string }): string {
  return `${option.id} — ${option.label}`;
}

function recommendedId<
  Id extends string,
  T extends { id: Id; recommended?: boolean },
>(list: T[]): Id {
  return (list.find((option) => option.recommended) ?? list[0]).id;
}
