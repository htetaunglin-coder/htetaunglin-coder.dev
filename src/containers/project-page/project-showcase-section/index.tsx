"use client";

import React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

import SectionTitle from '@/components/sectionTitle/SectionTitle';
import Tooltip from '@/components/tooltip/Tooltip';

import ProjectData from '../_data/projects-data.json';
import { EachProject } from './EachProject';

// =========================================================

const ProjectShowCase = () => {
  return (
    <main className="mx-auto min-h-screen w-5/6 max-w-screen-lg pb-32 pt-20">
      <div className="flex items-center justify-between">
        <SectionTitle content={"Projects"} />
        <Tooltip content={"Click the image to see more information"} />
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.5 }}
        className="mt-10 grid grid-cols-1 items-stretch justify-center border-b border-b-gray-400 pb-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ProjectData.map((data) => (
          <EachProject
            key={data.title}
            title={data.title}
            techs={data.techs}
            imgUrl={data.imgUrl}
            liveUrl={data.liveUrl}
            sourceUrl={data.sourceUrl}
          />
        ))}
        <motion.div
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 1.5 }}
          className="relative mx-auto flex aspect-4/3 w-full max-w-md cursor-pointer items-center justify-center
      border border-gray-500 bg-black/80 text-center dark:border-gray-800 sm:max-w-none"
        >
          <p className="w-1/2 text-white">
            Explore all my projects on{" "}
            <a
              className="text-blue-400 underline hover:text-blue-500"
              href="https://github.com/HTLA380"
              target="_blank"
            >
              GitHub
            </a>
            .
          </p>
        </motion.div>
      </motion.div>

      <Link
        href="/"
        className="mt-4 flex w-fit items-center gap-1 rounded-md bg-gray-900 p-2 text-xs text-pink transition duration-300 hover:bg-pink hover:text-gray-900 sm:text-sm"
      >
        <FaArrowLeft />
        <p className="font-righteous tracking-widest">Home</p>
      </Link>
    </main>
  );
};

export default ProjectShowCase;
