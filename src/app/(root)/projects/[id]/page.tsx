import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoBackButton } from "@/components/ui/go-back-button";
import { ProjectDetailCard } from "@/features/projects/components/project-detail-card";
import { PROJECT_DATA } from "@/features/projects/data";

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
      title: "Project not found | Htet Aung Lin",
      description: "The project you're looking for does not exist.",
    };
  }

  return {
    title: `${project.title} | Htet Aung Lin`,
    description:
      project.description ||
      `Learn more about ${project.title}, a project by Htet Aung Lin.`,
    // openGraph: {
    //   title: `${project.title} | Htet Aung Lin`,
    //   description:
    //     project.description ||
    //     `Explore ${project.title}, built with modern web technologies.`,
    //   type: "article",
    //   url: `https://yourdomain.com/projects/${project.id}`,
    //   images: [
    //     {
    //       url: project.thumbnail || "/og-default.png",
    //       width: 1200,
    //       height: 630,
    //       alt: `${project.title} thumbnail`,
    //     },
    //   ],
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title: `${project.title} | Htet Aung Lin`,
    //   description:
    //     project.description ||
    //     `Learn more about ${project.title}, created by Htet Aung Lin.`,
    //   images: [project.thumbnail || "/og-default.png"],
    // },
  };
}

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  const project = PROJECT_DATA.find((p) => p.id === params.id);
  if (!project) {
    notFound();
  }

  return (
    <main className="pt-24 pb-28 md:pt-28">
      <section className="mx-auto w-full max-w-4xl">
        <div className="space-y-12 px-6 lg:px-0">
          <GoBackButton className="flex cursor-pointer items-center gap-1.5 font-medium text-base text-fg-tertiary hover:text-fg-accent hover:underline">
            <ArrowLeft />
            Go Back
          </GoBackButton>
          <ProjectDetailCard project={project} />
        </div>
      </section>
    </main>
  );
};

export default ProjectDetailPage;
