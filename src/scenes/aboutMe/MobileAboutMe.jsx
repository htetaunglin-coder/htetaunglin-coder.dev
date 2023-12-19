import React from "react";
import data from "./data.json";
import SectionTitle from "../../components/SectionTitle";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

const MobileAboutMe = () => {
  return (
    <section id="about me" className="pt-16 pb-10">
      <SectionTitle content="About Me" />

      <div className="mb-3 bg-secondary py-2 px-4 rounded-md mt-5">
        <h4 className="text-gray-400 flex items-center font-semibold text-xs mb-1">
          {data[0].title}
        </h4>
        <p className="text-pink font-dmSans text-xs/5 mb-3">{data[0].text}</p>
      </div>

      <div className="mb-3 bg-secondary py-2 px-4 rounded-md">
        <h4 className="text-gray-400 flex items-center font-semibold text-xs mb-1">
          {data[3].title}
        </h4>
        <p className="text-pink font-dmSans text-xs/5 mb-3">{data[3].text}</p>
      </div>

      <Accordion title={data[1].title} id={"accordion-1"} text={data[1].text} />

      <Accordion title={data[2].title} id={"accordion-2"} text={data[2].text} />
    </section>
  );
};

export default MobileAboutMe;

const Accordion = ({ title, text, id }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-secondary py-3 px-4 rounded-md mb-3">
      <input
        id={id ? id : "expandCollapse"}
        type="checkbox"
        checked={open}
        readOnly
        className="peer sr-only"
      />
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
