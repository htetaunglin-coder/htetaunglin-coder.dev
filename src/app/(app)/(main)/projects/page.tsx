import type { Metadata } from "next";
import {
  FadeAnimation,
  FadeStaggeredAnimation,
} from "@/components/animations/fade-animation";
import { ProjectShowcase } from "@/features/projects/components/project-showcase";
import { PROJECT_DATA } from "@/features/projects/data";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "These projects represent my journey as a developer — learning, experimenting, and building things I truly enjoy.",
  alternates: {
    canonical: absoluteUrl("/projects"),
  },
  openGraph: {
    title: "Projects | Htet Aung Lin",
    description:
      "These projects represent my journey as a developer — learning, experimenting, and building things I truly enjoy.",
    url: absoluteUrl("/projects"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Projects | Htet Aung Lin",
    description:
      "These projects represent my journey as a developer — learning, experimenting, and building things I truly enjoy.",
  },
};

const ProjectPage = () => (
  <main className="pt-16 pb-28 sm:pt-24 md:pt-32">
    <section className="mx-auto w-full max-w-4xl">
      <div className="px-6 lg:px-0">
        <FadeStaggeredAnimation className="max-w-xl" direction="up">
          <h1 className="bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-extrabold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:text-5xl/[1.2] dark:to-fg-tertiary/80">
            Projects
          </h1>
          <p className="mt-2 text-base text-fg-tertiary sm:text-lg">
            These projects represent my journey as a developer — learning,
            experimenting, and building things I truly enjoy.
          </p>
        </FadeStaggeredAnimation>
        <div className="mt-8 mb-16 h-px w-full select-none bg-outline-accent sm:mt-12 sm:mb-20" />
      </div>

      <div className="space-y-24 px-6 sm:space-y-32 lg:px-0">
        {PROJECT_DATA.map((project, index) => (
          <FadeAnimation
            as="div"
            delay={index === 0 ? 0.75 : 0}
            direction="up"
            key={project.id}
          >
            <ProjectShowcase key={project.id} project={project} />
          </FadeAnimation>
        ))}
      </div>
    </section>
  </main>
);

export default ProjectPage;
