"use client";

import React from "react";
import Link from "next/link";
import { FiFacebook, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaRegFileLines } from "react-icons/fa6";
import ProjectShowCase from "@/containers/project-page/project-showcase-section";
import ToggleTheme from "@/components/toggletheme/ToggleTheme";
import Footer from "@/components/footer/Footer";
import Transition from "@/components/animation/Transition";

const ProjectPage = () => {
  return (
    <Transition>
      <div>
        <nav className="flex items-center justify-between mx-auto w-5/6 py-5">
          <Link href="/" className="font-serif text-xl xs:text-2xl sm:text-3xl text-dark-pink dark:text-pink">
            HTLA
          </Link>
          <div className="flex md:gap-4 sm:gap-8 items-center text-gray-800 dark:text-gray-400 text-xl">
            <ToggleTheme className="text-sm sm:text-base mr-2" />
            <Link
              href="/resume"
              className="text-pink bg-gray-900 p-2 rounded-md flex items-center w-fit gap-1 hover:bg-pink hover:text-gray-900 transition duration-300 text-xs sm:text-sm">
              <FaRegFileLines />
              <p className="font-righteous font-normal tracking-widest">Resume</p>
            </Link>
            <a className="mx-1" target="_blank" href="https://www.facebook.com/profile.php?id=100083287641210">
              <FiFacebook />
            </a>
            <a
              className="mx-1"
              target="_blank"
              href="https://www.linkedin.com/in/htet-aung-lin-741968291
      ">
              <FiLinkedin />
            </a>
            <a className="mx-1" target="_blank" href="https://github.com/HTLA380">
              <FiGithub />
            </a>
          </div>
        </nav>

        <ProjectShowCase />
        <Footer />
      </div>
    </Transition>
  );
};

export default ProjectPage;
