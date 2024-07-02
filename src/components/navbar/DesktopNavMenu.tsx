import React from "react";

import cn from "classnames";

import ToggleTheme from "../toggletheme/ToggleTheme";

interface DesktopNavMenuInterface {
  navLinkItems: Array<string>;
}

const DesktopNavMenu: React.FC<DesktopNavMenuInterface> = ({
  navLinkItems,
}) => {
  return (
    <div className="hidden justify-between gap-12 sm:flex md:gap-20">
      {navLinkItems.map((item) => (
        <DesktopNavLink
          key={`desktop-${item}`}
          href={item.toLocaleLowerCase()}
          content={item}
        />
      ))}
      <ToggleTheme
        className={"text-lg text-gray-800 dark:text-gray-300 md:hidden"}
      />
    </div>
  );
};

interface DesktopNavMenuLinkProps {
  href: string;
  content: string;
  className?: string;
}

const DesktopNavLink: React.FC<DesktopNavMenuLinkProps> = ({
  href,
  content,
  className,
}) => (
  <a
    className={cn(
      "inline-block rounded text-sm text-red-800 hover:text-rose-400 dark:text-pink",
      className,
    )}
    style={{ transition: "all 0.2s ease-in-out" }}
    href={href}
  >
    {content}
  </a>
);

export default DesktopNavMenu;
