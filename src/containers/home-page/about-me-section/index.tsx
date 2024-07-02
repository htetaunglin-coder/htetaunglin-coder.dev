import React from "react";

import SectionTitle from "@/components/sectionTitle/SectionTitle";

import DesktopView from "./DesktopView";
import MobileView from "./MobileView";

// =============================================================

const AboutMeSection = () => {
  return (
    <section
      id="about me"
      className="relative mx-auto h-full w-5/6 max-w-screen-smd border-b border-b-gray-700 pt-32"
    >
      <SectionTitle content="About Me" />
      <DesktopView />
      <MobileView />
    </section>
  );
};

export default AboutMeSection;
