"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

import { cn } from "@/lib/utils";

const PROTOCOL_REGEX = /^https?:\/\//;

const NavLink = ({
  href,
  className,
  ...props
}: React.ComponentProps<typeof Link>) => {
  const pathname = usePathname();
  const isExternal = PROTOCOL_REGEX.test(href.toString());

  return (
    <Link
      className={cn(className, isExternal && "new_tab_cursor")}
      data-state={pathname === href ? "active" : "inactive"}
      href={href}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : "_self"}
      {...props}
    />
  );
};

export { NavLink };

//
