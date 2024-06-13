import React from "react";

import Link from "next/link";
import { FaRegFileLines } from "react-icons/fa6";
import { FiFacebook, FiGithub, FiLinkedin } from "react-icons/fi";

import ToggleTheme from "../toggletheme/ToggleTheme";

// =========================================================

const rightBarData = [
  {
    icon: <FiFacebook size={20} />,
    url: "https://www.facebook.com/profile.php?id=100083287641210",
  },
  {
    icon: <FiLinkedin size={20} />,
    url: "https://www.linkedin.com/in/htetaunglin-coder",
  },
  { icon: <FiGithub size={20} />, url: "https://github.com/HTLA380" },
];

const RightBar = () => {
  return (
    <div className="fixed right-[7%] top-1/2 z-40 flex -translate-y-1/2 flex-col gap-10 text-navy-blue dark:text-light-blue max-md:hidden">
      <ToggleTheme />
      {rightBarData.map((data) => (
        <a
          key={data.url}
          className="transition duration-200 hover:text-gray-600"
          target="_blank"
          href={data.url}
        >
          {data.icon}
        </a>
      ))}

      <Link
        className="-ml-3 flex flex-col items-center justify-center text-dark-pink transition duration-200 hover:text-gray-600 dark:text-pink"
        href="/resume"
      >
        <FaRegFileLines size={20} />
        <p className="font-righteous text-xs tracking-widest">Resume</p>
      </Link>
    </div>
  );
};

export default RightBar;
