import { Slot, Slottable } from "@radix-ui/react-slot";
import { LoaderCircleIcon } from "lucide-react";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentSlots } from "./types";

const buttonStyles = tv({
  slots: {
    base: "inline-flex cursor-pointer items-center justify-center gap-0.5 font-medium text-sm outline-none duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default disabled:pointer-events-none disabled:opacity-50",
    icon: "size-5 animate-spin text-current",
  },
  variants: {
    variant: {
      default:
        "border bg-bg-default-alt text-fg-default shadow-xs hover:bg-bg-accent focus-visible:ring-outline-brand focus-visible:ring-offset-2 active:bg-bg-accent/70",
      secondary:
        "bg-bg-secondary text-fg-secondary shadow-xs hover:bg-bg-accent focus-visible:ring-outline-brand focus-visible:ring-offset-2 active:bg-bg-accent/70",
      outlined:
        "border bg-transparent text-fg-default shadow-xs hover:bg-bg-accent focus-visible:ring-outline-brand focus-visible:ring-offset-2 active:bg-bg-accent/70",
      brand:
        "bg-bg-brand text-on-bg-brand shadow-xs hover:bg-bg-brand/80 focus-visible:ring-outline-brand active:bg-bg-brand/70",
      danger:
        "bg-bg-danger text-on-bg-danger shadow-xs hover:bg-bg-danger/80 focus-visible:ring-outline-danger active:bg-bg-danger/70",
      ghost:
        "text-fg-default hover:bg-bg-accent focus-visible:ring-outline-brand focus-visible:ring-offset-2 active:bg-bg-accent/70",
      inverse:
        "bg-bg-inverse text-fg-inverse shadow-xs hover:bg-bg-inverse/80 focus-visible:ring-outline-inverse active:bg-bg-inverse/70",
    },
    size: {
      sm: "h-8 rounded-md px-3",
      md: "h-9 rounded-md px-3",
      lg: "h-12 rounded-lg px-4",
    },
    iconOnly: {
      true: "gap-0 px-0",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    iconOnly: false,
  },
  compoundVariants: [
    {
      iconOnly: true,
      size: "sm",
      class: {
        base: "size-8",
      },
    },
    {
      iconOnly: true,
      size: "md",
      class: {
        base: "size-9",
      },
    },
    {
      iconOnly: true,
      size: "lg",
      class: {
        base: "size-12",
      },
    },
  ],
});

export type ButtonVariantProps = VariantProps<typeof buttonStyles>;
export type ButtonSlots = keyof ReturnType<typeof buttonStyles>;
export { buttonStyles };

/* -------------------------------------------------------------------------- */

export type ButtonBaseProps = ComponentSlots<ButtonSlots> &
  React.ComponentPropsWithRef<"button"> & {
    asChild?: boolean;
    loading?: boolean;
  };

export type ButtonProps = ButtonBaseProps & ButtonVariantProps;

const Button = ({
  className,
  classNames,
  variant,
  size,
  iconOnly,
  loading,
  disabled,
  asChild = false,
  children,
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : "button";
  const { base, icon } = buttonStyles({ variant, size, iconOnly });

  return (
    <Component
      className={base({ className: cn(classNames?.base, className) })}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <LoaderCircleIcon className={icon({ className: classNames?.icon })} />
      )}
      <Slottable>{loading ? "Loading..." : children}</Slottable>
    </Component>
  );
};

export { Button };
