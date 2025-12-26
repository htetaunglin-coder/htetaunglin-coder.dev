import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { GoBackButton } from "@/components/ui/go-back-button";
import { ProjectDetail } from "@/features/projects/components/project-detail";
import { PROJECT_DATA } from "@/features/projects/data";
import { getBreadcrumbStructuredData } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";

export function generateStaticParams() {
  return PROJECT_DATA.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECT_DATA.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project not found",
      description: "The project you're looking for does not exist.",
    };
  }

  const pageUrl = absoluteUrl(`/projects/${id}`);
  const techStackKeywords = project.techStacks.map((tech) => tech.title);

  return {
    title: project.title,
    description:
      project.description ||
      `Learn more about ${project.title}, a project by Htet Aung Lin.`,
    keywords: [
      project.title,
      ...techStackKeywords,
      "Web Development",
      "Portfolio Project",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${project.title} | Htet Aung Lin`,
      description:
        project.description ||
        `Learn more about ${project.title}, a project by Htet Aung Lin.`,
      url: pageUrl,
      type: "website",
      images: project.urls?.preview
        ? [
            {
              url: project.urls.preview,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Htet Aung Lin`,
      description:
        project.description ||
        `Learn more about ${project.title}, a project by Htet Aung Lin.`,
    },
  };
}

const ProjectDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const project = PROJECT_DATA.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: project.title },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbStructuredData} />
      <main className="pt-16 pb-24 sm:pt-24 md:pt-28">
        <section className="mx-auto w-full max-w-4xl">
          <div className="space-y-12 px-6 lg:px-0">
            <GoBackButton className="flex cursor-pointer items-center gap-1.5 font-medium text-base text-fg-tertiary hover:text-fg-accent hover:underline">
              <ArrowLeft />
              Go Back
            </GoBackButton>
            <ProjectDetail project={project} />
          </div>
        </section>
      </main>
    </>
  );
};

export default ProjectDetailPage;
