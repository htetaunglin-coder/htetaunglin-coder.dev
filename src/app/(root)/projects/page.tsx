import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { PROJECT_DATA } from "@/features/projects/data";

const ProjectPage = () => (
  <main className="pt-24 pb-28 md:pt-32">
    <section className="mx-auto w-full max-w-4xl">
      <div className="px-6 lg:px-0">
        <div className="max-w-xl">
          <h1 className="bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-extrabold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:text-5xl/[1.2] dark:to-fg-tertiary/80">
            Projects
          </h1>
          <p className="mt-2 text-base text-fg-tertiary sm:text-lg">
            These projects represent my journey as a developer — learning,
            experimenting, and building things I truly enjoy.
          </p>
        </div>
        <div className="mt-8 mb-16 h-px w-full select-none bg-outline-accent sm:mt-12 sm:mb-20" />
      </div>

      <div className="space-y-40 px-6 lg:px-0">
        {PROJECT_DATA.map((project) => (
          <ProjectShowcaseCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  </main>
);

export default ProjectPage;
