import React from "react";

import { FiFacebook, FiLinkedin, FiGithub } from "react-icons/fi";
import { FaRegFileLines } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ToggleTheme from "../components/ToggleTheme";

const SocialMedia = () => {
  return (
    <div className="max-md:hidden text-navy-blue dark:text-light-blue fixed right-[7%] top-1/2 -translate-y-1/2 flex flex-col gap-10 z-40">
      <ToggleTheme />
      <a
        className="hover:text-gray-600 transition duration-200"
        target="_blank"
        href="https://www.facebook.com/profile.php?id=100083287641210">
        <FiFacebook size={20} />
      </a>
      <a
        className="hover:text-gray-600 transition duration-200"
        target="_blank"
        href="https://www.linkedin.com/in/htet-aung-lin-741968291
      ">
        <FiLinkedin size={20} />
      </a>
      <a
        className="hover:text-gray-600 transition duration-200"
        target="_blank"
        href="https://github.com/HTLA380">
        <FiGithub size={20} />
      </a>

      <Link
        className="text-dark-pink dark:text-pink flex items-center flex-col justify-center -ml-3 hover:text-gray-600 transition duration-200"
        to="/resume">
        <FaRegFileLines size={20} />
        <p className="text-xs font-righteous tracking-widest">Resume</p>
      </Link>
    </div>
  );
};

export default SocialMedia;
