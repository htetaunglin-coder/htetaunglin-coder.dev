import { FiGithub } from "react-icons/fi";
import { GoProjectSymlink } from "react-icons/go";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface EachProjectProps {
  title: string;
  imgUrl: string;
  techs: Array<string>;
  liveUrl: string;
  sourceUrl: string;
}

export const EachProject: React.FC<EachProjectProps> = ({ title, imgUrl, techs, liveUrl, sourceUrl }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <motion.div
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      transition={{ duration: 1.5 }}
      className={`text-center w-full relative max-w-md mx-auto sm:max-w-none cursor-pointer border  ${
        isActive ? "border-gray-500" : "border-gray-500 dark:border-gray-800"
      }`}>
      <Image src={imgUrl} alt={title} width={400} height={400} className="w-full h-full aspect-4/3 object-cover" />
      <div
        className={`absolute flex inset-0 bg-flat-black duration-300 items-center justify-center flex-col p-2 ${
          isActive ? "opacity-95" : "opacity-0"
        }`}
        onClick={() => setIsActive((prev) => !prev)}>
        <h1 className="text-xl lg:text-2xl text-white font-playfair max-w-xs">{title}</h1>

        <ul className="mt-3 max-w-xs">
          {techs.map((eachTech) => {
            return (
              <li
                key={eachTech}
                className="uppercase text-xs font-dmSans text-flat-black font-semibold inline-block px-2 rounded bg-pink m-1">
                {eachTech}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-center mt-3">
          <a
            target="_blank"
            href={liveUrl}
            className={`mx-1 flex bg-light-blue text-flat-black font-dmSans font-semibold text-sm hover:brightness-75 items-center justify-center gap-2 px-3 py-1 rounded ${
              isActive ? "pointer-events-auto" : "pointer-events-none"
            }`}>
            <GoProjectSymlink size={20} /> <p>Visit</p>
          </a>
          <a
            target="_blank"
            href={sourceUrl}
            className={`text-white mx-1 inline-block text-2xl ${
              isActive ? "pointer-events-auto" : "pointer-events-none"
            }`}>
            <FiGithub />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
