import { Contact, Lightbulb } from "lucide-react";
import type { ComponentType } from "react";

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

export type OtherPages = {
  links: OtherPageLinkItem[];
  sideQuest: {
    title: string;
    description: string;
    items: readonly SideQuestItem[];
    href: string;
  };
};

export const OTHER_PAGES: Readonly<OtherPages> = {
  sideQuest: {
    title: "Side Quests",
    description: "Things I do outside of work.",
    items: SIDE_QUESTS,
    href: "/side-quests",
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
      href: "/resources",
    },
  ],
};
