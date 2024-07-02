import React from "react";

import SectionTitle from "@/components/sectionTitle/SectionTitle";

import DesktopView from "./DesktopView";
import MobileView from "./MobileView";

// =========================================================

const SkillSection = () => {
  return (
    <section
      id="skills"
      className="relative mx-auto h-full w-5/6 max-w-screen-smd border-b border-b-gray-700 py-16 sm:py-24">
      <SectionTitle content="Skills" />
      <DesktopView />
      <MobileView />
    </section>
  );
};

export default SkillSection;
