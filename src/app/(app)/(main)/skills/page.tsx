import type { Metadata } from "next";
import { SKILLS_SKETCH } from "@/components/decorations/workshop-sketch-art";
import { WorkshopView } from "@/features/workshop/components/workshop-view";
import { absoluteUrl } from "@/lib/utils";

const DESCRIPTION =
  "Claude Code skills I build for my own workflow. Each one exists because I got tired of explaining the same thing to an agent twice.";

export const metadata: Metadata = {
  title: "Skills",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/skills") },
  openGraph: {
    title: "Skills | Htet Aung Lin",
    description: DESCRIPTION,
    url: absoluteUrl("/skills"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Skills | Htet Aung Lin",
    description: DESCRIPTION,
  },
};

const MESSAGE =
  "I built these skills so I'd stop repeating myself to the agent, then never wrote them down anywhere. So I made this page first, now I have no choice but to finish them :3";

export default function SkillsPage() {
  return (
    <WorkshopView layers={SKILLS_SKETCH} message={MESSAGE} title="Skills" />
  );
}
