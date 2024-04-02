import React from "react";

// =========================================================

const SectionTitle = ({ content }: { content: string }) => {
  return (
    <h1 className="relative inline-block cursor-pointer font-playfair text-2xl font-bold text-navy-blue before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-full before:bg-gray-500 dark:font-normal dark:text-light-blue sm:text-3xl">
      {content}
    </h1>
  );
};

export default SectionTitle;
