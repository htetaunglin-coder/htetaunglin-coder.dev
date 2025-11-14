import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { ThemeImage } from "@/components/ui/theme-image";
import { cn, formatDate, formatDisplayUrl } from "@/lib/utils";
import type { ProjectItem } from "../data";

const ProjectShowcase = ({ project }: { project: ProjectItem }) => {
  const lightSrc =
    typeof project.image === "object" ? project.image.light : project.image;
  const darkSrc =
    typeof project.image === "object" ? project.image.dark : project.image;

  return (
    <div className="space-y-6">
      <Link
        className="group relative z-[var(--above-grainy-overlay-z-index)] block aspect-[16/10] w-full overflow-hidden bg-zinc-500 brightness-90 sm:rounded-2xl dark:brightness-[0.875]"
        href={`/projects/${project.id}`}
      >
        <ThemeImage
          alt={project.title}
          className="object-cover object-center"
          darkSrc={darkSrc}
          fill
          lightSrc={lightSrc}
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
          <h3 className="font-semibold text-fg-secondary text-lg">
            {project.title}
          </h3>
          <p className="mt-1 text-fg-tertiary text-sm">{project.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="shrink-0 gap-1.5"
              size="sm"
              variant="inverse"
            >
              <NavLink href={`/projects/${project.id}`}>
                View Project <ArrowRight />
              </NavLink>
            </Button>

            {project.urls?.preview && (
              <Button
                asChild
                className="max-w-48 gap-1.5 truncate text-fg-tertiary"
                size="sm"
                variant="secondary"
              >
                <NavLink href={project.urls.preview}>
                  <Globe className="shrink-0" />
                  <span className="inline-block truncate">
                    {formatDisplayUrl(project.urls.preview)}
                  </span>
                </NavLink>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProjectShowcase };
