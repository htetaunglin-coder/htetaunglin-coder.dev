import React from "react";

import { FiFacebook, FiLinkedin, FiGithub } from "react-icons/fi";
import { FaRegFileLines } from "react-icons/fa6";
import Link from "next/link";
import ToggleTheme from "../toggletheme/ToggleTheme";

const RightBar = () => {
  return (
    <div className="max-md:hidden text-navy-blue dark:text-light-blue fixed right-[7%] top-1/2 -translate-y-1/2 flex flex-col gap-10 z-40">
      <ToggleTheme />
      <a
        className="transition duration-200 hover:text-gray-600"
        target="_blank"
        href="https://www.facebook.com/profile.php?id=100083287641210">
        <FiFacebook size={20} />
      </a>
      <a
        className="transition duration-200 hover:text-gray-600"
        target="_blank"
        href="https://www.linkedin.com/in/htet-aung-lin-741968291
      ">
        <FiLinkedin size={20} />
      </a>
      <a className="transition duration-200 hover:text-gray-600" target="_blank" href="https://github.com/HTLA380">
        <FiGithub size={20} />
      </a>

      <Link
        className="flex flex-col items-center justify-center -ml-3 transition duration-200 text-dark-pink dark:text-pink hover:text-gray-600"
        href="/resume">
        <FaRegFileLines size={20} />
        <p className="text-xs tracking-widest font-righteous">Resume</p>
      </Link>
    </div>
  );
};

export default RightBar;
