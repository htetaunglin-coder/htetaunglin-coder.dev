"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import skillData from "../_data/skill-data.json";

// ==================================================================

const DesktopView = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ staggerChildren: 0.25 }}
      viewport={{ once: true }}
      className="mt-16 hidden grid-cols-4 place-items-center justify-center gap-14 sm:grid lg:grid-cols-6 lg:gap-x-10 lg:gap-y-14">
      {skillData.map((data) => (
        <EachSkill key={data.title} data={data} />
      ))}
    </motion.div>
  );
};

interface EachSkillProps {
  data: { imageUrl: string; title: string };
}

const EachSkill: React.FC<EachSkillProps> = ({ data }) => {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
        },
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="w-full"
      key={data.title}>
      <Image
        src={data.imageUrl}
        alt={data.title}
        width={40}
        height={40}
        className={`mx-auto w-1/3 max-w-[3rem] select-none brightness-[0.8] ${data.title === "Nextjs" && "dark:invert"}`}
        draggable="false"
        loading="lazy"
      />
      <p className="mt-2 text-center text-base font-semibold text-gray-800 dark:text-gray-400">
        {data.title}
      </p>
    </motion.div>
  );
};

export default DesktopView;
