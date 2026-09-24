import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { SKILLS_PAGE, skillPath } from "@/constants/navigation";
import {
  getRepoSkill,
  getRepoSkills,
} from "@/features/workshop/api/github-skills";
import { SkillDetail } from "@/features/workshop/components/skill-detail";
import { getBreadcrumbStructuredData } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";

// A skill folder pushed after the build renders on its first visit, not as a
// 404.
export const dynamicParams = true;

export async function generateStaticParams() {
  const skills = await getRepoSkills();

  return skills.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getRepoSkill(slug);

  if (!skill) {
    return {
      title: "Skill not found",
      description: "The skill you're looking for does not exist.",
    };
  }

  const pageUrl = absoluteUrl(skillPath(slug));

  return {
    title: skill.name,
    description: skill.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${skill.name} | Htet Aung Lin`,
      description: skill.description,
      url: pageUrl,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${skill.name} | Htet Aung Lin`,
      description: skill.description,
    },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = await getRepoSkill(slug);

  if (!skill) {
    notFound();
  }

  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: SKILLS_PAGE.title, url: SKILLS_PAGE.href },
    { name: skill.name },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbStructuredData} />
      <main className="pt-16 pb-24 sm:pt-24 md:pt-28">
        <section className="mx-auto w-full max-w-(--content-max-width) px-6 lg:px-0">
          <SkillDetail skill={skill} />
        </section>
      </main>
    </>
  );
}
