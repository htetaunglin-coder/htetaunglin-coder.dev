import type { Metadata } from "next";
import { SKILLS_PAGE } from "@/constants/navigation";
import { getRepoSkills } from "@/features/workshop/api/github-skills";
import { SkillsIndexView } from "@/features/workshop/components/skills-index-view";
import { absoluteUrl } from "@/lib/utils";

const PAGE_URL = absoluteUrl(SKILLS_PAGE.href);

const DESCRIPTION =
  "Claude Code skills I build for my own workflow. Each one exists because I got tired of explaining the same thing to an agent twice.";

export const metadata: Metadata = {
  title: "Skills",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Skills | Htet Aung Lin",
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Skills | Htet Aung Lin",
    description: DESCRIPTION,
  },
};

export default async function SkillsPage() {
  const repoSkills = await getRepoSkills();

  return <SkillsIndexView description={DESCRIPTION} skills={repoSkills} />;
}
