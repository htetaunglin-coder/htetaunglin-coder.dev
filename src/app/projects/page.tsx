"use client";

import React from "react";
import Link from "next/link";

import { FiFacebook, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaRegFileLines } from "react-icons/fa6";

import ToggleTheme from "@/components/toggletheme/ToggleTheme";
import Footer from "@/components/footer/Footer";
import Transition from "@/components/animation/Transition";

import ProjectShowCase from "@/containers/project-page/project-showcase-section";

// =========================================================

const ProjectPage = () => {
  const renderNavbar = (
    <header>
      <nav className="mx-auto flex w-5/6 items-center justify-between py-5">
        <Link
          href="/"
          className="font-serif text-xl text-dark-pink dark:text-pink xs:text-2xl sm:text-3xl"
        >
          HTLA
        </Link>
        <div className="flex items-center text-xl text-gray-800 dark:text-gray-400 sm:gap-8 md:gap-4">
          <ToggleTheme className="mr-2 text-sm sm:text-base" />
          <Link
            href="/resume"
            className="flex w-fit items-center gap-1 rounded-md bg-gray-900 p-2 text-xs text-pink transition duration-300 hover:bg-pink hover:text-gray-900 sm:text-sm"
          >
            <FaRegFileLines />
            <p className="font-righteous font-normal tracking-widest">Resume</p>
          </Link>
          <a
            className="mx-1"
            target="_blank"
            href="https://www.facebook.com/profile.php?id=100083287641210"
          >
            <FiFacebook />
          </a>
          <a
            className="mx-1"
            target="_blank"
            href="https://www.linkedin.com/in/htet-aung-lin-741968291
"
          >
            <FiLinkedin />
          </a>
          <a className="mx-1" target="_blank" href="https://github.com/HTLA380">
            <FiGithub />
          </a>
        </div>
      </nav>
    </header>
  );

  return (
    <Transition>
      <>
        {renderNavbar}
        <ProjectShowCase />
        <Footer />
      </>
    </Transition>
  );
};

export default ProjectPage;
