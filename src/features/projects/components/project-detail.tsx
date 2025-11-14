import { Globe } from "lucide-react";
import { BasicMarkdown } from "@/components/basic-markdown-parser";
import { CloudinaryAvatar } from "@/components/cloudinary-avatar";
import { Icons } from "@/components/icons";
import { AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { ThemeImage } from "@/components/ui/theme-image";
import { cn, formatDate, formatDisplayUrl } from "@/lib/utils";
import { getProjectTeamMembers, type ProjectItem } from "../data";

const ProjectDetail = ({ project }: { project: ProjectItem }) => {
  const lightSrc =
    typeof project.image === "object" ? project.image.light : project.image;
  const darkSrc =
    typeof project.image === "object" ? project.image.dark : project.image;

  const teamMembers = getProjectTeamMembers(project);

  return (
    <div className="space-y-12 sm:space-y-16">
      <div className="group relative z-[var(--above-grainy-overlay-z-index)] aspect-[16/10] w-full overflow-hidden bg-zinc-500 brightness-90 sm:rounded-2xl dark:brightness-[0.875]">
        <ThemeImage
          alt={project.title}
          className="object-cover object-center"
          darkSrc={darkSrc}
          fill
          lightSrc={lightSrc}
        />
      </div>

      <div>
        <h2 className="font-semibold text-3xl text-fg-default">
          {project.title}
        </h2>
        <p className="mt-2 text-fg-tertiary">{project.description}</p>

        {project.detail && (
          <>
            <h3 className="mt-8 font-medium text-fg-default text-xl">
              Details
            </h3>
            <p className="mt-4">
              <BasicMarkdown className="[&_strong]:font-medium [&_strong]:text-fg-brand">
                {project.detail}
              </BasicMarkdown>
            </p>
          </>
        )}
      </div>

      <hr />

      <div className="flex flex-col gap-1.5">
        <h3 className="font-medium">Tech Stacks</h3>
        <div className="flex flex-wrap items-center gap-2">
          {project.techStacks.map((tech, index) => (
            <Button
              className="gap-1.5"
              key={`tech-stack-${index + 1}`}
              size="sm"
            >
              <span
                className={cn(
                  tech.iconSize === "sm" && "text-sm",
                  tech.iconSize === "md" && "text-base",
                  tech.iconSize === "lg" && "text-lg"
                )}
              >
                <tech.icon />
              </span>
              {tech.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-fg-tertiary text-sm sm:text-base">Role</p>
          <p className="font-medium text-fg-default text-sm sm:text-base">
            Frontend Developer
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-fg-tertiary text-sm sm:text-base">Team</p>
          <AvatarGroup
            classNames={{
              groupRemainChildren: "!ml-3 font-medium",
            }}
            max={5}
          >
            {teamMembers.map((member) => (
              <CloudinaryAvatar
                className="size-5 text-xs sm:size-6"
                key={member.id}
                name={member.name}
                src={member.avatar}
              />
            ))}
          </AvatarGroup>
        </div>
        <div className="flex flex-col">
          <p className="text-fg-tertiary text-sm sm:text-base">Timeline</p>
          <p className="text-fg-default text-sm sm:text-base">
            {formatDate(project.timeline.startDate)}
            <span> - </span>
            {project.timeline.status === "on_going" && "Ongoing"}
            {project.timeline.endDate && formatDate(project.timeline.endDate)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-fg-tertiary">Links</p>
        <div className="flex flex-wrap items-center gap-2">
          {project.urls?.github && (
            <Button asChild className="w-fit gap-1.5" variant="secondary">
              <NavLink href={project.urls.github}>
                <Icons.github className="text-base" />
                Github
              </NavLink>
            </Button>
          )}

          {project.urls?.preview && (
            <Button asChild className="gap-1.5" size="sm" variant="secondary">
              <NavLink href={project.urls.preview}>
                <Globe className="shrink-0 text-base" />
                <span className="inline-block">
                  {formatDisplayUrl(project.urls?.preview)}
                </span>
              </NavLink>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProjectDetail };
