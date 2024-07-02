import React from "react";

import { FaQuestionCircle } from "react-icons/fa";

// =========================================================

const Tooltip = ({ content }: { content: string }) => {
  return (
    <span className="group relative cursor-pointer text-xl text-gray-800 dark:text-gray-200">
      <FaQuestionCircle />
      <p className="absolute right-5 w-fit whitespace-nowrap rounded bg-flat-black px-2 py-1 font-dmSans text-sm text-gray-300 opacity-0 duration-200 group-hover:opacity-100 dark:bg-white dark:text-flat-black">
        {content}
      </p>
    </span>
  );
};

export default Tooltip;
