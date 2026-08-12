"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentSlots } from "./types";

const radioGroupStyles = tv({
  slots: {
    base: "grid gap-2",
  },
  variants: {
    columns: {
      1: { base: "grid-cols-1" },
      2: { base: "grid-cols-1 sm:grid-cols-2" },
      3: { base: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" },
    },
  },
  defaultVariants: {
    columns: 1,
  },
});

/**
 * Selection is marked three ways on purpose: colour alone fails WCAG 1.4.1, and
 * `outline-brand` measured 2.35:1 against the checked fill, under 1.4.11's 3:1.
 * Hence `fg-brand` (7.35:1 light, 4.90:1 dark), a tinted fill, and a glyph.
 */
const radioGroupCardStyles = tv({
  slots: {
    base: [
      "relative flex w-full cursor-pointer flex-col items-start gap-1 rounded-md border bg-bg-default-alt p-3 pr-9 text-left shadow-xs outline-none duration-300 ease-in-out",
      "hover:bg-bg-accent",
      // Ring, not border: focus has to stay tellable apart from checked.
      "focus-visible:ring-2 focus-visible:ring-fg-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=checked]:border-fg-brand data-[state=checked]:bg-bg-accent data-[state=checked]:ring-1 data-[state=checked]:ring-fg-brand data-[state=checked]:ring-inset",
    ],
    label: "font-medium text-fg-default text-sm",
    description: "text-fg-tertiary text-xs leading-relaxed",
    indicator: "absolute top-3 right-3 text-fg-brand",
  },
});

export type RadioGroupVariantProps = VariantProps<typeof radioGroupStyles>;
export type RadioGroupSlots = keyof ReturnType<typeof radioGroupStyles>;
export type RadioGroupCardSlots = keyof ReturnType<typeof radioGroupCardStyles>;

export { radioGroupCardStyles, radioGroupStyles };

/* -------------------------------------------------------------------------- */

export type RadioGroupProps = ComponentSlots<RadioGroupSlots> &
  React.ComponentProps<typeof RadioGroupPrimitive.Root> &
  RadioGroupVariantProps;

const RadioGroup = ({
  className,
  classNames,
  columns,
  ...props
}: RadioGroupProps) => {
  const { base } = radioGroupStyles({ columns });

  return (
    <RadioGroupPrimitive.Root
      className={base({ className: cn(classNames?.base, className) })}
      {...props}
    />
  );
};

export type RadioGroupCardProps = ComponentSlots<RadioGroupCardSlots> &
  Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children"> & {
    label: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
  };

const RadioGroupCard = ({
  className,
  classNames,
  label,
  description,
  children,
  ...props
}: RadioGroupCardProps) => {
  const {
    base,
    label: labelStyle,
    description: descriptionStyle,
    indicator,
  } = radioGroupCardStyles();

  return (
    <RadioGroupPrimitive.Item
      className={base({ className: cn(classNames?.base, className) })}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={indicator({ className: classNames?.indicator })}
      >
        <Check className="size-4" />
      </RadioGroupPrimitive.Indicator>
      <span className={labelStyle({ className: classNames?.label })}>
        {label}
      </span>
      {description && (
        <span
          className={descriptionStyle({ className: classNames?.description })}
        >
          {description}
        </span>
      )}
      {children}
    </RadioGroupPrimitive.Item>
  );
};

export { RadioGroup, RadioGroupCard };
