"use client";

import { ArrowDown, Volume2Icon } from "lucide-react";
import { getCldVideoUrl } from "next-cloudinary";
import { Profile } from "@/components/decorations/profile";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const Hero = () => (
  <div className="relative flex h-[36rem] w-full justify-between font-inter">
    <div className="px-6">
      <div className="group hero-stagger">
        <p className="flex items-center gap-1 font-gloria-hallelujah text-fg-tertiary/80 text-xs italic tracking-normal sm:text-base">
          / Hey It&apos;s me,{" "}
          <span className="font-medium text-fg-brand text-xs sm:text-sm">
            Frontend Developer
          </span>
        </p>
        <div className="relative flex w-fit items-center gap-1 md:gap-2">
          <h1 className="mt-1 bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-bold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:mt-0 sm:font-extrabold sm:text-5xl/[1.2] md:text-7xl/[1.2] dark:to-fg-tertiary/80">
            Htet Aung Lin
          </h1>

          <PronounceMyNameButton className="mt-2 size-7 rounded-full group-hover:opacity-100 sm:size-8 md:size-10 md:opacity-0" />
        </div>

        <p className="mt-3 max-w-3xl text-base text-fg-tertiary sm:mt-2 sm:text-lg/relaxed">
          I build front ends that look great and last, fast, with{" "}
          <span className="font-medium text-fg-default">AI agents</span>. I care
          about the people I build with as much as the product. In my free time,
          I make programming videos.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6">
          <Button asChild variant="inverse">
            <a
              download="HTET_AUNG_LIN_RESUME.pdf"
              href="/HTET_AUNG_LIN_RESUME.pdf"
            >
              Download Resume
            </a>
          </Button>
          <Button
            asChild
            className="items-center gap-1.5 text-fg-tertiary hover:text-fg-default"
            variant="ghost"
          >
            <NavLink href={"#work-with-me"}>
              Work with me <ArrowDown className="mt-1" />
            </NavLink>
          </Button>
        </div>
      </div>
    </div>

    <div className="hero-portrait -z-1 absolute right-0 bottom-10 h-[18.25rem] w-[18.25rem] md:h-[26.25rem] md:w-[26.25rem]">
      <Profile className="size-full" />
    </div>
  </div>
);

export { Hero };

const PronounceMyNameButton = ({ className }: { className?: string }) => {
  const pronunciationUrl = getCldVideoUrl({
    src: "name_pronunciation.mp3",
  });

  const play = useSound(pronunciationUrl);

  return (
    <Button
      className={cn("text-fg-tertiary hover:text-fg-default", className)}
      iconOnly
      onClick={() => play()}
      type="button"
      variant="ghost"
    >
      <Volume2Icon className="sm:!size-4 md:!size-5 !size-3.5" />
      <span className="sr-only">Pronounce my name</span>
    </Button>
  );
};
