import type { ComponentType } from "react";
import { Icons } from "@/components/icons";

export type ProductImage =
  | {
      light: string;
      dark: string;
    }
  | string;

export const TEAM_MEMBERS = {
  sann_ko_ko: {
    id: "sann_ko_ko",
    name: "Sann Ko Ko",
    avatar: "sann_ko_ko.jpg",
  },
  wai_yan_phone_aant: {
    id: "wai_yan_phone_aant",
    name: "Wai Yan Phone Aant",
    avatar: "wai_yan_phone_aant.jpg",
  },
  htet_aung_lin: {
    id: "htet_aung_lin",
    name: "Htet Aung Lin",
    avatar: "htet_aung_lin.jpg",
  },
  auung: {
    id: "auung",
    name: "auung",
    avatar: "",
  },
  paing_soe_ko: {
    id: "paing_soe_ko",
    name: "Paing Soe Ko",
    avatar: "paing_soe_ko.jpg",
  },
  zai185: {
    id: "zai185",
    name: "Zai185",
    avatar: "zai185.jpg",
  },
  aaron_htun: {
    id: "aaron_htun",
    name: "Aaron Htun",
    avatar: "aaron_htun.jpg",
  },
} as const;

export type TeamMemberId = keyof typeof TEAM_MEMBERS;

export type TechStack = {
  icon: ComponentType;
  iconSize: "sm" | "md" | "lg";
  title: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  urls?: {
    github?: string;
    preview?: string;
  };
  image: ProductImage;
  teamMemberIds: TeamMemberId[];
  personalProject?: boolean;
  timeline: {
    startDate: Date;
    endDate?: Date;
    status: "on_going" | "completed";
  };
  techStacks: TechStack[];
  detail: string;
};

