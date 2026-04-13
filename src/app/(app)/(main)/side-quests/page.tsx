import type { Metadata } from "next";
import { SideQuests } from "@/features/side-quests/components/side-quests";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Side Quests",
  description:
    "Personal projects, experiments, and side quests I'm working on.",
  alternates: {
    canonical: absoluteUrl("/side-quests"),
  },
  openGraph: {
    title: "Side Quests | Htet Aung Lin",
    description:
      "Personal projects, experiments, and side quests I'm working on.",
    url: absoluteUrl("/side-quests"),
    type: "website",
  },
};

const SideQuestsPage = () => (
  <main className="pt-4 pb-16 sm:pt-24 md:pt-16">
    <SideQuests />
  </main>
);

export default SideQuestsPage;
