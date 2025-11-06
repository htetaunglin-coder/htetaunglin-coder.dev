import { Contact } from "@/features/home/components/contact";
import { Contributions } from "@/features/home/components/contributions";
import { Experience } from "@/features/home/components/experience";
import { Hero } from "@/features/home/components/hero";
import { SelectedProject } from "@/features/home/components/selected-project";
import { Technologies } from "@/features/home/components/technologies";
import { Testimonial } from "@/features/home/components/testimonial";

const HomePage = () => (
  <main className="flex justify-center pt-24 pb-12 sm:pb-20 md:pt-52">
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
        <Contact />
      </section>
    </div>
  </main>
);

export default HomePage;
