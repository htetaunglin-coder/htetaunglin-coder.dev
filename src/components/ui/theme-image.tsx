"use client";

import type { CldImage } from "next-cloudinary";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import { CloudinaryImage } from "../cloudinary-image";

type ThemeImageProps = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
} & Omit<React.ComponentProps<typeof CldImage>, "src">;

export const ThemeImage = ({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  className,
  preload = false,
  ...props
}: ThemeImageProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a deterministic light image during SSR, then switch after hydration
  // if the active client theme is dark.
  const src = mounted && theme === "dark" ? darkSrc : lightSrc;

  return (
    <CloudinaryImage
      alt={alt}
      className={className}
      height={height}
      preload={preload}
      src={src}
      width={width}
      {...props}
    />
  );
};
