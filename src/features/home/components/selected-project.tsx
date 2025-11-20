"use client";

import { ArrowRight } from "lucide-react";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";

const SelectedProject = () => (
  <div className="w-full">
    <FadeAnimation as="div" className="flex items-center gap-2" direction="up">
      <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
        Selected Project
      </h2>
    </FadeAnimation>

    <FadeAnimation
      as="figure"
      className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border bg-tertiary sm:mt-8"
      delay={0.25}
      direction="up"
    >
      {/* <iframe
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        className="translate-z-0 box-border block border-none leading-0 outline-none"
        referrerPolicy="strict-origin-when-cross-origin"
        src="https://player.vimeo.com/video/848991756?muted=1&amp;autoplay=1&amp;autopause=0&amp;controls=0&amp;loop=1&amp;app_id=122963"
        style={{
          position: "absolute",
          top: 0,
          left: -4,
          width: "101%",
          height: "101%",
        }}
        title="Selected work 2023"
      /> */}

      <div className="absolute inset-0 z-10 bg-black/15" />
    </FadeAnimation>

    <FadeAnimation
      as="div"
      className="mt-6 flex w-full justify-center"
      delay={0.25}
      direction="up"
    >
      <Button asChild variant="secondary">
        <NavLink href={"/projects"}>
          View All Projects <ArrowRight />
        </NavLink>
      </Button>
    </FadeAnimation>
  </div>
);

export { SelectedProject };
