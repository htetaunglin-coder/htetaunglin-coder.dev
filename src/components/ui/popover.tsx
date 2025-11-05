"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import { buttonStyles } from "./button";
import type { ComponentSlots } from "./types";
import { createContext } from "./utils";

const popoverStyles = tv({
  slots: {
    base: "",
    trigger: "",
    close: buttonStyles({ variant: "ghost" }).base(),
    content: [
      "data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=open]:animate-in",
      "data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
      "z-50 w-full rounded-md border border-outline-secondary bg-bg-default-alt p-4 text-foreground shadow-md outline-none",
    ],
  },
});

export type PopoverlVariantProps = VariantProps<typeof popoverStyles>;
export type PopoverSlots = keyof ReturnType<typeof popoverStyles>;

export { popoverStyles };

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                               PopoverContext                               */
/* -------------------------------------------------------------------------- */

type PopoverBaseProps = ComponentSlots<PopoverSlots>;

type PopoverContextType = PopoverBaseProps & {
  styles: ReturnType<typeof popoverStyles>;
};

const [PopoverProvider, usePopoverContext] = createContext<PopoverContextType>({
  name: "PopoverContext",
  strict: true,
  errorMessage:
    "usePopoverContext: `context` is undefined. Seems you forgot to wrap component within <Popover />",
});

/* -------------------------------------------------------------------------- */
/*                                   Popover                                  */
/* -------------------------------------------------------------------------- */

export type PopoverProps = React.ComponentPropsWithoutRef<
  typeof RadixPopover.Root
> &
  PopoverBaseProps;

const Popover = ({ classNames, ...props }: PopoverProps) => {
  const styles = popoverStyles();

  return (
    <PopoverProvider value={{ styles, classNames }}>
      <RadixPopover.Root {...props} />
    </PopoverProvider>
  );
};

/* -------------------------------------------------------------------------- */
/*                               PopoverTrigger                               */
/* -------------------------------------------------------------------------- */

export type PopoverTriggerProps = React.ComponentPropsWithRef<
  typeof RadixPopover.Trigger
>;

const PopoverTrigger = ({ className, ...props }: PopoverTriggerProps) => {
  const { styles, classNames } = usePopoverContext();

  return (
    <RadixPopover.Trigger
      className={styles.trigger({
        className: cn(classNames?.trigger, className),
      })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                                PopoverClose                                */
/* -------------------------------------------------------------------------- */

export type PopoverCloseProps = React.ComponentPropsWithRef<
  typeof RadixPopover.Close
>;

const PopoverClose = ({ className, ...props }: PopoverCloseProps) => {
  const { styles, classNames } = usePopoverContext();

  return (
    <RadixPopover.Close
      className={styles.close({ className: cn(classNames?.close, className) })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                               PopoverContent                               */
/* -------------------------------------------------------------------------- */

type PopoverContentProps = React.ComponentPropsWithRef<
  typeof RadixPopover.Content
>;

const PopoverContent = ({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverContentProps) => {
  const { styles, classNames } = usePopoverContext();

  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        className={styles.content({
          className: cn(classNames?.content, className),
        })}
        side={side}
        sideOffset={sideOffset}
        {...props}
      />
    </RadixPopover.Portal>
  );
};

const PopoverArrow = RadixPopover.Arrow;

const PopoverAnchor = RadixPopover.Anchor;

export {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
};
