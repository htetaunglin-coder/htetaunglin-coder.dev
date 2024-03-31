import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

const Tooltip = ({ content }: { content: string }) => {
  return (
    <span className="text-xl text-gray-800 dark:text-gray-200 cursor-pointer relative group">
      <FaQuestionCircle />
      <p className="absolute text-sm w-fit whitespace-nowrap bg-flat-black dark:bg-white text-gray-300 dark:text-flat-black font-dmSans right-5 py-1 px-2 rounded duration-200 opacity-0 group-hover:opacity-100">
        {content}
      </p>
    </span>
  );
};

export default Tooltip;
