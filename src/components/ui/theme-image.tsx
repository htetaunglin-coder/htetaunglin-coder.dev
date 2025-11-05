"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";

type ThemeImageProps = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
} & Omit<React.ComponentProps<typeof Image>, "src">;

export const ThemeImage = ({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  className,
  ...props
}: ThemeImageProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Dynamically set the src based on the theme
  const src = theme === "dark" ? darkSrc : lightSrc;

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      src={src}
      width={width}
      {...props}
    />
  );
};
