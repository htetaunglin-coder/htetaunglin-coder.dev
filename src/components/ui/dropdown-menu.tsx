"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentSlots } from "./types";
import { createContext } from "./utils";

const itemFocusClasses = ["focus:bg-bg-secondary"];

const commonContentClasses = [
  "z-50 min-w-32 overflow-hidden rounded-md border border-outline-default bg-bg-default-alt text-fg-default shadow-lg",
];

const commonItemClasses = [
  "relative flex cursor-default select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
];

const commonIconWrapperClasses =
  "absolute left-2 flex h-3.5 w-3.5 items-center justify-center";

const dropdownMenuStyles = tv({
  slots: {
    base: "",
    trigger: "",
    subTrigger:
      "flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm outline-none focus-visible:bg-bg-secondary data-[state=open]:bg-bg-secondary",
    subTriggerIcon: "pointer-events-none ml-auto size-4 shrink-0",
    subContent: [
      "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:animate-in",
      "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      ...commonContentClasses,
    ],
    content: [
      "data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=open]:animate-in",
      "data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
      "data-[side=bottom]:slide-in-from-bottom-6 data-[side=left]:slide-in-from-left-6 data-[side=right]:slide-in-from-right-6 data-[side=top]:slide-in-from-top-6",
      ...commonContentClasses,
      "duration-300",
    ],
    item: [
      ...itemFocusClasses,
      "data-disabled:pointer-events-none",
      "data-disabled:opacity-50",
      "relative flex h-9 cursor-default select-none items-center gap-2 px-2 text-sm outline-none transition-colors [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    ],
    checkboxItem: [
      ...itemFocusClasses,
      "data-disabled:pointer-events-none",
      "data-disabled:opacity-50",
      ...commonItemClasses,
    ],
    checkboxItemIconWrapper: commonIconWrapperClasses,
    checkboxItemIcon: "size-4",
    radioItem: [
      ...itemFocusClasses,
      "data-disabled:pointer-events-none",
      "data-disabled:opacity-50",
      ...commonItemClasses,
    ],
    radioItemIconWrapper: commonIconWrapperClasses,
    radioItemIcon: "size-2 fill-current",
    label: "px-2 py-1.5 font-semibold text-sm",
    separator: "-mx-1 my-1 h-px bg-bg-tertiary",
    shortcut: "ml-auto text-xs tracking-widest opacity-60",
  },
  variants: {
    inset: {
      true: {
        item: "pl-8",
        label: "pl-8",
        subTrigger: "pl-8",
      },
    },
  },
});

export type DropdownMenuVariantProps = VariantProps<typeof dropdownMenuStyles>;
export type DropdownMenuSlots = keyof ReturnType<typeof dropdownMenuStyles>;

export { dropdownMenuStyles };

/* -------------------------------------------------------------------------- */

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/* -------------------------------------------------------------------------- */
/*                             DropdownMenuContext                            */
/* -------------------------------------------------------------------------- */

type DropdownMenuBaseProps = ComponentSlots<DropdownMenuSlots>;

type DropdownContextType = DropdownMenuBaseProps & {
  styles: ReturnType<typeof dropdownMenuStyles>;
};

const [DropdownProvider, useDropdownContext] =
  createContext<DropdownContextType>({
    name: "DropdownContext",
    strict: true,
    errorMessage:
      "useDropdownContext: `context` is undefined. Seems you forgot to wrap component within <Dropdown />",
  });

/* -------------------------------------------------------------------------- */
/*                                DropdownMenu                                */
/* -------------------------------------------------------------------------- */

export type DropdownMenuProps = DropdownMenuPrimitive.DropdownMenuProps &
  DropdownMenuBaseProps;

const DropdownMenu = ({ classNames, ...props }: DropdownMenuProps) => {
  const styles = dropdownMenuStyles();

  return (
    <DropdownProvider value={{ styles, classNames }}>
      <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
    </DropdownProvider>
  );
};

/* -------------------------------------------------------------------------- */
/*                             DropdownMenuTrigger                            */
/* -------------------------------------------------------------------------- */

export type DropdownTriggerProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Trigger
>;

const DropdownMenuTrigger = ({ className, ...props }: DropdownTriggerProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.Trigger
      className={styles.trigger({
        className: cn(classNames?.trigger, className),
      })}
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                           DropdownMenuSubTrigger                           */
/* -------------------------------------------------------------------------- */

export type DropdownMenuSubTriggerProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.SubTrigger
      className={styles.subTrigger({
        className: cn(classNames?.subTrigger, className),
        inset,
      })}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon
        className={styles.subTriggerIcon({
          className: classNames?.subTriggerIcon,
        })}
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
};

/* -------------------------------------------------------------------------- */
/*                           DropdownMenuSubContent                           */
/* -------------------------------------------------------------------------- */

export type DropdownMenuSubContentProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.SubContent
>;

const DropdownMenuSubContent = ({
  className,
  ...props
}: DropdownMenuSubContentProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.SubContent
      className={styles.subContent({
        className: cn(classNames?.subContent, className),
      })}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                             DropdownMenuContent                            */
/* -------------------------------------------------------------------------- */

export type DropdownMenuContentProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Content
>;

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal">
      <DropdownMenuPrimitive.Content
        className={styles.content({
          className: cn(classNames?.content, className),
        })}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

/* -------------------------------------------------------------------------- */
/*                              DropdownMenuItem                              */
/* -------------------------------------------------------------------------- */

export type DropdownMenuItemProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Item
> & {
  inset?: boolean;
};

const DropdownMenuItem = ({
  className,
  inset,
  ...props
}: DropdownMenuItemProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.Item
      className={styles.item({
        className: cn(classNames?.item, className),
        inset,
      })}
      data-slot="dropdown-menu-item"
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                          DropdownMenuCheckboxItem                          */
/* -------------------------------------------------------------------------- */

export type DropdownMenuCheckboxItemProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: DropdownMenuCheckboxItemProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={styles.checkboxItem({
        className: cn(classNames?.checkboxItem, className),
      })}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span
        className={styles.checkboxItemIconWrapper({
          className: classNames?.checkboxItemIconWrapper,
        })}
      >
        <DropdownMenuPrimitive.ItemIndicator data-slot="dropdown-menu-item-indicator">
          <CheckIcon
            className={styles.checkboxItemIcon({
              className: classNames?.checkboxItemIcon,
            })}
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
};

/* -------------------------------------------------------------------------- */
/*                            DropdownMenuRadioItem                           */
/* -------------------------------------------------------------------------- */

export type DropdownMenuRadioItemProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.RadioItem
>;

const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.RadioItem
      className={styles.radioItem({
        className: cn(classNames?.radioItem, className),
      })}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span
        className={styles.radioItemIconWrapper({
          className: classNames?.radioItemIconWrapper,
        })}
      >
        <DropdownMenuPrimitive.ItemIndicator data-slot="dropdown-menu-item-indicator">
          <CircleIcon
            className={styles.radioItemIcon({
              className: classNames?.radioItemIcon,
            })}
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
};

/* -------------------------------------------------------------------------- */
/*                              DropdownMenuLabel                             */
/* -------------------------------------------------------------------------- */

type DropdownMenuLabelProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean;
};

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.Label
      className={styles.label({
        className: cn(classNames?.label, className),
        inset,
      })}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                            DropdownMenuSeparator                           */
/* -------------------------------------------------------------------------- */

export type DropdownMenuSeparatorProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Separator
>;

const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuSeparatorProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <DropdownMenuPrimitive.Separator
      className={styles.separator({
        className: cn(classNames?.separator, className),
      })}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                            DropdownMenuShortcut                            */
/* -------------------------------------------------------------------------- */

type DropdownMenuShortcutProps = React.ComponentPropsWithRef<"span">;

const DropdownMenuShortcut = ({
  className,
  ...props
}: DropdownMenuShortcutProps) => {
  const { styles, classNames } = useDropdownContext();

  return (
    <span
      className={styles.shortcut({
        className: cn(classNames?.shortcut, className),
      })}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  useDropdownContext,
};