export const PROJECT_DATA: ProjectItem[] = [
  {
    id: "pica-ai-assistant",
    title: "Pica AI Assistant",
    description:
      "Pica Bot is an intelligent AI assistant that integrates with your ERP POS system to enhance customer support. It provides real-time chat and product recommendations for medical and supplement sales teams.",
    urls: {
      preview: "https://pica-ai-assistant.vercel.app",
      github: "https://github.com/htetaunglin-coder/Ai-Assistant",
    },
    image: {
      light: "pica-ai-assistant-light_ccykei.png",
      dark: "pica-ai-assistant-dark_mq3fqr.png",
    },
    teamMemberIds: ["sann_ko_ko", "wai_yan_phone_aant", "htet_aung_lin"],
    timeline: {
      startDate: new Date(2025, 8, 25),
      status: "on_going",
    },
    techStacks: [
      { icon: Icons.nextjs, iconSize: "lg", title: "Next.js" },
      { icon: Icons.typescript, iconSize: "md", title: "Typescript" },
      { icon: Icons.zustand, iconSize: "lg", title: "Zustand" },
      { icon: Icons.tailwindcss, iconSize: "lg", title: "Tailwind CSS" },
      { icon: Icons.reactQuery, iconSize: "lg", title: "React Query" },
      { icon: Icons.mijnui, iconSize: "md", title: "MijnUI" },
      { icon: Icons.framerMotion, iconSize: "md", title: "Framer Motion" },
    ],
    detail:
      "Pica AI Assistant is an intelligent chat app that connects with ERP systems to make customer support and sales conversations faster and easier. The main goal is to let users **talk directly with their data**, from checking revenue to getting product suggestions.\n\nThe chat supports **charts, images, product cards**, and **documents**, making it more visual and interactive.\n\nI built the **frontend with Next.js**, designed the chat interface, and implemented **message streaming and AI responses**.\n\nSince both **authentication and AI requests** are managed by an external API, I wrote my own **token rotation and streaming logic** using Zustand for state management.\n\nThe project is currently in **beta**, and some of the main features like agent chat and file uploads are already built but not released yet.",
  },
  {
    id: "mijnui",
    title: "MijnUI",
    description:
      "MijnUI offers flexible, ready-to-use components for building marketing sites, dashboards, and e-commerce platforms.",
    urls: {
      preview: "https://mijnui.com",
      github: "https://github.com/mijn-ui/mijn-ui-react",
    },
    image: {
      light: "mijnui-light_lzl7bq.png",
      dark: "mijnui-dark_j0t9ms.png",
    },
    teamMemberIds: [
      "sann_ko_ko",
      "htet_aung_lin",
      "wai_yan_phone_aant",
      "auung",
      "paing_soe_ko",
      "zai185",
      "aaron_htun",
    ],
    timeline: {
      startDate: new Date(2024, 10, 1),
      status: "on_going",
    },
    techStacks: [
      { icon: Icons.react, iconSize: "md", title: "React" },
      { icon: Icons.typescript, iconSize: "md", title: "Typescript" },
      { icon: Icons.tailwindcss, iconSize: "lg", title: "Tailwind CSS" },
      { icon: Icons.storybook, iconSize: "md", title: "Storybook" },
      { icon: Icons.fumadocs, iconSize: "sm", title: "Fumadocs" },
    ],
    detail:
      "MijnUI is a component library made for teams to build consistent interfaces faster. It started as a shared collection for internal projects and later became a standalone library.\n\nMijnUI can be used as an **npm package** or copied directly into a project. It focuses on **flexible variants and customization**, with **per-element className props** and an **unstyled mode** for full control.\n\nI developed the **React and Tailwind version**, while the Laravel version is still in progress. MijnUI uses **Radix primitives** and a **compound component design** for flexibility.\n\nCurrently, it includes over **25 essential components** like inputs, selects, dialogs, tabs, and accordions. The **copy-paste** option is stable for production use, while the npm package is still in beta.\n\nWe already use MijnUI in **Pica AI Assistant** and **PDF template editor** projects.",
  },
  {
    id: "resizable-layout",
    title: "Resizable Layout",
    description:
      "A resizable and collapsible layout built with react-resizable-panels. It offers smooth animations, saves panel sizes to cookies, and stays consistent after refresh.",
    urls: {
      preview: "https://react-animated-resizable-layout.vercel.app",
      github: "https://github.com/htetaunglin-coder/react-resizable-layout",
    },
    image: {
      light: "resizable-layout-light_hk3pdt.png",
      dark: "resizable-layout-dark_pqjqwz.png",
    },
    personalProject: true,
    teamMemberIds: ["htet_aung_lin"],
    timeline: {
      startDate: new Date(2025, 7, 19),
      status: "on_going",
    },
    techStacks: [
      { icon: Icons.nextjs, iconSize: "lg", title: "Next.js" },
      { icon: Icons.typescript, iconSize: "md", title: "Typescript" },
      { icon: Icons.tailwindcss, iconSize: "lg", title: "Tailwind CSS" },
    ],
    detail:
      "This layout shows how to build **collapsible, animated panels** that remember their size and state. It helps developers struggling with **react-resizable-panels** animations.\n\nIt uses **server-side rendering** to avoid hydration mismatches and stores panel sizes in **cookies** for persistence. Panels are collapsible and controllable from anywhere in the tree.\n\nThe code is **open source** and can be installed via the **shadcn CLI**. It's well-documented and ready for reuse in other projects.",
  },
  {
    id: "cobalt-clone",
    title: "Cobalt Clone",
    description:
      "Cobalt financial tool landing page clone using Next.js, TypewriterEffect, and Framer Motion.",
    urls: {
      preview: "http://cobalt-clone.netlify.app",
      github: "https://github.com/htetaunglin-coder/Desktop-Cobalt-Clone",
    },
    image: "cobalt-clone_oca9rt.png",
    personalProject: true,
    teamMemberIds: ["htet_aung_lin"],
    timeline: {
      startDate: new Date(2024, 1, 15),
      endDate: new Date(2024, 1, 30),
      status: "completed",
    },
    techStacks: [
      { icon: Icons.nextjs, iconSize: "lg", title: "Next.js" },
      { icon: Icons.typescript, iconSize: "md", title: "Typescript" },
      { icon: Icons.tailwindcss, iconSize: "md", title: "Tailwind CSS" },
      { icon: Icons.framerMotion, iconSize: "md", title: "Framer Motion" },
    ],
    detail:
      "Built in **February 2024** as a personal challenge while learning **Next.js**, **Tailwind CSS**, and **Framer Motion**.\n\nIt recreates the **Cobalt financial landing page**, focusing on animation, layout, and responsiveness.\n\nIncludes a **React starfield animation** for the floating dots effect and **react-typewriter** for dynamic hero typing.\n\nThis was one of my **first completed projects** before becoming an intern developer, helping me gain confidence with modern React tools.",
  },
];

export const getProjectTeamMembers = (project: ProjectItem) =>
  project.teamMemberIds.map((id) => TEAM_MEMBERS[id]);
