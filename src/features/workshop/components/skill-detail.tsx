import { Markdown } from "fumadocs-core/content";
import { highlight } from "fumadocs-core/highlight";
import { rehypeCode, remarkHeading } from "fumadocs-core/mdx-plugins";
import { Pre } from "fumadocs-ui/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import Link from "next/link";
import { NavLink } from "@/components/ui/nav-link";
import { SKILLS_PAGE } from "@/constants/navigation";
import { type RepoSkill, skillInstallCommand } from "../api/github-skills";
import { InstallCodeBlock } from "./install-code-block";
import { SkillText } from "./skill-text";

export async function SkillDetail({ skill }: { skill: RepoSkill }) {
  const installCommand = await highlight(skillInstallCommand(skill.slug), {
    lang: "bash",
    components: { pre: (props) => <Pre {...props} /> },
  });

  return (
    <div className="flex w-full flex-col gap-8 font-inter">
      <div>
        <p className="font-gloria-hallelujah text-fg-brand text-xs uppercase italic tracking-[0.08em]">
          # Workshop /{" "}
          <Link
            className="underline decoration-fg-brand/40 underline-offset-2 transition duration-300 hover:decoration-fg-brand"
            href={SKILLS_PAGE.href}
          >
            {SKILLS_PAGE.title}
          </Link>
        </p>

        <h1 className="mt-2 bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-semibold text-3xl/[1.2] text-transparent tracking-tight md:text-4xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80">
          {skill.name}
        </h1>

        <p className="mt-2 max-w-3xl text-base/relaxed text-fg-tertiary">
          <SkillText>{skill.description}</SkillText>
        </p>
      </div>

      {/* CodeBlock ships its own `my-4`; the parent gap owns this spacing. */}
      <InstallCodeBlock
        className="my-0 shadow-none"
        githubUrl={skill.githubUrl}
      >
        {installCommand}
      </InstallCodeBlock>

      <section>
        <h3 className="border-b pb-2.5 font-medium font-mono text-fg-tertiary text-sm">
          SKILL.md
        </h3>

        <SkillContent baseUrl={skill.baseUrl} body={skill.body} />
      </section>
    </div>
  );
}

function SkillContent({ body, baseUrl }: { body: string; baseUrl: string }) {
  return (
    // The article styles in globals.css apply only inside `.blog`. Without it,
    // this does not look like a blog post.
    <div className="blog mt-8">
      <div className="prose dark:prose-invert [&_h1_a]:!font-medium [&_h1]:my-2 [&_h1]:text-3xl">
        <Markdown
          components={{
            ...defaultMdxComponents,
            a: ({ href = "", ...props }) => (
              <NavLink href={resolveHref(href, baseUrl)} {...props} />
            ),
          }}
          rehypePlugins={[rehypeCode]}
          remarkPlugins={[remarkHeading]}
        >
          {body}
        </Markdown>
      </div>
    </div>
  );
}

const ABSOLUTE_HREF_PATTERN = /^[a-z][a-z0-9+.-]*:|^#/i;

function resolveHref(href: string, baseUrl: string) {
  if (!href || ABSOLUTE_HREF_PATTERN.test(href)) {
    return href;
  }

  return new URL(href, baseUrl).toString();
}
