/**
 * The option catalogue the builder renders and `compile.ts` reads.
 *
 * IDs (L1, A3, E1, P2…) are the spec's own vocabulary, not display detail — the
 * compiled prompt names them so the image model can match a choice to the rule
 * that describes it in `GENERATION_STEP`.
 */

export type PlatformId = "linkedin" | "x" | "custom";

export type Platform = {
  id: PlatformId;
  label: string;
  description: string;
  /** Absent on the custom platform, where the reader supplies the size. */
  width?: number;
  height?: number;
  recommended?: boolean;
};

export type LayoutId = "L1" | "L2" | "L3" | "L4";

export type Layout = {
  id: LayoutId;
  label: string;
  description: string;
  recommended?: boolean;
};

export type ArtFamilyId = "M" | "P";

export type ArtFamily = {
  id: ArtFamilyId;
  label: string;
  description: string;
  recommended?: boolean;
};

export type ArtDirectionId =
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A6"
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "B5"
  | "B6";

export type ArtDirection = {
  id: ArtDirectionId;
  family: ArtFamilyId;
  label: string;
  description: string;
  /** Reference render — a Cloudinary public ID, served through `CloudinaryImage`. */
  image?: {
    src: string;
    width: number;
    height: number;
  };
  recommended?: boolean;
};

export type EffectId = "E0" | "E1" | "E2" | "E3" | "E4";

export type Effect = {
  id: EffectId;
  label: string;
  description: string;
  recommended?: boolean;
};

export type PaletteId = "P1" | "P2" | "P3" | "P4";

export type Palette = {
  id: PaletteId;
  label: string;
  field: string;
  ink: string;
  secondary: string;
  accent: string;
  recommended?: boolean;
};

export type FieldFinishId = "F1" | "F2" | "F3";

export type FieldFinish = {
  id: FieldFinishId;
  label: string;
  description: string;
  recommended?: boolean;
};

export type TypographyId = "T1" | "T2";

export type Typography = {
  id: TypographyId;
  label: string;
  description: string;
  recommended?: boolean;
};

/** L3 is typography only and L4 is artwork only, so each drops half the form. */
export const layoutHasArt = (id: LayoutId): boolean => id !== "L3";

export const layoutHasCopy = (id: LayoutId): boolean => id !== "L4";

export const PLATFORMS: Platform[] = [
  {
    id: "linkedin",
    label: "LinkedIn cover",
    description: "1584 × 396. The avatar overlaps the left quarter.",
    width: 1584,
    height: 396,
    recommended: true,
  },
  {
    id: "x",
    label: "X header",
    description: "1500 × 500. The avatar overlaps the bottom-left quadrant.",
    width: 1500,
    height: 500,
  },
  {
    id: "custom",
    label: "Custom size",
    description: "Any width and height you name.",
  },
];

export const LAYOUTS: Layout[] = [
  {
    id: "L1",
    label: "Text left / art right",
    description: "The safest choice on LinkedIn — clear of your avatar.",
    recommended: true,
  },
  {
    id: "L2",
    label: "Art left / text right",
    description: "The mirror. On LinkedIn your avatar covers this corner.",
  },
  {
    id: "L3",
    label: "Typography only",
    description: "No figure. Your words carry the whole banner.",
  },
  {
    id: "L4",
    label: "Artwork only",
    description: "No words at all. The figure carries the whole banner.",
  },
];

export const ART_FAMILIES: ArtFamily[] = [
  {
    id: "M",
    label: "Marble sculpture",
    description: "Carved stone. Quiet and serious.",
    recommended: true,
  },
  {
    id: "P",
    label: "Painted storybook",
    description: "Warm classical painting, in full colour.",
  },
];

