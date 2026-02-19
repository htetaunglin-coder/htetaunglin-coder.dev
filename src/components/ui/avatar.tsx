"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentSlots } from "./types";
import { createContext } from "./utils";

const avatarGroupStyles = tv({
  slots: {
    group: "-space-x-2 flex items-center justify-center",
    groupRemainChildren:
      "!ml-1.5 flex items-center justify-center text-fg-secondary text-xs",
  },
});

const avatarStyles = tv({
  slots: {
    base: "relative flex shrink-0 items-center justify-center",
    image: "aspect-square size-full rounded-full object-cover",
    fallback:
      "flex size-full items-center justify-center rounded-full border border-outline-brand-subtle bg-bg-brand-subtle font-medium text-on-bg-brand-subtle leading-none",
  },
  variants: {
    size: {
      xl: "size-20 text-3xl",
      lg: "size-16 text-2xl",
      md: "size-14 text-xl",
      sm: "size-12 text-base",
      xs: "size-9 text-sm",
      "2xs": "size-7 text-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type AvatarVariantProps = VariantProps<typeof avatarStyles>;
export type AvatarGroupVariantProps = VariantProps<typeof avatarGroupStyles>;
export type AvatarGroupSlots = keyof ReturnType<typeof avatarGroupStyles>;
export type AvatarSlots = keyof ReturnType<typeof avatarStyles>;

export { avatarGroupStyles, avatarStyles };

/* -------------------------------------------------------------------------- */

type AvatarGroupBaseProps = ComponentSlots<AvatarGroupSlots>;

export type AvatarGroupProps = React.ComponentPropsWithRef<"div"> & {
  max?: number;
} & AvatarGroupBaseProps;

const AvatarGroup = ({
  max,
  children,
  classNames,
  className,
  ...props
}: AvatarGroupProps) => {
  const { group, groupRemainChildren } = avatarGroupStyles();
  const childArray = React.Children.toArray(children);
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const remainingChildrenCount = max ? childArray.length - max : 0;

  return (
    <div
      className={group({ className: cn(classNames?.group, className) })}
      {...props}
    >
      {visibleChildren}

      {remainingChildrenCount > 0 && (
        <span
          className={groupRemainChildren({
            className: classNames?.groupRemainChildren,
          })}
        >
          +{remainingChildrenCount}
        </span>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

type AvatarBaseProps = ComponentSlots<AvatarSlots>;

type AvatarContextType = AvatarBaseProps & {
  styles: ReturnType<typeof avatarStyles>;
};

const [AvatarProvider, useAvatarContext] = createContext<AvatarContextType>({
  name: "AvatarContext",
  strict: true,
  errorMessage:
    "useAvatarContext: `context` is undefined. Seems you forgot to wrap component within <Avatar />",
});

/* -------------------------------------------------------------------------- */

export type AvatarProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Root
> &
  AvatarVariantProps &
  AvatarBaseProps;

const Avatar = ({ size, className, classNames, ...props }: AvatarProps) => {
  const styles = avatarStyles({ size });

  return (
    <AvatarProvider value={{ styles, classNames }}>
      <AvatarPrimitive.Root
        className={styles.base({ className: cn(classNames?.base, className) })}
        {...props}
      />
    </AvatarProvider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 AvatarImage                                */
/* -------------------------------------------------------------------------- */

type AvatarImageProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Image
>;

const AvatarImage = ({ className, ...props }: AvatarImageProps) => {
  const { styles, classNames } = useAvatarContext();

  return (
    <AvatarPrimitive.Image
      className={styles.image({
        className: cn(classNames?.image, className),
      })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                               AvatarFallback                               */
/* -------------------------------------------------------------------------- */

export type AvatarFallbackProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Fallback
>;

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
  const { styles, classNames } = useAvatarContext();

  return (
    <AvatarPrimitive.Fallback
      className={styles.fallback({
        className: cn(classNames?.fallback, className),
      })}
      {...props}
    />
  );
};

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage };
