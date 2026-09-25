import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { SKILLS_PAGE, skillPath } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import type { RepoSkill } from "../api/github-skills";
import { SKILLS, type WorkshopEntry } from "../data";
import { SkillText } from "./skill-text";
import { WorkshopPage } from "./workshop-page";

const STATUS_LABEL: Record<EntryStatus, string> = {
  "in-progress": "Coming soon",
  published: "Published",
};

type EntryStatus = "in-progress" | "published";

type SkillRowProps = {
  title: string;
  description: string;
  summary?: string;
  meta: string;
  status: EntryStatus;
  href?: string;
};

export function SkillsIndexView({
  description,
  skills,
}: {
  description: string;
  skills: RepoSkill[];
}) {
  const rows = [...skills.map(toPublishedRow), ...SKILLS.map(toInProgressRow)];

  return (
    <WorkshopPage
      description={description}
      eyebrow="Workshop / 01"
      page={SKILLS_PAGE}
    >
      {rows.length === 0 ? (
        <p className="py-8 text-fg-tertiary text-sm">Nothing here yet.</p>
      ) : (
        rows.map((row, index) => (
          <Fragment key={row.title}>
            {index > 0 && (
              <DashedDivider className="lg:-mx-14 opacity-40 dark:opacity-20" />
            )}
            <FadeAnimation as="div" direction="up">
              <SkillRow {...row} />
            </FadeAnimation>
          </Fragment>
        ))
      )}
    </WorkshopPage>
  );
}

function SkillRow({
  title,
  description,
  summary,
  meta,
  status,
  href,
}: SkillRowProps) {
  return (
    <article className="space-y-2 pt-8 pb-12 md:space-y-4">
      <div className="space-y-1 md:space-y-2">
        <h2 className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {href ? (
            <Link
              className="font-medium text-fg-secondary/90 text-lg hover:underline md:text-2xl"
              href={href}
            >
              {title}
            </Link>
          ) : (
            <span className="font-medium text-fg-tertiary/80 text-lg md:text-2xl">
              {title}
            </span>
          )}
        </h2>

        {summary ? (
          <p className="truncate text-base text-fg-tertiary/60">{summary}</p>
        ) : null}

        <p
          className={cn(
            "truncate text-fg-tertiary text-sm md:text-base [&_br]:hidden",
            status === "in-progress" &&
              "select-none text-fg-tertiary/60 blur-[3px]"
          )}
        >
          <SkillText>{description}</SkillText>
        </p>
      </div>

      <p
        className={cn(
          "font-gloria-hallelujah text-xs italic md:text-sm",
          status === "in-progress"
            ? "text-fg-tertiary/60"
            : "text-fg-tertiary/80"
        )}
      >
        / {meta}
      </p>

      {href ? (
        <Link
          aria-label={`View skill ${title}`}
          className="inline-flex items-center gap-1 text-fg-brand text-sm underline hover:brightness-80 md:text-base"
          href={href}
        >
          View skill <ArrowRight aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  );
}

function toPublishedRow(skill: RepoSkill): SkillRowProps {
  return {
    title: skill.name,
    description: skill.description,
    meta: [STATUS_LABEL.published, skill.license].filter(Boolean).join(" · "),
    status: "published",
    href: skillPath(skill.slug),
  };
}

function toInProgressRow(entry: WorkshopEntry): SkillRowProps {
  return {
    title: entry.name,
    summary: entry.summary,
    description: entry.body,
    meta: STATUS_LABEL["in-progress"],
    status: "in-progress",
  };
}