export const ART_DIRECTIONS: ArtDirection[] = [
  {
    id: "A1",
    family: "M",
    label: "Serene Marble",
    description:
      "Polished porcelain-white figure, head level and gaze steady, calm smooth studio finish.",
    image: {
      src: "a1-cutout_ligiwm",
      width: 1123,
      height: 1400,
    },
    recommended: true,
  },
  {
    id: "A2",
    family: "M",
    label: "Seated Scholar",
    description:
      "Figure seated deep in its work, prop in hand, grounded and thoughtful.",
    image: {
      src: "a2-cutout_quvcfu",
      width: 600,
      height: 900,
    },
  },
  {
    id: "A3",
    family: "M",
    label: "Standing Figure",
    description:
      "Full-figure neoclassical stance, head carried high, prop at rest, museum poise.",
    image: {
      src: "a3-cutout_efaoux",
      width: 1024,
      height: 1536,
    },
  },
  {
    id: "A4",
    family: "M",
    label: "Veiled Muse",
    description:
      "Head-and-shoulders drama: veil or diadem, warm veined marble, a strong head turn.",
    image: {
      src: "a4-cutout_zobdql",
      width: 600,
      height: 900,
    },
  },
  {
    id: "A5",
    family: "M",
    label: "Draped Motion",
    description:
      "Raised arms and a billowing mantle over a full gown, baroque movement frozen mid-gesture.",
    image: {
      src: "a5-cutout_d3evdi",
      width: 600,
      height: 900,
    },
  },
  {
    id: "A6",
    family: "M",
    label: "Winged Angel",
    description: "Serene angel with large feathered wings, hands quiet.",
    image: {
      src: "a6-cutout_cftnrh",
      width: 720,
      height: 900,
    },
  },
  {
    id: "B1",
    family: "P",
    label: "Seated Reader",
    description:
      "White-gowned figure curled in an ornate chair, absorbed in the prop.",
    image: {
      src: "b1-cutout_ux870q",
      width: 600,
      height: 900,
    },
    recommended: true,
  },
  {
    id: "B2",
    family: "P",
    label: "Heroic Gesture",
    description: "Full-figure hero, red cloak billowing, arm flung high.",
    image: {
      src: "b2-cutout_ge1nmt",
      width: 600,
      height: 900,
    },
  },
  {
    id: "B3",
    family: "P",
    label: "Ascending Angel",
    description: "Angel mid-flight, layered colorful wings, drapery streaming.",
    image: {
      src: "b3-cutout_jntvze",
      width: 600,
      height: 900,
    },
  },
  {
    id: "B4",
    family: "P",
    label: "Storybook Gentleman",
    description:
      "Romantic-era dress: embroidered coat, cravat, tall riding boots.",
    image: {
      src: "b4-cutout_cn6png",
      width: 600,
      height: 900,
    },
  },
  {
    id: "B5",
    family: "P",
    label: "Cloud Daydreamer",
    description:
      "Winged figure seated on a cloud, chin in hand, lost in thought.",
    image: {
      src: "b5-cutout_cyd3li",
      width: 600,
      height: 900,
    },
  },
  {
    id: "B6",
    family: "P",
    label: "Victorian Parlor",
    description:
      "Ornate lace-and-ribbon gown and flowered hat, prop held close.",
    image: {
      src: "b6-cutout_ad9eac",
      width: 600,
      height: 900,
    },
  },
];

export const EFFECTS: Effect[] = [
  {
    id: "E0",
    label: "Clean Cutout",
    description: "Sharp all the way round. Nothing fades.",
  },
  {
    id: "E1",
    label: "Grain Fade",
    description: "One side fades into fine grain.",
    recommended: true,
  },
  {
    id: "E2",
    label: "Halftone Fade",
    description: "One side breaks into shrinking print dots.",
  },
  {
    id: "E3",
    label: "Engraving Fade",
    description: "One side breaks into fine sketch lines.",
  },
  {
    id: "E4",
    label: "Blueprint Fade",
    description: "One side breaks into faint blueprint lines.",
  },
];

export const PALETTES: Palette[] = [
  {
    id: "P1",
    label: "Rust Editorial",
    field: "#F2EDE6",
    ink: "#1A1A1A",
    secondary: "#6F6A64",
    accent: "#A63B1F",
    recommended: true,
  },
  {
    id: "P2",
    label: "Imperial Purple",
    field: "#F2EDE6",
    ink: "#1A1A1A",
    secondary: "#6F6A64",
    accent: "#4A3A78",
  },
  {
    id: "P3",
    label: "Deep Cobalt",
    field: "#F3F0EA",
    ink: "#171A1F",
    secondary: "#68707A",
    accent: "#31558A",
  },
  {
    id: "P4",
    label: "Forest Editorial",
    field: "#F1EEE6",
    ink: "#18201C",
    secondary: "#687069",
    accent: "#365A48",
  },
];

export const FIELD_FINISHES: FieldFinish[] = [
  {
    id: "F1",
    label: "Flat",
    description: "One solid colour, edge to edge.",
    recommended: true,
  },
  {
    id: "F2",
    label: "Paper grain",
    description: "The same colour, lightly grained like uncoated paper.",
  },
  {
    id: "F3",
    label: "Grainy gradient",
    description: "Drifts between two or three shades of that colour.",
  },
];

export const TYPOGRAPHY: Typography[] = [
  {
    id: "T1",
    label: "Neo-grotesk",
    description: "Inter or Helvetica-like. Neutral and technical.",
    recommended: true,
  },
  {
    id: "T2",
    label: "Soft geometric",
    description: "Poppins or Avenir-like. Modern and approachable.",
  },
];

export const PLATFORM_BY_ID = indexById(PLATFORMS);
export const LAYOUT_BY_ID = indexById(LAYOUTS);
export const ART_FAMILY_BY_ID = indexById(ART_FAMILIES);
export const ART_DIRECTION_BY_ID = indexById(ART_DIRECTIONS);
export const EFFECT_BY_ID = indexById(EFFECTS);
export const PALETTE_BY_ID = indexById(PALETTES);
export const FIELD_FINISH_BY_ID = indexById(FIELD_FINISHES);
export const TYPOGRAPHY_BY_ID = indexById(TYPOGRAPHY);

/** Nine words, per the spec's headline rule. */
export const HEADLINE_WORD_LIMIT = 9;

function indexById<Id extends string, T extends { id: Id }>(
  list: T[]
): Record<Id, T> {
  return Object.fromEntries(list.map((one) => [one.id, one])) as Record<Id, T>;
}
