import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeStyles = tv({
  slots: {
    base: "flex items-center gap-1 px-1.5 py-1 font-semibold text-xs outline-none duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default disabled:pointer-events-none disabled:opacity-50",
  },
  variants: {
    variant: {
      default:
        "border border-outline-default bg-bg-default-alt text-fg-default shadow-xs hover:bg-bg-default-alt/80 focus-visible:ring-outline-brand active:bg-bg-default-alt/70",
      "default-subtle":
        "border border-outline-default bg-bg-secondary text-fg-default shadow-xs hover:bg-bg-secondary/80 focus-visible:ring-outline-brand active:bg-bg-secondary/70",
      brand:
        "bg-bg-brand text-on-bg-brand hover:bg-bg-brand/80 focus-visible:ring-outline-brand active:bg-bg-brand/70",
      "brand-subtle":
        "border border-outline-brand-subtle bg-bg-brand-subtle text-on-bg-brand-subtle hover:bg-bg-brand-subtle/80 focus-visible:ring-outline-brand-subtle active:bg-bg-brand-subtle/70",
      secondary:
        "bg-bg-secondary text-on-bg-secondary hover:bg-bg-secondary/80 focus-visible:ring-outline-secondary active:bg-bg-secondary/70",
      success:
        "bg-bg-success text-on-bg-success hover:bg-bg-success/80 focus-visible:ring-outline-success active:bg-bg-success/70",
      "success-subtle":
        "border border-outline-success-subtle bg-bg-success-subtle text-on-bg-success-subtle hover:bg-bg-success-subtle/80 focus-visible:ring-outline-success-subtle active:bg-bg-success-subtle/70",
      warning:
        "bg-bg-warning text-on-bg-warning hover:bg-bg-warning/80 focus-visible:ring-outline-warning active:bg-bg-warning/70",
      "warning-subtle":
        "border border-outline-warning-subtle bg-bg-warning-subtle text-on-bg-warning-subtle hover:bg-bg-warning-subtle/80 focus-visible:ring-outline-warning-subtle active:bg-bg-warning-subtle/70",
      danger:
        "bg-bg-danger text-on-bg-danger hover:bg-bg-danger/80 focus-visible:ring-outline-danger active:bg-bg-danger/70",
      "danger-subtle":
        "border border-outline-danger-subtle bg-bg-danger-subtle text-on-bg-danger-subtle hover:bg-bg-danger-subtle/80 focus-visible:ring-outline-danger-subtle active:bg-bg-danger-subtle/70",
    },
    radius: {
      default: "rounded-sm",
      full: "rounded-full",
    },
  },

  defaultVariants: {
    size: "md",
    variant: "default",
    radius: "default",
  },
});

export type BadgeVariantsProps = VariantProps<typeof badgeStyles>;
export type BadgeSlots = keyof ReturnType<typeof badgeStyles>;

export { badgeStyles };

/* -------------------------------------------------------------------------- */

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  BadgeVariantsProps;

const Badge = ({ className, variant, radius, ...props }: BadgeProps) => {
  const styles = badgeStyles({ variant, radius });

  return <div className={styles.base({ className })} {...props} />;
};

export { Badge };
