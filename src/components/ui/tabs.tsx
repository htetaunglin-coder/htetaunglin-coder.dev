"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { createContext, use } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentSlots } from "./types";

const tabsStyles = tv({
  slots: {
    base: "flex flex-col gap-4",
    list: "inline-flex w-fit items-center justify-center",
    trigger: [
      "relative inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium text-fg-tertiary text-sm outline-none duration-300 ease-in-out",
      "hover:text-fg-default",
      "focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
      "disabled:pointer-events-none disabled:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    ],
    content: "outline-none",
  },
  variants: {
    variant: {
      default: {
        /* Concentric: trigger radius is the list's minus its padding, 6 - 4 = 2. */
        list: "gap-1 rounded-sm bg-bg-secondary p-1",
        trigger: [
          "rounded-2xs px-3 py-1.5",
          "data-[state=active]:bg-bg-default-alt data-[state=active]:text-fg-default data-[state=active]:shadow-xs",
        ],
      },
      line: {
        list: "w-full justify-start gap-5 border-outline-default border-b",
        trigger: [
          "px-0 pb-2 data-[state=active]:text-fg-default",
          // The rule sits on the list's own border, so the active tab reads as
          // attached to its panel rather than floating above it.
          "after:-bottom-px after:absolute after:inset-x-0 after:h-0.5 after:bg-fg-brand after:opacity-0 after:duration-300 after:ease-in-out",
          "data-[state=active]:after:opacity-100",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type TabsVariantProps = VariantProps<typeof tabsStyles>;
export type TabsSlots = keyof ReturnType<typeof tabsStyles>;

export { tabsStyles };

/* -------------------------------------------------------------------------- */

// The list and the trigger are styled by a variant chosen on the root, and
// Radix renders them as separate siblings. Context beats making every call site
// repeat the variant on each trigger.
const TabsVariantContext =
  createContext<TabsVariantProps["variant"]>("default");

export type TabsProps = ComponentSlots<TabsSlots> &
  React.ComponentProps<typeof TabsPrimitive.Root> &
  TabsVariantProps;

const Tabs = ({ className, classNames, variant, ...props }: TabsProps) => {
  const { base } = tabsStyles({ variant });

  return (
    <TabsVariantContext value={variant}>
      <TabsPrimitive.Root
        className={base({ className: cn(classNames?.base, className) })}
        {...props}
      />
    </TabsVariantContext>
  );
};

export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;

const TabsList = ({ className, ...props }: TabsListProps) => {
  const { list } = tabsStyles({ variant: use(TabsVariantContext) });

  return <TabsPrimitive.List className={list({ className })} {...props} />;
};

export type TabsTriggerProps = React.ComponentProps<
  typeof TabsPrimitive.Trigger
>;

const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => {
  const { trigger } = tabsStyles({ variant: use(TabsVariantContext) });

  return (
    <TabsPrimitive.Trigger className={trigger({ className })} {...props} />
  );
};

export type TabsContentProps = React.ComponentProps<
  typeof TabsPrimitive.Content
>;

const TabsContent = ({ className, ...props }: TabsContentProps) => {
  const { content } = tabsStyles();

  return (
    <TabsPrimitive.Content className={content({ className })} {...props} />
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
