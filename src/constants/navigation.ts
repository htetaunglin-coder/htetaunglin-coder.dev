import { Contact, Music } from "lucide-react";
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
  { id: "blogs", title: "Blogs", href: "/blogs" },
  { id: "about", title: "About", href: "/about" },
  { id: "resume", title: "Resume", href: "/resume" },
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
    image: "/images/side-quests/gym.png",
    alt: "Gym fitness journey",
    title: "GYM",
  },
  {
    id: "side-quest-2",
    href: "/side-quests#guitar",
    image: "/images/side-quests/guitar.jpg",
    alt: "Guitar learning progress",
    title: "Guitar",
  },
  {
    id: "side-quest-3",
    href: "/side-quests#touch-grass",
    image: "/images/side-quests/touch-grass.jpg",
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
  };
};

export const OTHER_PAGES: Readonly<OtherPages> = {
  sideQuest: {
    title: "Side Quest",
    description: "Things I do outside of work.",
    items: SIDE_QUESTS,
  },
  links: [
    {
      id: "guestbook",
      title: "Guestbook",
      description: "Leave me a message",
      icon: Contact,
      href: "/guestbook",
    },
    {
      id: "music",
      title: "Music",
      description: "Discover my favorite playlists",
      icon: Music,
      href: "/music",
    },
  ],
};
