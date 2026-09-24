export type WorkshopEntry = {
  name: string;
  summary: string;
  body: string;
};

export const SKILLS: readonly WorkshopEntry[] = [
  {
    name: "UI Generation",
    summary: "Interfaces that look designed, not generated.",
    body: "Ask any model for a UI and you get the same centred card, the same gradient, the same shadow. The output is competent and forgettable. This skill carries the judgement I would apply by hand: spacing rhythm, restraint with colour, and motion that settles instead of bounces.",
  },
];
