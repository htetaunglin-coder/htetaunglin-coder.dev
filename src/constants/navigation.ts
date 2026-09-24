import { Component, Contact, Lightbulb, Mountain, Wrench } from "lucide-react";
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

export type WorkshopItem = OtherPageLinkItem & {
  soon?: boolean;
  /** The page's own hero photo, cropped to the tile. `position` pans it; a
   * photo wider than the tile only moves on x. */
  image: { src: string; alt: string; position: string };
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

export const SKILLS_PAGE: WorkshopItem = {
  id: "skills",
  title: "Skills",
  description: "Claude Code skills I use daily, written down once.",
  icon: Wrench,
  href: "/skills",
  image: {
    src: "/hero-skills.jpg",
    alt: "A child watching TV static",
    position: "10% 50%",
  },
  soon: true,
};

export function skillPath(slug: string) {
  return `${SKILLS_PAGE.href}/${slug}`;
}

export const DESIGN_SYSTEM_PAGE: WorkshopItem = {
  id: "design-system",
  title: "Design System",
  description: "Rules and components to copy.",
  icon: Component,
  href: "/design-system",
  image: {
    src: "/hero-design-system.jpg",
    alt: "One lit CRT in a dark room of switched-off screens",
    position: "50% 50%",
  },
  soon: true,
};

export const OTHER_PAGES: Readonly<OtherPages> = {
  workshop: {
    title: "Workshop",
    items: [SKILLS_PAGE, DESIGN_SYSTEM_PAGE],
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
