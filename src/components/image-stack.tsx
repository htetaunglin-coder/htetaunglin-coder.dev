"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeImage } from "./ui/theme-image";

let interval: any;

export type ImageItem = {
  id: string;
  alt: string;
  src:
    | {
        light: string;
        dark: string;
      }
    | string;
};

const ImageStack = ({
  className,
  images: items,
  offset = 20,
  scaleFactor = 0.06,
}: {
  images: ImageItem[];
  offset?: number;
  scaleFactor?: number;
  className?: string;
}) => {
  const [images, setImages] = useState<ImageItem[]>(items);

  // biome-ignore lint/correctness/useExhaustiveDependencies: off
  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setImages((prevCards: ImageItem[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        // biome-ignore lint/style/noNonNullAssertion: off
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 3000);
  };

  return (
    <div className={cn("relative aspect-[16/9] w-full", className)}>
      {images.map((image, index) => {
        return (
          <motion.div
            animate={{
              top: index * -offset,
              scale: 1 - index * scaleFactor, // decrease scale for cards that are behind
              zIndex: images.length - index, //  decrease z-index for the cards that are behind
              filter: `brightness(${Math.max(50, 100 - index * 25)}%)`,
            }}
            className="absolute aspect-[16/9] w-full translate-y-20 overflow-hidden rounded-xl border border-outline-tertiary bg-bg-secondary shadow-black/[0.1] shadow-xl duration-500 dark:shadow-white/[0.1]"
            key={image.id}
            style={{
              transformOrigin: "top center",
            }}
          >
            <DynamicImage alt={image.alt} src={image.src} />
          </motion.div>
        );
      })}
    </div>
  );
};

export { ImageStack };

const DynamicImage = ({ alt, src }: { alt: string; src: ImageItem["src"] }) => {
  const lightSrc = typeof src === "object" ? src.light : src;
  const darkSrc = typeof src === "object" ? src.dark : src;

  return (
    <ThemeImage
      alt={alt}
      className="object-cover object-top-left"
      darkSrc={darkSrc}
      fill
      lightSrc={lightSrc}
    />
  );
};
