import React from "react";

const SectionTitle = ({ content }: { content: string }) => {
  return (
    <h1 className="text-navy-blue dark:text-light-blue text-2xl sm:text-3xl relative inline-block before:w-full before:h-0.5 before:bg-gray-500 before:absolute before:-bottom-1 before:left-0 cursor-pointer font-playfair font-bold dark:font-normal">
      {content}
    </h1>
  );
};

export default SectionTitle;
