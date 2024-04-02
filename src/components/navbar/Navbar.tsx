"use client";

import { useEffect, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import Link from "next/link";

import { FaTimes } from "react-icons/fa";
import { FaRegFileLines, FaBars } from "react-icons/fa6";

import ToggleTheme from "../toggletheme/ToggleTheme";

// =========================================================

const Navbar = () => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  useEffect(() => {
    const toggleActive = () => {
      window.scrollY >= 100
        ? setIsNavbarActive(true)
        : setIsNavbarActive(false);
    };

    window.addEventListener("scroll", toggleActive);
  }, []);

  const renderDesktopMenu = (
    <div className="flex justify-between gap-12 md:gap-20 ">
      <NavLink page="Home" isDesktop={isDesktop} />
      <NavLink page="About Me" isDesktop={isDesktop} />
      <NavLink page="Skills" isDesktop={isDesktop} />
      <NavLink page="Project" isDesktop={isDesktop} />
      <NavLink page="Contact" isDesktop={isDesktop} />
      <ToggleTheme
        className={"text-lg text-gray-800 dark:text-gray-300 md:hidden"}
      />
    </div>
  );

  const renderMobileMenu = (
    <>
      <div className="flex items-center">
        <ToggleTheme
          className={"mr-2 text-sm text-gray-800 dark:text-gray-300"}
        />
        <Link
          className="mr-2 flex items-center gap-1 rounded-sm bg-gray-800 px-1 py-1 text-gray-300 xs:px-2"
          href="/resume"
        >
          <FaRegFileLines size={20} />
          <p className="font-righteous text-xs tracking-widest">Resume</p>
        </Link>
        <Link
          href="/projects"
          className="mr-2 flex items-center gap-1 rounded-sm bg-pink px-1 py-1 text-flat-black xs:px-2"
        >
          <p className="font-righteous text-xs font-bold uppercase tracking-wide">
            Projects
          </p>
        </Link>
        <button
          className="rounded-full border border-gray-800 p-[5px] text-gray-800 dark:border-gray-300 dark:text-gray-300"
          onClick={() => setIsMenuToggled(true)}
        >
          <FaBars />
        </button>
      </div>
      <div
        style={{
          right: isMenuToggled ? "0px" : "-50%",
          transition: "right 0.3s 0.1s ease-in-out",
        }}
        className="fixed bottom-0 h-full w-1/2 bg-white text-flat-black"
      >
        {/* CLOSE ICON */}
        <div className="flex justify-end px-5 pt-5">
          <button
            className="mb-5 mr-4 text-2xl text-black"
            onClick={() => setIsMenuToggled(!isMenuToggled)}
          >
            <FaTimes />
          </button>
        </div>

        {/* MENU ITEMS */}
        <div className="mt-10 px-2">
          <NavLink page="Home" isDesktop={isDesktop} />
          <NavLink page="About Me" isDesktop={isDesktop} />
          <NavLink page="Skills" isDesktop={isDesktop} />
          <NavLink page="Project" isDesktop={isDesktop} />
          <NavLink page="Contact" isDesktop={isDesktop} />
        </div>
      </div>
    </>
  );

  return (
    <header
      className={`fixed top-0 z-50 w-full font-dmSans ${
        isNavbarActive
          ? "bg-gray-300/90 shadow-lg shadow-black/10 dark:bg-flat-black/70"
          : ""
      }`}
    >
      {/* overlay */}
      {isMenuToggled && (
        <div className="absolute h-screen w-full bg-flat-black opacity-80"></div>
      )}

      <nav className="mx-auto flex w-5/6 items-center justify-between gap-2 py-3 sm:py-5">
        <Link
          href="/"
          className="font-serif text-xl text-dark-pink dark:text-pink xs:text-2xl sm:text-3xl"
        >
          HTLA
        </Link>

        {isDesktop ? renderDesktopMenu : renderMobileMenu}
      </nav>
    </header>
  );
};

const NavLink = ({ page, isDesktop }: { page: string; isDesktop: boolean }) => {
  const lowerCasePage = page.toLowerCase();

  const desktopLinkStyles =
    "inline-block rounded text-sm text-red-800 hover:text-rose-400 dark:text-pink";
  const mobileLinkStyles =
    "mt-2 block border-b border-b-gray-400 px-4 py-2 font-semibold text-flat-black sm:inline-block";

  return (
    <a
      className={isDesktop ? desktopLinkStyles : mobileLinkStyles}
      style={{ transition: "all 0.2s ease-in-out" }}
      href={`#${lowerCasePage}`}
    >
      {page}
    </a>
  );
};

export default Navbar;
