"use client";

import { FadeStaggeredAnimation } from "@/components/animations/fade-animation";
import { BasicMarkdown } from "@/components/basic-markdown-parser";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { cn } from "@/lib/utils";
import { getAgeFromDOB } from "../utils";

const age =
  process.env.NEXT_PUBLIC_DOB && getAgeFromDOB(process.env.NEXT_PUBLIC_DOB);

const withAge = age ? `${age} years old and ` : "";

const ABOUT_ME: readonly {
  id: string;
  title: string;
  content: string;
}[] = [
  {
    id: "section-0",
    title: "Who am I?",
    content: `Hey, I'm **Htet Aung Lin**, but you can also call me **Kelvin**. I'm ${withAge}a frontend developer with over two years of experience. I enjoy building things that feel simple, fast, and easy to use.`,
  },
  {
    id: "section-1",
    title: "My approach to coding",
    content:
      'Most of my work focuses on AI interfaces and component design systems. I like organizing things, creating reusable components, and keeping everything consistent and maintainable.\nFor me, simplicity and clarity matter more than writing **"perfect"** code. I try to place things close to where they belong, that\'s how I keep projects easy to understand and maintain later.',
  },
  {
    id: "section-2",
    title: "What I've learned",
    content:
      "Contributing to open-source projects taught me a lot, especially how to read and understand other people's code. It helped me grow not just as a developer, but also in how I think about structure, teamwork, and communication.",
  },
];

/* -------------------------------------------------------------------------- */

const About = () => (
  <div className="w-full">
    <div className="space-y-32 sm:space-y-32">
      {ABOUT_ME.map((section, index) => (
        <FadeStaggeredAnimation
          delay={index * 0.25}
          direction="up"
          key={section.id}
        >
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-0">
            <Title>{section.title}</Title>
            {index === 0 && (
              <CloudinaryImage
                alt="Htet Aung Lin Profile"
                aspectRatio={"1:1"}
                className="relative block size-24 select-none rounded-md bg-bg-tertiary object-cover object-center sm:mr-6 sm:size-40 md:mr-12 2xl:hidden"
                draggable={false}
                height={160}
                src="htet_aung_lin.jpg"
                width={160}
              />
            )}
          </div>
          <p className="mt-2 text-base text-fg-secondary/90 sm:mt-4 sm:ml-20 sm:max-w-none sm:text-lg">
            <BasicMarkdown className="[&_strong]:font-medium [&_strong]:text-fg-brand">
              {section.content}
            </BasicMarkdown>
          </p>
        </FadeStaggeredAnimation>
      ))}

      <FadeStaggeredAnimation delay={0.25} direction="up">
        <Title>Outside of coding</Title>
        <p className="mt-2 text-base text-fg-secondary/90 sm:mt-4 sm:ml-20 sm:max-w-none sm:text-lg">
          I&apos;m really into psychology and stoicism, learning how thoughts
          and emotions shape how we live. When I&apos;m not coding, I love
          playing guitar or going to the gym to reset and stay balanced.
        </p>

        <div className="mx-auto mt-12 flex w-full max-w-2xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold font-mono text-fg-tertiary/50 text-lg sm:text-xl">
              And... of course,
            </p>
            <p className="mt-2 font-bold font-mono text-base text-fg-tertiary/90 sm:text-lg">
              I enjoy spending time with friends, maybe a few drinks, good food,
              and laughter.
            </p>
          </div>

          {/* HangOut */}

          <div className="group relative aspect-[5/4] w-[16.25rem] shrink-0 overflow-hidden rounded-4xl grayscale-25 transition duration-300 sm:w-[20rem]">
            <CloudinaryImage
              alt="Friends hanging out — casual group photo"
              aspectRatio={"5:4"}
              className="object-cover object-center"
              crop="fill"
              height={256}
              src="friends_hangout.jpg"
              width={320}
            />

            <div className="pointer-events-none absolute inset-0 select-none bg-black/10 dark:bg-black/20">
              <p className="absolute top-16 left-[80px] font-semibold text-[9px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                @Aung Min Khant
              </p>
              <p className="absolute top-[74px] left-4 font-semibold text-[9px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                @Nay Lin Aung
              </p>
              <p className="absolute top-[76px] right-8 bg-black px-1 font-semibold text-[#aca7d4] text-[9px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                @Htet Aung Lin
              </p>
              <p className="absolute top-[220px] right-2 font-semibold text-[9px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                @Kaung Khant Aung
              </p>
              <p className="absolute bottom-0 left-2 p-2 font-mono font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                We Cooling 😎
              </p>
            </div>
          </div>
        </div>
      </FadeStaggeredAnimation>
    </div>
  </div>
);

export { About };

/* -------------------------------------------------------------------------- */

const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1
    className={cn(
      "font-medium font-mono text-3xl text-fg-tertiary/20 tracking-tighter sm:text-4xl md:text-5xl",
      className
    )}
  >
    {children}
  </h1>
);
