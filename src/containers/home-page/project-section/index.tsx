import React from "react";

import Image from "next/image";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";
import { GoProjectSymlink } from "react-icons/go";

import AnimatedDiv from "@/components/animation/AnimateDiv";
import SectionTitle from "@/components/sectionTitle/SectionTitle";

import projectData from "../_data/project-data.json";

// ==================================================================

const ProjectSection = () => {
  const {
    imageUrl,
    altText,
    title,
    description,
    technologies,
    websiteUrl,
    sourceUrl,
  } = projectData;

  return (
    <section
      id="project"
      className="relative mx-auto h-full w-5/6 max-w-screen-smd border-b border-b-gray-700 py-20">
      <SectionTitle content={"Projects"} />

      <AnimatedDiv
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        delayTime={0.2}
        duration={1}
        className="mx-auto mt-8 flex flex-col items-center text-center sm:flex-row sm:gap-10 sm:text-start md:w-11/12">
        <ProjectImage url={imageUrl} altText={altText} />
        <div className="mt-3 max-w-xs sm:w-1/2 sm:max-w-none">
          <Title content={title} />
          <Description
            content={description}
            technologies={technologies}
            websiteUrl={websiteUrl}
            sourceUrl={sourceUrl}
          />
        </div>
      </AnimatedDiv>
      <ProjectLinkButton />
    </section>
  );
};

const ProjectImage = ({ url, altText }: { url: string; altText: string }) => (
  <Image
    src={url}
    width={400}
    height={400}
    alt={altText}
    className="h-full w-full max-w-xs object-cover sm:w-1/2 sm:max-w-none"
    loading="lazy"
  />
);

const Title = ({ content }: { content: string }) => (
  <h3 className="font-playfair text-xl font-bold text-flat-black dark:font-normal dark:text-white sm:text-2xl ">
    {content}
  </h3>
);

const Description = ({
  content,
  technologies,
  websiteUrl,
  sourceUrl,
}: {
  content: string;
  technologies: Array<string>;
  websiteUrl: string;
  sourceUrl: string;
}) => (
  <>
    <div className="hidden sm:block">
      <div className="mb-5 mt-2">
        <p className="font-dmSans text-sm font-medium text-red-800 dark:font-normal dark:text-pink lg:text-base">
          {content}
        </p>
        <ul className="mt-3">
          {technologies.map((item) => (
            <li
              className="m-1 inline-block rounded bg-navy-blue px-2 font-dmSans text-sm font-semibold uppercase text-gray-300 dark:bg-light-blue dark:text-flat-black"
              key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center">
        <a
          target="_blank"
          href={websiteUrl}
          className="mx-1 flex items-center justify-center gap-2 rounded bg-gray-800 px-3 py-1 font-dmSans font-semibold text-gray-300 hover:brightness-75 dark:bg-gray-400 dark:text-flat-black">
          <GoProjectSymlink size={20} /> <p>Visit</p>
        </a>
        <a
          target="_blank"
          href={sourceUrl}
          className="mx-1 inline-block text-2xl text-dark-pink dark:text-pink">
          <FiGithub />
        </a>
      </div>
    </div>
    {/* MOBILE SCREEN */}
    <div className="block sm:hidden">
      <p className="mt-2 font-dmSans text-sm leading-5 text-red-800 dark:text-pink lg:text-base">
        {content}
      </p>
      <div className="mb-2 mt-2 flex items-baseline justify-between sm:block">
        <ul className="order-2 mt-2">
          <li className="m-1 inline-block bg-light-blue px-1 font-dmSans text-xs font-semibold uppercase text-flat-black">
            {technologies[0]}
          </li>
        </ul>
        <div className="flex items-center justify-center sm:justify-start">
          <a
            target="_blank"
            href={websiteUrl}
            className="mx-1 flex items-center justify-center gap-2 rounded bg-gray-400 px-3 py-1 font-dmSans text-sm font-semibold text-flat-black hover:brightness-75">
            <GoProjectSymlink size={20} /> <p>Visit</p>
          </a>
          <a
            target="_blank"
            href={sourceUrl}
            className="mx-1 inline-block text-xl text-dark-pink dark:text-pink">
            <FiGithub />
          </a>
        </div>
      </div>
    </div>
  </>
);

const ProjectLinkButton = () => (
  <Link
    href="/projects"
    className="mx-auto mt-5 block w-fit rounded-md border-2 border-solid border-gray-800 bg-transparent px-4 py-2 text-sm font-semibold text-gray-800 duration-500 hover:bg-gray-400 hover:tracking-widest hover:text-flat-black dark:border-gray-400 dark:text-gray-400 dark:hover:text-flat-black sm:mt-10 sm:text-base">
    All Projects
  </Link>
);

export default ProjectSection;
