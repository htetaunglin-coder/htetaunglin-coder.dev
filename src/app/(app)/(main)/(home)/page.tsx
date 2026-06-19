import type { Metadata } from "next";
import { Suspense } from "react";
import {
  FadeAnimation,
  FadeStaggeredAnimation,
} from "@/components/animations/fade-animation";
import { Contributions } from "@/features/home/components/contributions";
import { Experience } from "@/features/home/components/experience";
import { Hero } from "@/features/home/components/hero";
import { SelectedProject } from "@/features/home/components/selected-project";
import { Technologies } from "@/features/home/components/technologies";
import { Testimonial } from "@/features/home/components/testimonial";
import { WorkWithMe } from "@/features/home/components/work-with-me";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

const HomePage = () => (
  <main
    className="flex justify-center pt-16 pb-16 sm:pt-24 sm:pb-20 md:pt-52"
    data-smooth-scroll
  >
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
        <FadeStaggeredAnimation direction="up">
          <Testimonial />
        </FadeStaggeredAnimation>
      </section>

      <section className="mt-12 px-6 pt-20 lg:mt-0 lg:pt-52" id="work-with-me">
        <FadeAnimation as="div" delay={0.25} direction="up">
          <WorkWithMe />
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
