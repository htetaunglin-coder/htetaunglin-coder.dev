"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { SOCIAL_LINKS } from "@/constants/social-links";
import { Signature } from "./icons/signature";
import { Tooltip } from "./tooltip-wrapper";
import { Button } from "./ui/button";
import { NavLink } from "./ui/nav-link";

const Footer = () => (
  <footer className="flex w-full justify-center px-6 pb-8">
    <div className="flex w-full max-w-4xl justify-between">
      <div className="flex w-full flex-col justify-between py-12 text-center sm:flex-row sm:text-start">
        <div className="space-y-1.5">
          <p className="text-fg-tertiary text-sm">
            Designed and Built By{" "}
            <NavLink
              className="font-medium text-fg-brand underline hover:text-fg-brand/80"
              href={"https://www.linkedin.com/in/htetaunglin-coder"}
            >
              Htet Aung Lin
            </NavLink>
          </p>
          <FooterSignature />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 sm:justify-start">
            {SOCIAL_LINKS.map((link) => (
              <Tooltip asChild={false} content={link.title} key={link.id}>
                <Button
                  asChild
                  className="text-fg-tertiary text-lg"
                  iconOnly
                  variant="ghost"
                >
                  <NavLink href={link.href}>
                    <link.icon />
                  </NavLink>
                </Button>
              </Tooltip>
            ))}
          </div>

          <p className="text-fg-tertiary/70 text-sm">
            Source code available on{" "}
            <span className="font-medium text-fg-tertiary underline">
              Github
            </span>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export { Footer };

const FooterSignature = () => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-80px",
  });

  return (
    <NavLink
      className="inline-block h-12 w-20 text-fg-brand"
      href={"/"}
      ref={ref}
    >
      {isInView && <Signature animate />}
    </NavLink>
  );
};
