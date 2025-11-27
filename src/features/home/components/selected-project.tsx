"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { ThemeImage } from "@/components/ui/theme-image";
import { PROJECT_DATA, type ProjectItem } from "@/features/projects/data";
import { cn, formatDate } from "@/lib/utils";

const SelectedProject = () => (
  <div className="z-100 w-full">
    <FadeAnimation as="div" className="flex items-center gap-2" direction="up">
      <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
        Selected Project
      </h2>
    </FadeAnimation>

    <FadeAnimation as="div" className="mt-4 w-full" direction="up">
      <ProjectShowcase project={PROJECT_DATA[0]} />
    </FadeAnimation>
  </div>
);

export { SelectedProject };

const ProjectShowcase = ({ project }: { project: ProjectItem }) => {
  const lightSrc =
    typeof project.image === "object" ? project.image.light : project.image;
  const darkSrc =
    typeof project.image === "object" ? project.image.dark : project.image;

  return (
    <div className="space-y-6">
      <Link
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-500 brightness-90 hover:z-[var(--above-grainy-overlay-z-index)] sm:rounded-2xl dark:brightness-[0.875]"
        href={`/projects/${project.id}`}
      >
        <ThemeImage
          alt={project.title}
          className="absolute object-cover object-center"
          darkSrc={darkSrc}
          height={530}
          lightSrc={lightSrc}
          width={850}
        />

        <div
          className={cn(
            "absolute right-0 bottom-0 left-0 h-1/3 w-full opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100",
            "mask-image:_linear-gradient(to_top,_black_25%,_transparent_80%) pointer-events-none [-webkit-mask-image:_linear-gradient(to_top,_black_25%,_transparent_80%)]"
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-10 justify-end px-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="h-fit rounded-md bg-bg-tertiary px-2 py-1.5">
            <p className="text-fg-secondary text-xs">
              {formatDate(project.timeline.startDate)}
              <span> - </span>
              {project.timeline.status === "on_going" && "Ongoing"}
              {project.timeline.endDate && formatDate(project.timeline.endDate)}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-2 flex justify-between gap-4 sm:px-6">
        <div className="max-w-lg flex-grow">
          <h3>
            <NavLink
              className="flex items-center gap-1 font-semibold text-fg-secondary text-lg hover:underline"
              href={`/projects/${project.id}`}
            >
              {project.title}
              <ArrowUpRight className="mt-0.5 text-md" />
            </NavLink>
          </h3>
          <p className="mt-1 text-fg-tertiary text-sm">{project.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button asChild className="text-sm" variant="secondary">
              <NavLink href={"/projects"}>
                View All Projects <ArrowRight />
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
