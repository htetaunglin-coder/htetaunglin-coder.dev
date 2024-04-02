"use client";

import React from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

import DesktopView from "./DesktopView";
import MobileView from "./MobileView";
import SectionTitle from "@/components/sectionTitle/SectionTitle";

// =============================================================

const AboutMeSection = () => {
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  return (
    <section
      id="about me"
      className="relative mx-auto h-full w-5/6 max-w-screen-smd border-b border-b-gray-700 pt-32"
    >
      <SectionTitle content="About Me" />

      {isDesktop ? <DesktopView /> : <MobileView />}
    </section>
  );
};

export default AboutMeSection;
