import React from "react";
import guitarImg from "../../assets/aboutme/guitar.svg";
import data from "./data.json";

import { FaChevronRight } from "react-icons/fa";
import { FaMusic } from "react-icons/fa";
import AnimatedDiv from "../../components/animation/AnimateDiv";
import SectionTitle from "../../components/SectionTitle";

const Article = ({ title, text, delayTime = 0, className }) => {
  return (
    <AnimatedDiv
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      duration={0.5}
      delayTime={delayTime}
      className={className}>
      <h4 className="text-gray-800 dark:text-gray-400 flex items-center font-semibold text-base">
        <FaChevronRight size={15} />
        {title}
      </h4>
      <p className="text-red-800 dark:text-pink font-dmSans ml-14 text-base font-medium dark:font-normal">
        {text}
      </p>
    </AnimatedDiv>
  );
};

const DesktopAboutMe = () => {
  return (
    <section id="about me" className="pt-32 ">
      <SectionTitle content="About Me" />

      <Article
        title={data[0].title}
        text={data[0].text}
        className="mt-5 ml-10"
        delayTime={0.25}
      />

      <Article
        title={data[1].title}
        text={data[1].text}
        delayTime={0.5}
        className="mt-5 ml-10"
      />

      <div className="w-full flex justify-between items-start mt-10">
        <span className="w-1/3 text-white h-[30rem] flex items-center justify-center relative">
          <img
            src={guitarImg}
            alt="guitar"
            className="select-none w-full"
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
    </section>
  );
};

export default DesktopAboutMe;
