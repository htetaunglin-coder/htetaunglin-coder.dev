import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import ProjectData from "./data.json";
import Link from "next/link";
import { EachProject } from "@/components/project/EachProject";
import SectionTitle from "@/components/sectionTItle/SectionTItle";
import Tooltip from "@/components/tooltip/Tooltip";

const ProjectShowCase = () => {
  return (
    <main className="w-5/6 max-w-screen-lg mx-auto min-h-screen pb-32 pt-20">
      <div className="flex justify-between items-center">
        <SectionTitle content={"Projects"} />
        <Tooltip content={"Click the image to see more information"} />
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch justify-center mt-10 border-b border-b-gray-400 pb-16">
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
      </motion.div>
      <Link
        href="/"
        className="text-pink mt-4 bg-gray-900 p-2 rounded-md flex items-center w-fit gap-1 hover:bg-pink hover:text-gray-900 transition duration-300 text-xs sm:text-sm">
        <FaArrowLeft />
        <p className="font-righteous tracking-widest">Home</p>
      </Link>
    </main>
  );
};

export default ProjectShowCase;
