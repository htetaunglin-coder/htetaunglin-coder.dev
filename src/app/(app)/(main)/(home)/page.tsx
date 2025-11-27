import { FadeAnimation } from "@/components/animations/fade-animation";
import { BackgroundImageTexture } from "@/components/decorations/background-texture";
import { Contact } from "@/features/home/components/contact";
import { Contributions } from "@/features/home/components/contributions";
import { Experience } from "@/features/home/components/experience";
import { Hero } from "@/features/home/components/hero";
import { SelectedProject } from "@/features/home/components/selected-project";
import { Technologies } from "@/features/home/components/technologies";
import { Testimonial } from "@/features/home/components/testimonial";

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
        <Contributions />
      </section>

      <section className="px-6 pt-32 lg:pt-52" id="testimonial">
        <Testimonial />
      </section>

      <section className="px-6 pt-32 lg:pt-52" id="contact">
        <FadeAnimation as="div" delay={0.25} direction="up">
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
        </FadeAnimation>

        <FadeAnimation as="div" delay={0.5} direction="up">
          <Contact />
        </FadeAnimation>
      </section>
    </div>
  </main>
);

export default HomePage;
