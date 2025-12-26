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
  <main className="py-16 sm:pt-24 md:pt-32">
    <div className="mx-auto w-full max-w-4xl px-6 lg:px-0">
      <SideQuests />
    </div>
  </main>
);

export default SideQuestsPage;
