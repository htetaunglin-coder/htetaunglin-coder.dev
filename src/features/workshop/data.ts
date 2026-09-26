const SKILLS_REPO_SLUG = "htetaunglin-coder/skills";

/**
 * Without `--skill`, the CLI lists the repo's skills and asks which to
 * install. `--all` or `-y` would skip that question and install every one.
 */
export const SKILLS_INSTALL_COMMAND = `npx skills add ${SKILLS_REPO_SLUG}`;
export const SKILLS_REPO_URL = `https://github.com/${SKILLS_REPO_SLUG}`;
export const SKILLS_SH_URL = `https://skills.sh/${SKILLS_REPO_SLUG}`;

export type SkillEntry = {
  name: string;
  /**
   * What the skill is for, in plain words. Bold only the phrase a skimmer must
   * not miss: bold on every item reads as no emphasis at all.
   */
  description: string;
  /** A one-line hook above the blurred description of an unfinished skill. */
  summary?: string;
  status: "published" | "in-progress";
};

/**
 * Every skill the page lists, in order. Written by hand rather than read from
 * the repo: SKILL.md's own description is written for the agent, as rules for
 * when to load it, so it reads badly to people. Add an entry here when a skill
 * lands in the repo.
 */
export const SKILLS: readonly SkillEntry[] = [
  {
    name: "frontend-standards",
    status: "published",
    description:
      "Keeps AI-written React and Next.js code in **one consistent shape**. Covers where code lives, Tailwind class composition, comments, file order, magic literals, conditional rendering and per-request state, the house rules the Vercel skills leave out.",
  },
  {
    name: "UI Generation",
    status: "in-progress",
    summary: "Interfaces that look designed, not generated.",
    description:
      "Ask any model for a UI and you get the same centred card, the same gradient, the same shadow. The output is competent and forgettable. This skill carries the judgement I would apply by hand: spacing rhythm, restraint with colour, and motion that settles instead of bounces.",
  },
];
