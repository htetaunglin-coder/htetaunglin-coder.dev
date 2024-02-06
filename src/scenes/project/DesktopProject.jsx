import React from "react";
import SectionTitle from "../../components/SectionTitle";
import ProjectImg1 from "../../assets/projects/project-1.png";
import { Link } from "react-router-dom";
import AnimatedDiv from "../../components/animation/AnimateDiv";
import { GoProjectSymlink } from "react-icons/go";
import { FiGithub } from "react-icons/fi";

const DesktopProject = () => {
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
        <img
          src={ProjectImg1}
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
              Developed using React, Material UI, and ChartJS, this dashboard
              application employs mock data to demonstrate my skills.
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
        to="/projects"
        className="block px-4 py-2 mx-auto mt-10 font-semibold text-gray-800 duration-500 bg-transparent border-2 border-gray-800 border-solid rounded-md dark:border-gray-400 dark:text-gray-400 w-fit hover:bg-gray-400 hover:text-flat-black dark:hover:text-flat-black hover:tracking-widest">
        All Projects
      </Link>
    </section>
  );
};

export default DesktopProject;
