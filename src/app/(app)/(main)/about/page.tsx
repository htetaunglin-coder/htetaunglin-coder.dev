import type { Metadata } from "next";
import { About } from "@/features/about/components/about";
import { ProfileBadge3D } from "@/features/about/components/profile-badge";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/utils";

// We have to revalidate (AKA: update) the about me page every 7 days or so
// so that we can display the current age correctly. I think there would be a
// better solution to this but currently, I'll just leave it as it is.
export const revalidate = 604_800; // 7 days

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.description} Learn more about my background, skills, and journey as a developer.`,
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About | Htet Aung Lin",
    description: `${siteConfig.description} Learn more about my background, skills, and journey as a developer.`,
    url: absoluteUrl("/about"),
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "About | Htet Aung Lin",
    description: `${siteConfig.description} Learn more about my background, skills, and journey as a developer.`,
  },
};

const AboutPage = () => (
  <main className="pt-16 pb-28 sm:pt-24 md:pt-32">
    <section className="mx-auto w-full max-w-4xl px-6">
      <About />
    </section>

    <div className="hidden 2xl:block">
      <ProfileBadge3D />
    </div>
  </main>
);

export default AboutPage;
