import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { ThemeImage } from "@/components/ui/theme-image";
import { cn, formatDate, formatDisplayUrl } from "@/lib/utils";
import type { ProjectItem } from "../data";

const ProjectShowcase = ({
  project,
  animateCoverOnFullInView = false,
  lastItem,
}: {
  project: ProjectItem;
  animateCoverOnFullInView?: boolean;
  lastItem: boolean;
}) => {
  const lightSrc =
    typeof project.cover === "object" ? project.cover.light : project.cover;
  const darkSrc =
    typeof project.cover === "object" ? project.cover.dark : project.cover;

  return (
    <div className="relative space-y-6 pt-8 pb-12 font-inter">
      <div className="mt-2 flex justify-between gap-4">
        <div className="max-w-lg flex-grow">
          <h3 className="font-medium text-fg-secondary text-lg tracking-tight sm:font-semibold sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-1 text-fg-tertiary text-xs sm:text-sm">
            {project.description}
          </p>
        </div>
      </div>

      <Link
        className="group relative block aspect-[16/10] w-full overflow-hidden bg-bg-tertiary outline-none brightness-90 hover:z-[var(--above-grainy-overlay-z-index)] focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default dark:brightness-[0.875]"
        href={`/projects/${project.id}`}
      >
        {animateCoverOnFullInView ? (
          <FadeAnimation
            amount="all"
            as="div"
            className="absolute inset-0"
            direction="up"
            distance={0}
          >
            <ThemeImage
              alt={project.title}
              className="absolute inset-0 object-cover object-center"
              darkSrc={darkSrc}
              height={560}
              lightSrc={lightSrc}
              width={896}
            />
          </FadeAnimation>
        ) : (
          <ThemeImage
            alt={project.title}
            className="absolute inset-0 object-cover object-center"
            darkSrc={darkSrc}
            height={560}
            lightSrc={lightSrc}
            width={896}
          />
        )}

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

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button
          asChild
          className="h-8 shrink-0 gap-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default sm:h-9 sm:text-sm"
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
            className="h-8 max-w-48 gap-1.5 truncate text-fg-tertiary text-xs sm:h-9 sm:text-sm"
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

      {!lastItem && (
        <DashedDivider className="absolute inset-x-0 bottom-0 opacity-35 lg:mx-[-3rem] xl:mx-[-6rem] dark:opacity-20" />
      )}
    </div>
  );
};

export { ProjectShowcase };
