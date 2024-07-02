"use client";

import React, { useState } from "react";

import { FaChevronDown } from "react-icons/fa6";

import data from "../_data/about-me-data.json";

// =============================================================

const MobileView = () => {
  return (
    <div className="block sm:hidden">
      <div className="mb-3 mt-5 rounded-md bg-secondary px-4 py-2">
        <h4 className="mb-1 flex items-center text-xs font-semibold text-gray-400">
          {data[0].title}
        </h4>
        <p className="mb-3 font-dmSans text-xs/5 text-pink">{data[0].text}</p>
      </div>
      <div className="mb-3 rounded-md bg-secondary px-4 py-2">
        <h4 className="mb-1 flex items-center text-xs font-semibold text-gray-400">
          {data[3].title}
        </h4>
        <p className="mb-3 font-dmSans text-xs/5 text-pink">{data[3].text}</p>
      </div>
      <Accordion title={data[1].title} id={"accordion-1"} text={data[1].text} />
      <Accordion title={data[2].title} id={"accordion-2"} text={data[2].text} />
    </div>
  );
};

const Accordion = ({
  title,
  text,
  id,
}: {
  title: string;
  text: string;
  id: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 w-full rounded-md bg-secondary px-4 py-3">
      <input
        id={id ? id : "expandCollapse"}
        type="checkbox"
        checked={open}
        readOnly
        className="peer sr-only"
      />
      <label
        className="flex w-full cursor-pointer items-center justify-between"
        htmlFor={id ? id : "expandCollapse"}
        onClick={() => setOpen(!open)}>
        <h4 className={"text-xs font-semibold text-gray-400"}>{title}</h4>
        <button className="text-white">
          <FaChevronDown size={12} />
        </button>
      </label>
      <div className="h-0 overflow-hidden peer-checked:my-3 peer-checked:h-auto">
        <p className={"text-xs/5 text-pink"}>{text}</p>
      </div>
    </div>
  );
};

export default MobileView;
