import React from "react";

import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";

import AnimatedDiv from "@/components/animation/AnimateDiv";

import data from "../_data/about-me-data.json";

// =============================================================

const DesktopView = () => {
  return (
    <div className="hidden pr-10 sm:block xl:p-0">
      <Article
        title={data[0].title}
        text={data[0].text}
        className="ml-10 mt-5"
        delayTime={0.25}
      />
      <Article
        title={data[1].title}
        text={data[1].text}
        delayTime={0.5}
        className="ml-10 mt-5"
      />
      <div className="mt-10 flex w-full items-start justify-between">
        <span className="relative flex h-[30rem] w-1/3 items-center justify-center text-white">
          <Image
            src={"/assets/images/guitar.svg"}
            alt="guitar"
            width={260}
            height={400}
            className="w-full select-none"
            draggable="false"
            loading="lazy"
          />
        </span>
        <div className="w-3/5">
          <Article
            title={data[2].title}
            text={data[2].text}
            delayTime={0.75}
            className="-ml-10"
          />
          <Article
            title={data[3].title}
            text={data[3].text}
            delayTime={1}
            className="-ml-10 mt-5"
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopView;

interface ArticleProps {
  title: string;
  text: string;
  delayTime?: number;
  className?: string;
}

const Article: React.FC<ArticleProps> = ({
  title,
  text,
  delayTime = 0,
  className,
}) => (
  <AnimatedDiv
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }}
    duration={0.5}
    delayTime={delayTime}
    className={className}
  >
    <h4 className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-400 lg:text-base">
      <FaChevronRight size={15} />
      {title}
    </h4>
    <p className="ml-14 font-dmSans text-sm font-medium text-red-800 dark:font-normal dark:text-pink lg:text-base">
      {text}
    </p>
  </AnimatedDiv>
);
