"use client";

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import { Label } from "./label";
import type { ComponentSlots } from "./types";

const labelClasses = [
  "peer-focus:bg-bg-default peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:start-2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
];

const labelWithIconClasses = [
  "rtl:left bg-bg-default -translate-y-4 scale-75 rtl:translate-x-1/4",
];

const inputStyles = tv({
  slots: {
    wrapper: "relative w-full",
    startIcon:
      "-translate-y-1/2 absolute top-1/2 left-2 transform [&>svg]:size-5 [&>svg]:text-fg-tertiary",
    endIcon:
      "-translate-y-1/2 absolute top-1/2 right-3.5 transform [&>svg]:size-5 [&>svg]:text-fg-tertiary",
    base: [
      "peer",
      "flex h-10 w-full bg-bg-default-alt px-3 py-2 text-sm",
      "placeholder:text-fg-tertiary",
      "transition duration-300 file:border-0 file:bg-bg-default-alt file:font-medium file:text-sm",
    ],
    label: [
      "-translate-y-4 absolute start-2 top-2 z-10 max-w-fit origin-[0] scale-75 cursor-text bg-bg-default-alt px-2 text-fg-tertiary text-sm duration-300",
    ],
  },
  variants: {
    variant: {
      default: {
        base: [
          "rounded-md border",
          "focus-visible:border-outline-brand",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-outline-brand",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-bg-default",
        ],
      },
      underline: {
        base: "border-b outline-none focus-visible:border-b-outline-default",
      },
      danger: {
        base: [
          "rounded-md border border-outline-danger",
          "focus-visible:border-outline-danger",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-outline-danger",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-bg-default",
        ],
      },
    },
    disabled: {
      true: {
        wrapper: "pointer-events-none cursor-not-allowed opacity-50",
      },
    },
    startIcon: {
      true: {
        label: labelWithIconClasses,
        base: "pl-8",
      },
    },
    endIcon: {
      true: {
        label: labelWithIconClasses,
        base: "pr-8",
      },
    },
  },
  compoundVariants: [
    {
      startIcon: false,
      endIcon: false,
      class: {
        label: labelClasses,
      },
    },
  ],
  defaultVariants: {
    variant: "default",
  },
});

export type InputVariantProps = VariantProps<typeof inputStyles>;
export type InputSlots = keyof ReturnType<typeof inputStyles>;

export { inputStyles };

/* -------------------------------------------------------------------------- */

type InputBaseProps = ComponentSlots<InputSlots> &
  React.ComponentPropsWithRef<"input"> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    label?: React.ReactNode;
  };

export type InputProps = InputBaseProps &
  Omit<InputVariantProps, "startIcon" | "endIcon">;

const Input = ({
  variant,
  className,
  classNames,
  type,
  startIcon,
  endIcon,
  label,
  id: userId,
  disabled,
  ...props
}: InputProps) => {
  const {
    wrapper,
    base,
    startIcon: startIconStyle,
    endIcon: endIconStyle,
    label: labelStyles,
  } = inputStyles({
    variant,
    disabled,
    startIcon: !!startIcon,
    endIcon: !!endIcon,
  });
  const id = React.useId();

  return (
    <div
      className={wrapper({
        className: classNames?.wrapper,
      })}
    >
      {startIcon && (
        <div className={startIconStyle({ className: classNames?.startIcon })}>
          {startIcon}
        </div>
      )}
      <input
        className={base({ className: cn(classNames?.base, className) })}
        disabled={disabled}
        id={userId || id}
        placeholder=""
        // Adding an empty space by default ensures the floating label moves correctly on focus or when input is present.
        type={type}
        {...props}
      />

      {label && (
        <Label
          className={labelStyles({ className: classNames?.label })}
          htmlFor={userId || id}
        >
          {label}
        </Label>
      )}

      {endIcon && (
        <div className={endIconStyle({ className: classNames?.endIcon })}>
          {endIcon}
        </div>
      )}
    </div>
  );
};

Input.displayName = "Input";

export { Input };
