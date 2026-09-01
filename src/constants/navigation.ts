import { Component, Contact, Lightbulb, Mountain, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import {
  DesignSystemIllustration,
  SkillsIllustration,
} from "@/components/decorations/workshop-illustrations";

export type BaseLinkItem = {
  id: string;
  title: string;
  href: string;
};

export type MainPageItem = BaseLinkItem & {};

export const MAIN_PAGES: readonly MainPageItem[] = [
  { id: "home", title: "Home", href: "/" },
  { id: "projects", title: "Projects", href: "/projects" },
  { id: "blog", title: "Blog", href: "/blog" },
  { id: "about", title: "About", href: "/about" },
  {
    id: "resume",
    title: "Resume",
    href: `${process.env.NEXT_PUBLIC_APP_URL}/resume`,
  },
];

/* -------------------------------------------------------------------------- */

export type SideQuestItem = BaseLinkItem & {
  image: string;
  alt: string;
};

export const SIDE_QUESTS: readonly SideQuestItem[] = [
  {
    id: "side-quest-1",
    href: "/side-quests#gym",
    image: "sidequest_gym.jpg",
    alt: "Gym fitness journey",
    title: "GYM",
  },
  {
    id: "side-quest-2",
    href: "/side-quests#guitar",
    image: "sidequest_guitar.jpg",
    alt: "Guitar learning progress",
    title: "Guitar",
  },
  {
    id: "side-quest-3",
    href: "/side-quests#nature",
    image: "sidequest_nature.jpg",
    alt: "Touching grass and escaping screens",
    title: "Touch Grass",
  },
];

/* -------------------------------------------------------------------------- */

export type OtherPageLinkItem = BaseLinkItem & {
  description: string;
  icon: ComponentType;
};

export type WorkshopItem = OtherPageLinkItem & {
  soon?: boolean;
  illustration: ComponentType<{ className?: string }>;
};

export type OtherPages = {
  links: OtherPageLinkItem[];
  workshop: {
    title: string;
    items: readonly WorkshopItem[];
  };
  sideQuest: OtherPageLinkItem & {
    items: readonly SideQuestItem[];
  };
};

export const OTHER_PAGES: Readonly<OtherPages> = {
  workshop: {
    title: "Workshop",
    items: [
      {
        id: "skills",
        title: "Skills",
        description: "Claude Code skills I use daily, written down once.",
        icon: Wrench,
        href: "/skills",
        illustration: SkillsIllustration,
        soon: true,
      },
      {
        id: "design-system",
        title: "Design System",
        description: "The one running this site. Rules and components to copy.",
        icon: Component,
        href: "/design-system",
        illustration: DesignSystemIllustration,
        soon: true,
      },
    ],
  },
  sideQuest: {
    id: "side-quests",
    title: "Side Quests",
    description: "Things I do outside of work.",
    icon: Mountain,
    href: "/side-quests",
    items: SIDE_QUESTS,
  },
  links: [
    {
      id: "guestbook",
      title: "Guestbook",
      description: "Leave me a message.",
      icon: Contact,
      href: "/guest-book",
    },
    {
      id: "resources",
      title: "Resources",
      description: "Links worth sharing.",
      icon: Lightbulb,
      href: "/blog/resources",
    },
  ],
};
