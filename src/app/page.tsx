"use client";

import { AnimatePresence } from "framer-motion";
import React from "react";
import HeroSection from "@/containers/home-page/hero-section";
import useMediaQuery from "@/hooks/useMediaQuery";
import { DesktopAboutMe, MobileAboutMe } from "@/containers/home-page/about-me-section";
import MobileSkills, { DesktopSkills } from "@/containers/home-page/skills-section";
import { DesktopProject, MobileProject } from "@/containers/home-page/project-section";

const Home = () => {
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  return (
    <div className="app relative bg-gray-300 dark:bg-flat-black">
      <AnimatePresence mode="wait">
        <div
          id="home"
          className="relative flex items-center justify-center w-5/6 min-h-screen mx-auto border-b max-w-screen-smd md:items-start md:pt-56 scroll-effect border-b-gray-700">
          <HeroSection />
        </div>
        <div className="w-5/6 max-w-screen-smd mx-auto h-full relative border-b border-b-gray-700">
          {isDesktop ? <DesktopAboutMe /> : <MobileAboutMe />}
        </div>
        <div className="w-5/6 max-w-screen-smd mx-auto h-full relative border-b border-b-gray-700 ">
          {isDesktop ? <DesktopSkills /> : <MobileSkills />}
        </div>
        <div className="w-5/6 max-w-screen-smd mx-auto h-full relative border-b border-b-gray-700 ">
          {isDesktop ? <DesktopProject /> : <MobileProject />}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
