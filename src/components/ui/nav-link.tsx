"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { cn } from "@/lib/utils";

const PROTOCOL_REGEX = /^https?:\/\//;

interface NavLinkProps extends React.ComponentProps<typeof Link> {
  matchPrefix?: boolean;
}

const NavLink = ({
  href,
  className,
  matchPrefix = false,
  ...props
}: NavLinkProps) => {
  const pathname = usePathname();
  const isExternal = PROTOCOL_REGEX.test(href.toString());

  const isActive = matchPrefix
    ? pathname.startsWith(href.toString())
    : pathname === href;

  return (
    <Link
      className={cn(className, isExternal && "new_tab_cursor")}
      data-state={isActive ? "active" : "inactive"}
      href={href}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : "_self"}
      {...props}
    />
  );
};

export { NavLink };
