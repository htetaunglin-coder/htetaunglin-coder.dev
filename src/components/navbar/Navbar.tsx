import Link from "next/link";

import DesktopNavMenu from "./DesktopNavMenu";
import MobileNavMenu from "./MobileNavMenu";

// =========================================================

const NAV_LINK_ITEMS = ["Home", "About Me", "Skills", "Project", "Contact"];

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-gray-300/70 font-dmSans backdrop-blur-sm dark:bg-flat-black/70">
      <div className="h-6 w-full bg-gray-400/50 dark:bg-neutral-800/50">
        <div className="mx-auto flex h-full w-5/6 items-center justify-center">
          <h5 className="text-xs font-medium">
            V2 Coming Soon! 👀 Please consider starring this repository to stay
            updated.{" "}
            <a
              href="https://github.com/HTLA380/Personal_Portfolio.git"
              target="_blank"
              rel="noopener noreferrer"
              className="underline">
              HTLA380/Personal_Portfolio.git
            </a>
          </h5>
        </div>
      </div>
      <nav className="mx-auto flex w-5/6 items-center justify-between gap-2 py-3 sm:py-5">
        <Logo content="HTLA" />
        <MobileNavMenu navLinkItems={NAV_LINK_ITEMS} />
        <DesktopNavMenu navLinkItems={NAV_LINK_ITEMS} />
      </nav>
    </header>
  );
};

const Logo = ({ content }: { content: string }) => (
  <Link
    href="/"
    className="font-serif text-xl text-dark-pink dark:text-pink xs:text-2xl sm:text-3xl">
    {content}
  </Link>
);

export default Navbar;
