import React from "react";
import Link from "next/link";
import { GoProjectSymlink } from "react-icons/go";
import { FiGithub } from "react-icons/fi";
import SectionTitle from "@/components/sectionTItle/SectionTItle";
import AnimatedDiv from "@/components/animation/AnimateDiv";
import Image from "next/image";

export const DesktopProject = () => {
  return (
    <section id="project" className="py-20">
      <SectionTitle content={"Projects"} />

      <AnimatedDiv
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        delayTime={0.2}
        duration={1}
        className="flex gap-10 mx-auto mt-8 md:w-11/12 text-start">
        <Image
          src={"/assets/images/projects/project-1.png"}
          width={400}
          height={400}
          alt="Recipe App Using React JS"
          className="object-cover w-1/2 h-full"
          loading="lazy"
        />
        <div className="w-1/2 mt-3">
          <h1 className="text-2xl font-bold lg:text-3xl font-playfair text-flat-black dark:text-white dark:font-normal">
            ReactBoard Using Material UI
          </h1>
          <div className="mt-2 mb-5">
            <p className="text-sm font-medium text-red-800 dark:text-pink font-dmSans lg:text-base dark:font-normal">
              Developed using React, Material UI, and ChartJS, this dashboard application employs mock data to
              demonstrate my skills.
            </p>
            <ul className="mt-3">
              <li className="inline-block px-2 m-1 text-sm font-semibold text-gray-300 uppercase rounded font-dmSans dark:text-flat-black bg-navy-blue dark:bg-light-blue">
                React
              </li>
              <li className="inline-block px-2 m-1 text-sm font-semibold text-gray-300 uppercase rounded font-dmSans dark:text-flat-black bg-navy-blue dark:bg-light-blue">
                Material UI
              </li>
              <li className="inline-block px-2 m-1 text-sm font-semibold text-gray-300 uppercase rounded font-dmSans dark:text-flat-black bg-navy-blue dark:bg-light-blue">
                Chart JS
              </li>
            </ul>
          </div>
          <div className="flex items-center">
            <a
              target="_blank"
              href="https://htl-react-board.netlify.app/"
              className="flex items-center justify-center gap-2 px-3 py-1 mx-1 font-semibold text-gray-300 bg-gray-800 rounded dark:bg-gray-400 dark:text-flat-black font-dmSans hover:brightness-75">
              <GoProjectSymlink size={20} /> <p>Visit</p>
            </a>
            <a
              target="_blank"
              href="https://github.com/HTLA380/React-Dashboard.git"
              className="inline-block mx-1 text-2xl text-dark-pink dark:text-pink">
              <FiGithub />
            </a>
          </div>
        </div>
      </AnimatedDiv>
      <Link
        href="/projects"
        className="block px-4 py-2 mx-auto mt-10 font-semibold text-gray-800 duration-500 bg-transparent border-2 border-gray-800 border-solid rounded-md dark:border-gray-400 dark:text-gray-400 w-fit hover:bg-gray-400 hover:text-flat-black dark:hover:text-flat-black hover:tracking-widest">
        All Projects
      </Link>
    </section>
  );
};

// ====================================================

export const MobileProject = () => {
  return (
    <section id="project" className="py-20">
      <SectionTitle content={"Projects"} />

      <AnimatedDiv
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        delayTime={0.2}
        duration={1}
        className="flex flex-col items-center mx-auto mt-8 text-center">
        <Image
          width={300}
          height={300}
          src={"/assets/images/projects/project-1.png"}
          alt="Recipe App Using React JS"
          className="object-cover w-full h-full max-w-xs"
          loading="lazy"
        />
        <div className="max-w-xs mt-3">
          <h1 className="text-xl font-bold font-playfair text-flat-black dark:text-white dark:font-normal">
            ReactBoard Using Material UI
          </h1>
          <p className="mt-2 text-sm leading-5 text-red-800 dark:text-pink font-dmSans lg:text-base">
            Developed using React, Material UI, and ChartJS, this dashboard application employs mock data to demonstrate
            my skills.
          </p>
          <div className="flex items-baseline justify-between mt-2 mb-2 sm:block">
            <ul className="order-2 mt-2">
              <li className="inline-block px-1 m-1 text-xs font-semibold uppercase font-dmSans text-flat-black bg-light-blue">
                React
              </li>
            </ul>
            <div className="flex items-center justify-center sm:justify-start">
              <a
                target="_blank"
                href="https://htl-react-board.netlify.app/"
                className="flex items-center justify-center gap-2 px-3 py-1 mx-1 text-sm font-semibold bg-gray-400 rounded text-flat-black font-dmSans hover:brightness-75">
                <GoProjectSymlink size={20} /> <p>Visit</p>
              </a>
              <a
                target="_blank"
                href="https://github.com/HTLA380/React-Dashboard.git"
                className="inline-block mx-1 text-xl text-dark-pink dark:text-pink">
                <FiGithub />
              </a>
            </div>
          </div>
        </div>
      </AnimatedDiv>
      <Link
        href="/projects"
        className="block px-4 py-2 mx-auto mt-5 text-sm font-semibold text-gray-800 duration-500 bg-transparent border-2 border-gray-800 border-solid rounded-md dark:border-gray-400 dark:text-gray-400 w-fit hover:bg-gray-400 hover:text-flat-black dark:hover:text-flat-black hover:tracking-widest">
        All Projects
      </Link>
    </section>
  );
};
