import { useState } from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiGithub } from "react-icons/fi";
import { GoProjectSymlink } from "react-icons/go";

// =========================================================

interface EachProjectProps {
  title: string;
  imgUrl: string;
  techs: Array<string>;
  liveUrl: string;
  sourceUrl: string;
}

export const EachProject: React.FC<EachProjectProps> = ({
  title,
  imgUrl,
  techs,
  liveUrl,
  sourceUrl,
}) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <motion.div
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      transition={{ duration: 1.5 }}
      className={`relative mx-auto w-full max-w-md cursor-pointer border text-center sm:max-w-none  ${
        isActive ? "border-gray-500" : "border-gray-500 dark:border-gray-800"
      }`}>
      <Image
        src={imgUrl}
        alt={title}
        width={400}
        height={400}
        loading="lazy"
        className="aspect-4/3 h-full w-full object-cover"
      />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-flat-black p-2 duration-300 ${
          isActive ? "opacity-95" : "opacity-0"
        }`}
        onClick={() => setIsActive((prev) => !prev)}>
        <h1 className="max-w-xs font-playfair text-xl text-white">{title}</h1>

        <ul className="mt-3 max-w-xs">
          {techs.map((eachTech) => {
            return (
              <li
                key={eachTech}
                className="m-1 inline-block rounded bg-pink px-2 font-dmSans text-xs font-semibold uppercase text-flat-black">
                {eachTech}
              </li>
            );
          })}
        </ul>

        <div className="mt-3 flex items-center justify-center">
          <a
            target="_blank"
            href={liveUrl}
            className={`mx-1 flex items-center justify-center gap-2 rounded bg-light-blue px-3 py-1 font-dmSans text-sm font-semibold text-flat-black hover:brightness-75 ${
              isActive ? "pointer-events-auto" : "pointer-events-none"
            }`}>
            <GoProjectSymlink size={20} /> <p>Visit</p>
          </a>
          <a
            target="_blank"
            href={sourceUrl}
            className={`mx-1 inline-block text-2xl text-white ${
              isActive ? "pointer-events-auto" : "pointer-events-none"
            }`}>
            <FiGithub />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
