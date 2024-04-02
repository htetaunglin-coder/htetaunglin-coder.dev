import React from "react";

import Transition from "@/components/animation/Transition";

import HeroSection from "@/containers/home-page/hero-section";
import Contact from "@/containers/home-page/contact-section";
import Footer from "@/components/footer/Footer";
import AboutMeSection from "@/containers/home-page/about-me-section";
import SkillSection from "@/containers/home-page/skills-section";
import ProjectSection from "@/containers/home-page/project-section";

// =========================================================

const Home = () => {
  return (
    <Transition>
      <div className="relative">
        <HeroSection />

        <AboutMeSection />

        <SkillSection />

        <ProjectSection />

        <Contact />
      </div>

      <Footer />
    </Transition>
  );
};

export default Home;
