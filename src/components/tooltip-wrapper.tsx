"use client";

import {
  type TooltipContentProps,
  TooltipPortal,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import React from "react";

import { TooltipContent } from "./ui/tooltip";

type TooltipOptions = Pick<
  TooltipContentProps,
  | "side"
  | "align"
  | "sideOffset"
  | "alignOffset"
  | "avoidCollisions"
  | "collisionBoundary"
  | "collisionPadding"
>;

type TooltipProps = {
  portal?: boolean;
  content: React.ReactNode;
  children: React.ReactNode;
  options?: TooltipOptions;
  asChild?: boolean;
};

const Tooltip = ({
  children,
  content,
  portal = false,
  options,
  asChild = true,
  ...triggerProps
}: TooltipProps) => {
  const Wrapper = portal ? TooltipPortal : React.Fragment;

  return (
    <TooltipRoot>
      <TooltipTrigger asChild={asChild} {...triggerProps}>
        {children}
      </TooltipTrigger>
      <Wrapper>
        <TooltipContent align={"center"} side={"bottom"} {...options}>
          {content}
        </TooltipContent>
      </Wrapper>
    </TooltipRoot>
  );
};

export { Tooltip };
