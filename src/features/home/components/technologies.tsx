"use client";

import type React from "react";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

type TechnologyItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const TECH_DATA: readonly TechnologyItem[] = [
  {
    id: "react",
    label: "React",
    icon: <Icons.react />,
  },
  {
    id: "next",
    label: "Next.js",
    icon: <Icons.nextjs />,
  },
  {
    id: "ts",
    label: "TypeScript",
    icon: <Icons.typescript />,
  },
  {
    id: "convex",
    label: "Convex",
    icon: <Icons.convex />,
  },
  {
    id: "tailwind",
    label: "TailwindCSS",
    icon: <Icons.tailwindcss />,
  },
  {
    id: "radix",
    label: "Radix UI",
    icon: <Icons.radixui />,
  },
  {
    id: "react-query",
    label: "React Query",
    icon: <Icons.reactQuery />,
  },
  {
    id: "framer",
    label: "Framer Motion",
    icon: <Icons.framerMotion />,
  },
  {
    id: "zustand",
    label: "Zustand",
    icon: <Icons.zustand />,
  },
  {
    id: "storybook",
    label: "Storybook",
    icon: <Icons.storybook />,
  },
  {
    id: "figma",
    label: "Figma",
    icon: <Icons.figma />,
  },
];

const Technologies = () => (
  <div className="w-full">
    <FadeAnimation
      as="h2"
      className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold"
      direction="up"
    >
      Technologies
    </FadeAnimation>

    <FadeAnimation
      as="div"
      className="mt-6 flex flex-wrap items-center gap-2.5 border-b border-b-outline-secondary pb-6 sm:mt-8 sm:gap-4"
      delay={0.25}
      direction="up"
    >
      {TECH_DATA.map(({ id, label, icon }) => (
        <Button
          aria-label={label}
          className="h-8 sm:h-9"
          key={id}
          title={label}
          variant="outlined"
        >
          <span className="inline-flex items-center justify-center text-base sm:text-lg">
            {icon}
          </span>
          <span className="ml-1 text-fg-secondary/90">{label}</span>
        </Button>
      ))}
    </FadeAnimation>

    <FadeAnimation
      as="p"
      className="mt-4 max-w-3xl text-fg-tertiary text-sm/relaxed sm:text-base/relaxed"
      delay={0.25}
      direction="up"
    >
      These are the tools I use to craft{" "}
      <span className="font-medium text-fg-brand">
        clean, performant web experiences.
      </span>
    </FadeAnimation>
  </div>
);

export { Technologies };
