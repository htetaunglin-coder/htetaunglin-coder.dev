import type { Metadata } from "next";
import { Suspense } from "react";
import { FadeAnimation } from "@/components/animations/fade-animation";
import { Contributions } from "@/features/home/components/contributions";
import { Experience } from "@/features/home/components/experience";
import { Hero } from "@/features/home/components/hero";
import { LazyContact } from "@/features/home/components/lazy-contact";
import { SelectedProject } from "@/features/home/components/selected-project";
import { Technologies } from "@/features/home/components/technologies";
import { Testimonial } from "@/features/home/components/testimonial";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

const HomePage = () => (
  <main className="flex justify-center pt-16 pb-16 sm:pt-24 sm:pb-20 md:pt-52">
    <div className="w-full max-w-4xl">
      <section className="w-full" id="hero">
        <Hero />
      </section>

      <section className="px-6 pt-24 lg:pt-28" id="selected-project">
        <SelectedProject />
      </section>

      <section className="px-6 pt-32 lg:pt-52" id="experience">
        <Experience />
      </section>

      <section className="px-6 pt-32 lg:pt-52" id="technologies">
        <Technologies />
      </section>

      <section className="px-6 pt-32 lg:pt-52" id="contributions">
        <Suspense fallback={<ContributionsFallback />}>
          <Contributions />
        </Suspense>
      </section>

      <section className="px-6 pt-32 lg:pt-52" id="testimonial">
        <Testimonial />
      </section>

      <section className="px-6 pt-32 lg:pt-52" id="contact">
        {/* Not Anymore, I am grinding my ass of trying to meet all of the deadlines :3 */}
        {/* <FadeAnimation as="div" delay={0.25} direction="up">
          <BackgroundImageTexture
            className="mb-6 w-full overflow-hidden bg-bg-secondary/40 p-2 sm:mb-12 sm:rounded-lg sm:px-4 sm:py-3 dark:bg-bg-secondary/10"
            opacity={0.5}
            variant="fabric-of-squares"
          >
            <p className="font-black font-doto text-[#350ab6] text-base tracking-tight sm:text-lg dark:text-[#b2a9f1]">
              I'm open to new opportunities. If your team is hiring or you want
              to collaborate, feel free to message me.
            </p>
          </BackgroundImageTexture>
        </FadeAnimation> */}

        <FadeAnimation as="div" delay={0.25} direction="up">
          <LazyContact />
        </FadeAnimation>
      </section>
    </div>
  </main>
);

export default HomePage;

const ContributionsFallback = () => (
  <div className="w-full">
    <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
      Contributions
    </h2>
    <div className="mt-4 h-[162px] w-full rounded-md border-b border-b-outline-secondary bg-bg-secondary/40 pb-6 sm:mt-8" />
  </div>
);
