"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { FaRegFileLines, FaBars } from "react-icons/fa6";

import useMediaQuery from "@/hooks/useMediaQuery";
import ToggleTheme from "./ToggleTheme";

const MobileNavLink = ({
  page,
  setState,
}: {
  page: string;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const lowerCasePage = page.toLowerCase();
  return (
    <a
      className="block px-4 py-2 mt-2 font-semibold border-b sm:inline-block border-b-gray-400 font-dmSans"
      style={{ transition: "all 0.5s ease-in-out" }}
      href={`#${lowerCasePage}`}
      onClick={() => setState((prev) => !prev)}>
      {page}
    </a>
  );
};

const DesktopNavLink = ({ page }: { page: string }) => {
  const lowerCasePage = page.toLowerCase();
  return (
    <a
      className="inline-block rounded hover:text-rose-400"
      style={{ transition: "all 0.2s ease-in-out" }}
      href={`#${lowerCasePage}`}>
      {page}
    </a>
  );
};

const Navbar = () => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 48rem)");
  const [isNavbarActive, setIsNavbarActive] = useState(false);

  const toggleActive = () => {
    window.scrollY >= 100 ? setIsNavbarActive(true) : setIsNavbarActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleActive);
  }, []);

  return (
    <header
      className={`z-50 w-full fixed top-0 ${
        isNavbarActive ? "bg-gray-300/90 dark:bg-flat-black/70 shadow-lg shadow-black/10" : ""
      }`}>
      {/* overlay */}
      {isMenuToggled && <div className="absolute w-full h-screen bg-flat-black opacity-80"></div>}

      <div className="flex items-center justify-between w-5/6 gap-2 py-3 mx-auto sm:py-5">
        <Link href="/" className="font-serif text-xl xs:text-2xl sm:text-3xl text-dark-pink dark:text-pink">
          HTLA
        </Link>

        {/* DESKTOP NAV */}
        {isDesktop ? (
          <nav className="flex justify-between gap-12 text-sm text-red-800 md:gap-20 font-dmSans dark:text-pink">
            <DesktopNavLink page="Home" />
            <DesktopNavLink page="About Me" />
            <DesktopNavLink page="Skills" />
            <DesktopNavLink page="Project" />
            <DesktopNavLink page="Contact" />
            <ToggleTheme className={"md:hidden text-gray-800 dark:text-gray-300 text-lg"} />
          </nav>
        ) : (
          // mobile nav
          <div className="flex items-center">
            <ToggleTheme className={"text-gray-800 dark:text-gray-300 mr-2 text-sm"} />
            <Link
              className="flex items-center gap-1 px-1 py-1 mr-2 text-gray-300 bg-gray-800 rounded-sm xs:px-2"
              href="/resume">
              <FaRegFileLines size={20} />
              <p className="text-xs tracking-widest font-righteous">Resume</p>
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-1 px-1 py-1 mr-2 rounded-sm text-flat-black bg-pink xs:px-2">
              <p className="text-xs font-bold tracking-wide uppercase font-righteous">Projects</p>
            </Link>
            <button
              className="rounded-full border border-gray-800 dark:border-gray-300 p-[5px] text-gray-800 dark:text-gray-300"
              onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <FaBars />
            </button>
          </div>
        )}

        {/* MOBILE MENU POPUP */}
        {!isDesktop && (
          <div
            style={{
              right: isMenuToggled ? "0px" : "-100%",
              transition: "right 0.5s 0.1s ease-in-out",
            }}
            className="fixed bottom-0 w-1/2 h-full bg-white text-flat-black">
            {/* CLOSE ICON */}
            <div className="flex justify-end px-5 pt-5">
              <button className="mb-5 mr-4 text-2xl text-black" onClick={() => setIsMenuToggled(!isMenuToggled)}>
                <FaTimes />
              </button>
            </div>

            {/* MENU ITEMS */}
            <nav className="px-2 mt-10 text-flat-black">
              <MobileNavLink page="Home" setState={setIsMenuToggled} />
              <MobileNavLink page="About Me" setState={setIsMenuToggled} />
              <MobileNavLink page="Skills" setState={setIsMenuToggled} />
              <MobileNavLink page="Project" setState={setIsMenuToggled} />
              <MobileNavLink page="Contact" setState={setIsMenuToggled} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
