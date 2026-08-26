"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentSlots } from "./types";

const radioGroupStyles = tv({
  slots: {
    base: "grid gap-1.5",
  },
  variants: {
    columns: {
      1: { base: "grid-cols-1" },
      2: { base: "grid-cols-1 sm:grid-cols-2" },
      3: { base: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" },
      4: { base: "grid-cols-2 sm:grid-cols-4" },
    },
  },
  defaultVariants: {
    columns: 1,
  },
});

const radioGroupCardStyles = tv({
  slots: {
    base: [
      "relative flex w-full cursor-pointer flex-col items-start gap-1 rounded-sm border bg-bg-default-alt p-3 pr-9 text-left shadow-xs outline-none duration-300 ease-in-out",
      "hover:bg-bg-accent",

      "focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=checked]:border-outline-brand data-[state=checked]:bg-bg-accent data-[state=checked]:ring-1 data-[state=checked]:ring-outline-brand data-[state=checked]:ring-inset",
    ],
    label: "font-medium text-fg-default text-sm",
    description: "text-fg-tertiary text-xs leading-relaxed",
    indicator: "absolute top-3 right-3 text-outline-brand",
    media: "w-full overflow-hidden rounded-xs",
  },
  variants: {
    variant: {
      card: {},

      tile: {
        base: "relative aspect-4/3 overflow-hidden p-0 pr-0",
        label: "absolute inset-x-3 top-3 z-10",
        description: "absolute inset-x-3 bottom-3 z-10 line-clamp-2",
        indicator: "z-10 rounded-full bg-bg-default-alt/85 p-0.5",
      },

      media: {
        base: "group gap-1.5 p-2 pr-2",
        label: "min-w-0 pr-5",
        indicator: "top-auto right-2 bottom-2",
      },
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

/** The card's three selection signals, at chip scale. Same reasoning applies. */
const radioGroupChipStyles = tv({
  slots: {
    base: [
      "relative inline-flex cursor-pointer items-center gap-1.5 rounded-sm border bg-bg-default-alt px-3 py-1.5 text-left font-medium text-fg-secondary text-sm outline-none duration-300 ease-in-out",
      "hover:bg-bg-accent hover:text-fg-default",
      "focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=checked]:border-outline-brand data-[state=checked]:bg-bg-accent data-[state=checked]:text-fg-default data-[state=checked]:ring-1 data-[state=checked]:ring-outline-brand data-[state=checked]:ring-inset",
    ],
    indicator: "text-fg-brand",
  },
});

export type RadioGroupVariantProps = VariantProps<typeof radioGroupStyles>;
export type RadioGroupCardVariantProps = VariantProps<
  typeof radioGroupCardStyles
>;
export type RadioGroupSlots = keyof ReturnType<typeof radioGroupStyles>;
export type RadioGroupCardSlots = keyof ReturnType<typeof radioGroupCardStyles>;
export type RadioGroupChipSlots = keyof ReturnType<typeof radioGroupChipStyles>;

export { radioGroupCardStyles, radioGroupChipStyles, radioGroupStyles };

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
  RadioGroupCardVariantProps &
  Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children"> & {
    label: React.ReactNode;
    description?: React.ReactNode;
    /** Rendered above the label, unlike `children`, which follows it. */
    media?: React.ReactNode;
    children?: React.ReactNode;
  };

const RadioGroupCard = ({
  className,
  classNames,
  label,
  description,
  media,
  variant,
  children,
  ...props
}: RadioGroupCardProps) => {
  const {
    base,
    label: labelStyle,
    description: descriptionStyle,
    indicator,
    media: mediaStyle,
  } = radioGroupCardStyles({ variant });

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
      {media && (
        <span className={mediaStyle({ className: classNames?.media })}>
          {media}
        </span>
      )}
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

export type RadioGroupChipProps = ComponentSlots<RadioGroupChipSlots> &
  Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children"> & {
    label: React.ReactNode;
  };

const RadioGroupChip = ({
  className,
  classNames,
  label,
  ...props
}: RadioGroupChipProps) => {
  const { base, indicator } = radioGroupChipStyles();

  return (
    <RadioGroupPrimitive.Item
      className={base({ className: cn(classNames?.base, className) })}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={indicator({ className: classNames?.indicator })}
      >
        <Check className="size-3.5" />
      </RadioGroupPrimitive.Indicator>
      {label}
    </RadioGroupPrimitive.Item>
  );
};

export { RadioGroup, RadioGroupCard, RadioGroupChip };
