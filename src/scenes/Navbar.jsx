import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import useMediaQuery from "../hooks/useMediaQuery";
import { Link } from "react-router-dom";
import { FaRegFileLines, FaBars } from "react-icons/fa6";
import ToggleTheme from "../components/ToggleTheme";

const MobileNavLink = ({ page, setState }) => {
  const lowerCasePage = page.toLowerCase();
  return (
    <a
      className="block sm:inline-block border-b border-b-gray-400 py-2 px-4 font-semibold font-dmSans mt-2"
      style={{ transition: "all 0.5s ease-in-out" }}
      href={`#${lowerCasePage}`}
      onClick={() => setState((prev) => !prev)}>
      {page}
    </a>
  );
};

const DesktopNavLink = ({ page }) => {
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

  window.addEventListener("scroll", toggleActive);

  return (
    <header
      className={`z-50 w-full fixed top-0 ${
        isNavbarActive
          ? "bg-gray-300/90 dark:bg-flat-black/70 shadow-lg shadow-black/10"
          : ""
      }`}>
      {/* overlay */}
      {isMenuToggled && (
        <div className="absolute w-full h-screen bg-flat-black opacity-80"></div>
      )}

      <div className="flex items-center justify-between mx-auto w-5/6 py-3 sm:py-5 gap-2">
        <Link
          to="/"
          className="font-serif text-xl xs:text-2xl sm:text-3xl text-dark-pink dark:text-pink">
          HTLA
        </Link>

        {/* DESKTOP NAV */}
        {isDesktop ? (
          <nav className="flex justify-between gap-12 md:gap-20 font-dmSans text-sm text-red-800 dark:text-pink">
            <DesktopNavLink page="Home" />
            <DesktopNavLink page="About Me" />
            <DesktopNavLink page="Skills" />
            <DesktopNavLink page="Project" />
            <DesktopNavLink page="Contact" />
            <ToggleTheme
              className={"md:hidden text-gray-800 dark:text-gray-300 text-lg"}
            />
          </nav>
        ) : (
          // mobile nav
          <div className="flex items-center">
            <ToggleTheme
              className={"text-gray-800 dark:text-gray-300 mr-2 text-sm"}
            />
            <Link
              className="text-gray-300 mr-2 flex gap-1 items-center bg-gray-800 py-1 px-1 xs:px-2 rounded-sm"
              to="/resume">
              <FaRegFileLines size={20} />
              <p className="text-xs font-righteous tracking-widest">Resume</p>
            </Link>
            <Link
              to="/projects"
              className="text-flat-black mr-2 flex gap-1 items-center bg-pink py-1 px-1 xs:px-2 rounded-sm">
              <p className="text-xs tracking-wide font-bold uppercase font-righteous">
                Projects
              </p>
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
            className="fixed
               bottom-0 h-full bg-white text-flat-black w-1/2">
            {/* CLOSE ICON */}
            <div className="flex justify-end pt-5 px-5">
              <button
                className="text-black text-2xl mb-5 mr-4"
                onClick={() => setIsMenuToggled(!isMenuToggled)}>
                <FaTimes />
              </button>
            </div>

            {/* MENU ITEMS */}
            <nav className="text-flat-black px-2 mt-10">
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
