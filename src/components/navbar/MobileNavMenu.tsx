"use client";

import React, { useState } from "react";

import cn from "classnames";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { FaBars, FaRegFileLines } from "react-icons/fa6";

import ToggleTheme from "../toggletheme/ToggleTheme";

interface MobileNavMenuProps {
  navLinkItems: Array<string>;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ navLinkItems }) => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);

  return (
    <>
      <div className="flex items-center sm:hidden">
        <ToggleTheme className="mr-2 text-sm text-gray-800 dark:text-gray-300" />
        <MobileNavLinkButton
          href="/resume"
          classNames="bg-gray-800 text-gray-300">
          <FaRegFileLines size={20} />
          <p className="font-righteous text-xs tracking-widest">Resume</p>
        </MobileNavLinkButton>

        <MobileNavLinkButton
          href="/projects"
          classNames="bg-pink text-flat-black">
          <p className="font-righteous text-xs font-bold uppercase tracking-wide">
            Projects
          </p>
        </MobileNavLinkButton>

        <button
          className="rounded-full border border-gray-800 p-[5px] text-gray-800 dark:border-gray-300 dark:text-gray-300"
          onClick={() => setIsMenuToggled(true)}>
          <FaBars />
        </button>
      </div>
      <OverLayMenu
        isActive={isMenuToggled}
        setIsActive={setIsMenuToggled}
        navLinkItems={navLinkItems}
      />
    </>
  );
};

interface OverLayMenuProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  navLinkItems: Array<string>;
}

const OverLayMenu: React.FC<OverLayMenuProps> = ({
  isActive,
  setIsActive,
  navLinkItems,
}) => (
  <>
    {isActive && (
      <div className="absolute inset-0 h-screen w-full bg-flat-black opacity-80"></div>
    )}
    <div
      style={{
        right: isActive ? "0px" : "-50%",
        transition: "right 0.3s 0.1s ease-in-out",
      }}
      className="fixed top-0 h-screen w-1/2 bg-white text-flat-black sm:hidden">
      {/* CLOSE ICON */}
      <div className="flex justify-end px-5 pt-5">
        <button
          className="mb-5 mr-4 text-2xl text-black"
          onClick={() => setIsActive(false)}>
          <FaTimes />
        </button>
      </div>

      {navLinkItems.map((item) => (
        <MobileNavLink
          key={item}
          onClick={() => setIsActive(false)}
          href={`#${item.toLocaleLowerCase()}`}
          content={item}
        />
      ))}
    </div>
  </>
);

interface MobileNavLinkProps {
  href: string;
  content: string;
  className?: string;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  href,
  content,
  className,
  onClick,
}) => (
  <a
    className={cn(
      "mt-2 block border-b border-b-gray-400 px-4 py-2 font-semibold text-flat-black sm:inline-block",
      className,
    )}
    onClick={onClick}
    style={{ transition: "all 0.2s ease-in-out" }}
    href={href}>
    {content}
  </a>
);

interface MobileNavLinkButtonProps {
  href: string;
  children: React.ReactNode;
  classNames?: string;
}

const MobileNavLinkButton: React.FC<MobileNavLinkButtonProps> = ({
  href,
  children,
  classNames,
}) => (
  <Link
    className={cn(
      "mr-2 flex items-center gap-1 rounded-sm px-1 py-1 font-righteous text-xs xs:px-2",
      classNames,
    )}
    href={href}>
    {children}
  </Link>
);

export default MobileNavMenu;
