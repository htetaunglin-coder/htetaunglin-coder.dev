import { About } from "@/features/about/components/about";

import { ProfileBadge3D } from "@/features/about/components/profile-badge";

export const revalidate = 604_800; // 7 days

const AboutPage = () => (
  <main className="pt-24 pb-28 md:pt-32">
    <section className="mx-auto w-full max-w-4xl px-8">
      <About />
    </section>

    <ProfileBadge3D />
  </main>
);

export default AboutPage;
