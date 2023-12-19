import React from "react";
import SectionTitle from "../../components/SectionTitle";
import ProjectImg5 from "../../assets/projects/project-5.jpeg";
import { Link } from "react-router-dom";
import AnimatedDiv from "../../components/animation/AnimateDiv";
import { GoProjectSymlink } from "react-icons/go";
import { FiGithub } from "react-icons/fi";

const MobileProject = () => {
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
        className="flex items-center text-center flex-col mx-auto mt-8">
        <img
          src={ProjectImg5}
          alt="Recipe App Using React JS"
          className="w-full max-w-xs h-full object-cover"
          loading="lazy"
        />
        <div className="max-w-xs mt-3">
          <h1 className="text-xl font-playfair text-flat-black dark:text-white font-bold dark:font-normal">
            Recipe App Using React JS
          </h1>
          <p className="text-red-800 dark:text-pink font-dmSans text-sm lg:text-base leading-5 mt-2">
            This project is a React-based web application that allows users to
            search their favorite recipes. The app uses an API to fetch recipe
            data and display it in a user-friendly interface.
          </p>
          <div className="mt-2 mb-2 flex items-baseline justify-between sm:block">
            <ul className="mt-2 order-2">
              <li className="uppercase text-xs font-dmSans text-flat-black font-semibold inline-block px-1 bg-light-blue m-1">
                React
              </li>

              {/* <li className="uppercase text-sm font-dmSans text-flat-black font-semibold inline-block px-1 sm:px-2 rounded bg-light-blue m-1">
                styled-components
              </li>
              <li className="uppercase text-sm font-dmSans text-flat-black font-semibold inline-block px-1 sm:px-2 rounded bg-light-blue m-1">
                SPOONACULAR API
              </li> */}
            </ul>
            <div className="flex items-center justify-center sm:justify-start">
              <a
                target="_blank"
                href="https://htl-easybank-landing.netlify.app/"
                className="mx-1 flex bg-gray-400 text-flat-black font-dmSans font-semibold hover:brightness-75 items-center justify-center gap-2 px-3 py-1 text-sm rounded">
                <GoProjectSymlink size={20} /> <p>Visit</p>
              </a>
              <a
                target="_blank"
                href="https://github.com/HTLA380/EasyBank-Landing-Page.git"
                className="text-dark-pink dark:text-pink mx-1 inline-block text-xl">
                <FiGithub />
              </a>
            </div>
          </div>
        </div>
      </AnimatedDiv>
      <Link
        to="/projects"
        className="bg-transparent border-2 border-gray-800 dark:border-gray-400 text-gray-800 dark:text-gray-400 block w-fit mt-5 py-2 px-4 rounded-md border-solid font-semibold hover:bg-gray-400 hover:text-flat-black duration-500 hover:tracking-widest mx-auto text-sm">
        All Projects
      </Link>
    </section>
  );
};

export default MobileProject;
