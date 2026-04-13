import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import Script from "next/script";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { PageHeroImage } from "@/components/page-hero-image";
import { ProjectShowcase } from "@/features/projects/components/project-showcase";
import { PROJECT_DATA } from "@/features/projects/data";
import { absoluteUrl, cn } from "@/lib/utils";

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

type ProjectYearFilter = "all" | "before-2025" | "2025" | "2026";

const PROJECT_YEAR_TABS: Array<{
  key: ProjectYearFilter;
  label: string;
}> = [
  { key: "all", label: "All" },
  { key: "before-2025", label: "Before 2025" },
  { key: "2025", label: "2025" },
  { key: "2026", label: "2026" },
];

const normalizeYearFilter = (
  year: string | string[] | undefined
): ProjectYearFilter => {
  const value = Array.isArray(year) ? year[0] : year;
  return value === "before-2025" || value === "2025" || value === "2026"
    ? value
    : "all";
};

const sortProjectsByDateDesc = [...PROJECT_DATA].sort(
  (a, b) => b.timeline.startDate.getTime() - a.timeline.startDate.getTime()
);

/* -------------------------------------------------------------------------- */

/**
 * This script exists to make the first project-cover animation work correctly.
 *
 * The animation flag (`animateCoverOnFullInView`) is decided in this Server
 * Component during render, but the user interactions that should disable/re-arm
 * that animation happen on the client. We use a cookie as a small bridge:
 * - no cookie on `/projects` entry -> first cover animates
 * - interaction on `/projects` -> set cookie, stop replaying in this visit
 * - leaving `/projects` -> clear cookie, so coming back can animate again
 */
const PROJECTS_COVER_INTERACTION_COOKIE = "projects_cover_interacted";
const PROJECTS_PAGE_PATH = "/projects";

const projectsInteractionGateScript = `(() => {
  // Register global listeners exactly once per document lifecycle.
  if (window.__projectsCoverGateInitialized) return;
  window.__projectsCoverGateInitialized = true;

  const cookieName = "${PROJECTS_COVER_INTERACTION_COOKIE}";
  const projectsPath = "${PROJECTS_PAGE_PATH}";

  const isOnProjectsPage = () => window.location.pathname === projectsPath;

  const setInteractedCookie = () => {
    // Ignore global interactions from other routes.
    if (!isOnProjectsPage()) return;
    document.cookie = cookieName + "=1; path=/; SameSite=Lax";
  };

  const clearInteractedCookie = () => {
    document.cookie = cookieName + "=; Max-Age=0; path=/; SameSite=Lax";
  };

  const handleRouteBoundary = () => {
    // If we are outside /projects, reset so the next /projects visit is fresh.
    if (!isOnProjectsPage()) {
      clearInteractedCookie();
    }
  };

  window.addEventListener("beforeunload", clearInteractedCookie);
  window.addEventListener("pagehide", clearInteractedCookie);
  window.addEventListener("pointerdown", setInteractedCookie, { passive: true });
  window.addEventListener("keydown", setInteractedCookie);
  window.addEventListener("wheel", setInteractedCookie, { passive: true });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("a[href]");
    if (!link) return;

    const url = new URL(link.href, window.location.origin);
    if (url.pathname !== projectsPath) {
      clearInteractedCookie();
    }
  });

  // Next.js client navigation relies on History API, so we patch both methods
  // to eagerly clear the interaction cookie when route changes happen.
  const { pushState, replaceState } = window.history;
  window.history.pushState = function (...args) {
    const result = pushState.apply(this, args);
    handleRouteBoundary();
    return result;
  };
  window.history.replaceState = function (...args) {
    const result = replaceState.apply(this, args);
    handleRouteBoundary();
    return result;
  };

  window.addEventListener("popstate", handleRouteBoundary);
  // Initial sync in case script runs while not currently on /projects.
  handleRouteBoundary();
})();`;

/* -------------------------------------------------------------------------- */

export default async function ProjectPage(props: {
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  // Server read keeps animation gating stable and deterministic on render.
  const cookieStore = await cookies();
  const { year } = await props.searchParams;
  const activeYear = normalizeYearFilter(year);

  const hasInteractedOnThisVisit =
    cookieStore.get(PROJECTS_COVER_INTERACTION_COOKIE)?.value === "1";

  const filteredProjects = sortProjectsByDateDesc.filter((project) => {
    const projectStartYear = project.timeline.startDate.getFullYear();
    if (activeYear === "all") return true;
    if (activeYear === "before-2025") return projectStartYear < 2025;
    return projectStartYear === Number(activeYear);
  });

  return (
    <>
      <Script id="projects-cover-interaction-gate" strategy="afterInteractive">
        {projectsInteractionGateScript}
      </Script>

      <PageHeroImage
        alt="Butterfly"
        imageClassName="object-top object-cover"
        imageContainerClassName="w-xs mt-12 md:block hidden -mr-20 lg:mr-0"
        src="illustration_mg85hu.png"
      />

      <div className="mx-auto max-w-4xl px-6 pt-4 font-inter sm:pt-16 lg:px-0">
        <h1 className="bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-bold font-inter text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80">
          Projects
        </h1>

        <p className="mt-2 font-medium text-base text-neutral-900/80 tracking-tight sm:max-w-xl sm:text-lg/normal dark:text-fg-tertiary">
          Projects represent my journey as a developer — learning,
          experimenting, and building things I truly enjoy.
        </p>
      </div>

      <main className="relative mt-16 pb-12 sm:mt-28">
        <DashedDivider className="absolute inset-x-0 top-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 top-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />

        <DashedDivider className="absolute inset-x-0 bottom-0 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />
        <DashedDivider className="absolute inset-x-0 bottom-8 mx-auto max-w-[92rem] opacity-40 dark:opacity-20" />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-0">
          <DashedDivider
            className="-right-12 absolute inset-y-0 mt-[-5rem] mb-[-20rem] hidden opacity-40 lg:block dark:opacity-20"
            orientation="vertical"
          />

          <DashedDivider
            className="-left-12 absolute inset-y-0 mt-[-5rem] mb-[-20rem] hidden opacity-40 lg:block dark:opacity-20"
            orientation="vertical"
          />

          <div className="inline-flex h-8 w-full items-center">
            {PROJECT_YEAR_TABS.map((tab) => {
              const isActive = tab.key === activeYear;
              const href =
                tab.key === "all" ? "/projects" : `/projects?year=${tab.key}`;

              return (
                <Link
                  className={cn(
                    "flex h-full items-center gap-1 px-3 font-black font-doto text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default sm:px-6 sm:text-base",
                    isActive
                      ? "bg-fg-default/90 text-bg-default"
                      : "text-fg-tertiary hover:text-fg-default"
                  )}
                  href={href}
                  key={tab.key}
                >
                  <i className="hidden sm:block"># </i> {tab.label}
                </Link>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <p className="py-8 text-fg-tertiary text-sm">
              No projects found for this year yet.
            </p>
          )}

          <div>
            {filteredProjects.map((project, index) => (
              <FadeAnimation as="div" direction="up" key={project.id}>
                <ProjectShowcase
                  animateCoverOnFullInView={
                    !hasInteractedOnThisVisit && index === 0
                  }
                  lastItem={index === filteredProjects.length - 1}
                  project={project}
                />
              </FadeAnimation>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
