/**
 * The option catalogue the builder renders and `compile.ts` reads.
 *
 * IDs (L1, A3, E1, P2…) are the spec's own vocabulary, not display detail — the
 * compiled prompt names them so the image model can match a choice to the rule
 * that describes it in `GENERATION_STEP`.
 */

export type Platform = {
  id: string;
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

export type ArtDirection = {
  id: string;
  family: ArtFamilyId;
  label: string;
  description: string;
  recommended?: boolean;
};

export type Effect = {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
};

export type Palette = {
  id: string;
  label: string;
  field: string;
  ink: string;
  secondary: string;
  accent: string;
  recommended?: boolean;
};

export type FieldFinish = {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
};

export type Typography = {
  id: string;
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
      "Polished porcelain-white figure, eyes lowered, calm smooth studio finish.",
    recommended: true,
  },
  {
    id: "A2",
    family: "M",
    label: "Seated Scholar",
    description:
      "Figure seated deep in its work, prop in hand, grounded and thoughtful.",
  },
  {
    id: "A3",
    family: "M",
    label: "Standing Figure",
    description:
      "Full-figure neoclassical stance, prop carried at rest, museum poise.",
  },
  {
    id: "A4",
    family: "M",
    label: "Veiled Muse",
    description:
      "Head-and-shoulders drama: veil or diadem, warm veined marble, a strong head turn.",
  },
  {
    id: "A5",
    family: "M",
    label: "Draped Motion",
    description:
      "Raised arms and billowing drapery, baroque movement frozen mid-gesture.",
  },
  {
    id: "A6",
    family: "M",
    label: "Winged Angel",
    description: "Serene angel with large feathered wings, hands quiet.",
  },
  {
    id: "B1",
    family: "P",
    label: "Seated Reader",
    description:
      "White-gowned figure curled in an ornate chair, absorbed in the prop.",
    recommended: true,
  },
  {
    id: "B2",
    family: "P",
    label: "Heroic Gesture",
    description: "Full-figure hero, red cloak billowing, arm flung high.",
  },
  {
    id: "B3",
    family: "P",
    label: "Ascending Angel",
    description: "Angel mid-flight, layered colorful wings, drapery streaming.",
  },
  {
    id: "B4",
    family: "P",
    label: "Storybook Gentleman",
    description:
      "Romantic-era dress: embroidered coat, cravat, tall riding boots.",
  },
  {
    id: "B5",
    family: "P",
    label: "Cloud Daydreamer",
    description:
      "Winged figure seated on a cloud, chin in hand, lost in thought.",
  },
  {
    id: "B6",
    family: "P",
    label: "Victorian Parlor",
    description:
      "Ornate lace-and-ribbon gown and flowered hat, prop held close.",
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
    label: "Particle Dissolve",
    description: "One side breaks into fine dust.",
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

/** Nine words, per the spec's headline rule. */
export const HEADLINE_WORD_LIMIT = 9;
