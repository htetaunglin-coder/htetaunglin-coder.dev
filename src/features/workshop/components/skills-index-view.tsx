import { highlight } from "fumadocs-core/highlight";
import { Pre } from "fumadocs-ui/components/codeblock";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { SKILLS_PAGE } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import {
  SKILLS,
  SKILLS_INSTALL_COMMAND,
  SKILLS_REPO_URL,
  SKILLS_SH_URL,
  type SkillEntry,
} from "../data";
import { InstallCodeBlock } from "./install-code-block";
import { SkillText } from "./skill-text";
import { WorkshopPage } from "./workshop-page";

export function SkillsIndexView({ description }: { description: string }) {
  return (
    <WorkshopPage
      actions={<SkillsInstall />}
      description={description}
      eyebrow="Workshop / 01"
      page={SKILLS_PAGE}
    >
      {SKILLS.map((skill) => (
        <FadeAnimation as="div" direction="up" key={skill.name}>
          <SkillRow {...skill} />
        </FadeAnimation>
      ))}
    </WorkshopPage>
  );
}

function SkillRow({ name, description, summary, status }: SkillEntry) {
  return (
    <article className="mt-20 space-y-3 md:space-y-4">
      <div className="flex items-center gap-4">
        <h2
          className={cn(
            "shrink-0 font-gloria-hallelujah text-sm italic tracking-normal md:text-base",
            status === "in-progress" ? "text-fg-tertiary/80" : "text-fg-brand"
          )}
        >
          <span className="text-fg-tertiary/60">/ </span>
          {name}
        </h2>
        <DashedDivider
          className="flex-1 opacity-40 dark:opacity-20"
          maskImage="none"
        />
      </div>

      {summary ? (
        <p className="truncate text-base text-fg-tertiary/60">{summary}</p>
      ) : null}

      <p
        className={cn(
          "text-fg-tertiary text-sm md:text-base [&_br]:hidden [&_strong]:text-fg-secondary",
          status === "in-progress" &&
            "select-none truncate text-fg-tertiary/60 blur-[3px]"
        )}
      >
        <SkillText>{description}</SkillText>
      </p>
    </article>
  );
}

async function SkillsInstall() {
  const command = await highlight(SKILLS_INSTALL_COMMAND, {
    lang: "bash",
    components: { pre: (props) => <Pre {...props} /> },
  });

  return (
    // CodeBlock ships its own `my-4`; the hero's spacing owns this gap.
    <InstallCodeBlock
      className="my-0 shadow-none"
      githubUrl={SKILLS_REPO_URL}
      skillsShUrl={SKILLS_SH_URL}
    >
      {command}
    </InstallCodeBlock>
  );
}
