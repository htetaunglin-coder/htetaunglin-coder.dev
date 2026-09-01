export type EntryStatus = "in-progress" | "published";

export type WorkshopEntry = {
  id: string;
  name: string;
  summary: string;
  body: string;
  status: EntryStatus;
};

export const SKILLS: readonly WorkshopEntry[] = [
  {
    id: "frontend-code-organization",
    name: "Frontend Code Organization",
    summary: "Where a file goes, and when it earns a promotion.",
    body: "Agents write code that works and lands in the wrong place. Every session I re-explained where a hook belongs, when a component graduates to shared, and why one feature must never import from another. This skill says it once, so review stops being where I catch it.",
    status: "in-progress",
  },
  {
    id: "ui-generation",
    name: "UI Generation",
    summary: "Interfaces that look designed, not generated.",
    body: "Ask any model for a UI and you get the same centred card, the same gradient, the same shadow. The output is competent and forgettable. This skill carries the judgement I would apply by hand: spacing rhythm, restraint with colour, and motion that settles instead of bounces.",
    status: "in-progress",
  },
];

export const DESIGN_SYSTEM: readonly WorkshopEntry[] = [
  {
    id: "tokens",
    name: "Tokens",
    summary: "Colour, radius, shadow and motion, defined once.",
    body: "Every colour here is a semantic token rather than a hex code — fg-default, bg-brand, outline-secondary. Light and dark carry the same names with different values, so a component never has to ask which theme it is in.",
    status: "in-progress",
  },
  {
    id: "components",
    name: "Components",
    summary: "Hand-written Radix wrappers, shadcn style.",
    body: "No generator and no registry. Each primitive is written to match its neighbours, which keeps the set small and the API predictable — and means every one of them can be read in a single sitting.",
    status: "in-progress",
  },
  {
    id: "motion",
    name: "Motion",
    summary: "Calm and trustworthy. Nothing bounces.",
    body: "One set of easing, duration and stagger tokens drives every animation on the site. The rule is a long glide to rest: motion that settles rather than snaps, and stops entirely when the reader asks for reduced motion.",
    status: "in-progress",
  },
  {
    id: "patterns",
    name: "Patterns",
    summary: "The decisions that repeat.",
    body: "Radius steps down with nesting depth. Images carry explicit responsive sizes. Theme-dependent UI renders nothing until it knows the theme. Small rules, applied everywhere, are most of what makes a site feel built by one person.",
    status: "in-progress",
  },
];
