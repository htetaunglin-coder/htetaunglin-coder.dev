"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { tv, type VariantProps } from "tailwind-variants";

import type { ComponentSlots } from "./types";

const labelStyles = tv({
  slots: {
    base: "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  },
});

export type LabelVariantProps = VariantProps<typeof labelStyles>;
export type LabelSlots = keyof ReturnType<typeof labelStyles>;
export { labelStyles };

/* -------------------------------------------------------------------------- */

type LabelBaseProps = ComponentSlots<LabelSlots> &
  React.ComponentProps<"label">;

export type LabelProps = LabelBaseProps & LabelVariantProps;

const Label = ({ className, ...props }: LabelProps) => {
  const { base } = labelStyles();

  return <LabelPrimitive.Root className={base({ className })} {...props} />;
};

export { Label };
