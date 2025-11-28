// From https://ui.aceternity.com/components/card-stack

"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PROJECT_DATA } from "@/features/projects/data";

let interval: any;

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 20;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  // biome-ignore lint/correctness/useExhaustiveDependencies: off
  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        // biome-ignore lint/style/noNonNullAssertion: off
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 3000);
  };

  return (
    <div className="relative aspect-[16/9] w-full">
      {cards.map((card, index) => {
        return (
          <motion.div
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
              filter: `brightness(${Math.max(50, 100 - index * 25)}%)`,
            }}
            className="absolute aspect-[16/9] w-full translate-y-20 overflow-hidden rounded-xl border border-outline-tertiary shadow-black/[0.1] shadow-xl duration-500 dark:shadow-white/[0.1]"
            key={card.id}
            style={{
              transformOrigin: "top center",
            }}
          >
            <Image
              alt={PROJECT_DATA[0].title}
              className="object-cover object-top-left"
              fill
              src={`/test-${card.id + 1}.png`}
              // lightSrc={PROJECT_DATA[0].image.dark}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
