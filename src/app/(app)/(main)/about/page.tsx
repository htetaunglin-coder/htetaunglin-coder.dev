import { About } from "@/features/about/components/about";

import { ProfileBadge3D } from "@/features/about/components/profile-badge";

// We have to revalidate (AKA: update) the about me page every 7 days or so
// so that we can display the current age correctly. I think there would be a
// better solution to this but currently, I'll just leave it as it is.
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
