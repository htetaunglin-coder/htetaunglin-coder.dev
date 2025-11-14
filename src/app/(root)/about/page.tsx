import { About } from "@/features/about/components/about";

import { ProfileBadge3D } from "@/features/about/components/profile-badge";

export const revalidate = 604_800; // 7 days

const AboutPage = () => (
  <main className="pt-16 pb-28 sm:pt-24 md:pt-32">
    <section className="mx-auto w-full max-w-4xl px-6">
      <About />
    </section>

    <ProfileBadge3D />
  </main>
);

export default AboutPage;
