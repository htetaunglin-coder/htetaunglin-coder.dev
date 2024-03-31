"use client";

import React from "react";
import { useState } from "react";
import guitarImg from "../../assets/aboutme/guitar.svg";
import data from "./data.json";

import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import AnimatedDiv from "@/components/animation/AnimateDiv";
import SectionTitle from "@/components/sectionTItle/SectionTItle";
import Image from "next/image";

interface DesktopArticleProps {
  title: string;
  text: string;
  delayTime?: number;
  className?: string;
}

export const DesktopAboutMe = () => {
  const DesktopArticle: React.FC<DesktopArticleProps> = ({ title, text, delayTime = 0, className }) => {
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
        <p className="text-red-800 dark:text-pink font-dmSans ml-14 text-base font-medium dark:font-normal">{text}</p>
      </AnimatedDiv>
    );
  };

  return (
    <section id="about me" className="pt-32 ">
      <SectionTitle content="About Me" />

      <DesktopArticle title={data[0].title} text={data[0].text} className="mt-5 ml-10" delayTime={0.25} />

      <DesktopArticle title={data[1].title} text={data[1].text} delayTime={0.5} className="mt-5 ml-10" />

      <div className="w-full flex justify-between items-start mt-10">
        <span className="w-1/3 text-white h-[30rem] flex items-center justify-center relative">
          <Image
            src={"/assets/images/guitar.svg"}
            alt="guitar"
            width={260}
            height={400}
            className="select-none w-full"
            draggable="false"
            loading="lazy"
          />
        </span>
        <div className="w-3/5">
          <DesktopArticle title={data[2].title} text={data[2].text} delayTime={0.75} className="-ml-10" />
          <DesktopArticle title={data[3].title} text={data[3].text} delayTime={1} className="-ml-10 mt-5" />
        </div>
      </div>
    </section>
  );
};

// =============================

interface MobileAccordionProps {
  title: string;
  text: string;
  id: string;
}

export const MobileAboutMe = () => {
  const MobileAccordion: React.FC<MobileAccordionProps> = ({ title, text, id }) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="w-full bg-secondary py-3 px-4 rounded-md mb-3">
        <input id={id ? id : "expandCollapse"} type="checkbox" checked={open} readOnly className="peer sr-only" />
        <label
          className="w-full flex justify-between items-center cursor-pointer"
          htmlFor={id ? id : "expandCollapse"}
          onClick={() => setOpen(!open)}>
          <h4 className={"text-gray-400 font-semibold text-xs"}>{title}</h4>
          <button className="text-white">
            <FaChevronDown size={12} />
          </button>
        </label>
        <div className="overflow-hidden h-0 peer-checked:h-auto peer-checked:my-3">
          <p className={"text-pink text-xs/5"}>{text}</p>
        </div>
      </div>
    );
  };

  return (
    <section id="about me" className="pt-16 pb-10">
      <SectionTitle content="About Me" />

      <div className="mb-3 bg-secondary py-2 px-4 rounded-md mt-5">
        <h4 className="text-gray-400 flex items-center font-semibold text-xs mb-1">{data[0].title}</h4>
        <p className="text-pink font-dmSans text-xs/5 mb-3">{data[0].text}</p>
      </div>

      <div className="mb-3 bg-secondary py-2 px-4 rounded-md">
        <h4 className="text-gray-400 flex items-center font-semibold text-xs mb-1">{data[3].title}</h4>
        <p className="text-pink font-dmSans text-xs/5 mb-3">{data[3].text}</p>
      </div>

      <MobileAccordion title={data[1].title} id={"accordion-1"} text={data[1].text} />

      <MobileAccordion title={data[2].title} id={"accordion-2"} text={data[2].text} />
    </section>
  );
};
