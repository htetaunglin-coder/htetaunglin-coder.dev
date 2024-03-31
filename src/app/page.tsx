"use client";

import { AnimatePresence } from "framer-motion";
import React from "react";
import HeroSection from "@/containers/home-page/hero-section";

const Home = () => {
  return (
    <div className="app relative bg-gray-300 dark:bg-flat-black">
      <AnimatePresence mode="wait">
        <div
          id="home"
          className="relative flex items-center justify-center w-5/6 min-h-screen mx-auto border-b max-w-screen-smd md:items-start md:pt-56 scroll-effect border-b-gray-700">
          <HeroSection />
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
