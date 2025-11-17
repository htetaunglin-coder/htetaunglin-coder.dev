"use client";

import { Volume2Icon } from "lucide-react";
import { motion } from "motion/react";
import { getCldVideoUrl } from "next-cloudinary";
import { FadeStaggeredAnimation } from "@/components/animations/fade-animation";
import { Profile } from "@/components/decorations/profile";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const Hero = () => (
  <div className="relative flex h-[36rem] w-full justify-between overflow-hidden">
    <div className="px-6">
      <FadeStaggeredAnimation direction="up">
        <p className="flex items-center font-mono text-fg-tertiary/80 text-xs sm:text-sm">
          Hey It&apos;s me,{" "}
          <span className="font-medium text-fg-brand text-xs sm:text-sm">
            Frontend Developer
          </span>
        </p>
        <div className="relative flex w-fit items-stretch">
          <h1 className="mt-1 bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-bold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:mt-0 sm:font-extrabold sm:text-5xl/[1.2] md:text-7xl/[1.2] dark:to-fg-tertiary/80">
            Htet Aung Lin
          </h1>
          <span className="mt-1.5 inline-block h-full sm:mt-1.5 md:mt-4">
            <PronounceMyName className="-rotate-26" />
          </span>
        </div>

        <p className="mt-3 max-w-3xl text-base text-fg-tertiary sm:mt-2 sm:text-lg/relaxed">
          I build things for the web with{" "}
          <span className="font-medium text-fg-default">
            React and a bit of design sense
          </span>
          . I enjoy learning, improving, and making videos about what I discover
          along the way.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 sm:mt-6">
          <Button variant="inverse">Download Resume</Button>
          <Button asChild>
            <NavLink href={"#contact-me"}>Contact Me</NavLink>
          </Button>
        </div>
      </FadeStaggeredAnimation>
    </div>

    <motion.div
      animate={{ opacity: 1 }}
      className="absolute right-0 bottom-10 h-[18.25rem] w-[18.25rem] md:h-[26.25rem] md:w-[26.25rem]"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{
        delay: 1,
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <Profile className="size-full" />
    </motion.div>
  </div>
);

export { Hero };

const PronounceMyName = ({ className }: { className?: string }) => {
  const pronunciationUrl = getCldVideoUrl({
    src: "name_pronunciation.mp3",
  });

  const play = useSound(pronunciationUrl);

  return (
    <button
      className={cn(
        "relative cursor-pointer select-none text-fg-brand transition-[color,scale] hover:text-fg-brand/80 active:scale-[0.9]",
        "after:-inset-1 after:absolute",
        className
      )}
      onClick={() => play()}
      type="button"
    >
      <Volume2Icon className="text-base sm:text-xl" />
      <span className="sr-only">Pronounce my name</span>
    </button>
  );
};
