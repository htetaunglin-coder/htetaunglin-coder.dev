"use client";

import { motion, useInView } from "motion/react";
import * as React from "react";

/* -------------------------------------------------------------------------- */

type FadeStaggeredAnimationProps = {
  className?: string;
  delay?: number;
  as?: React.ElementType;
  childAs?: React.ElementType;
  direction: "up" | "down";
  children: React.ReactNode;
  staggerChildren?: number;
  initialOpacity?: number;
};

const FadeStaggeredAnimation = ({
  as: Component = "div",
  childAs: ChildComponent = "div",
  direction,
  children,
  className = "",
  staggerChildren = 0.1,
  initialOpacity = 0,
  delay = 0,
}: FadeStaggeredAnimationProps) => {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: false,
  });
  const MotionChild = motion.create(ChildComponent, {
    forwardMotionProps: false,
  });

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <MotionComponent
      animate={isInView ? "show" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? (
          <MotionChild
            variants={{
              hidden: {
                opacity: initialOpacity,
                transform: `translateY(${direction === "up" ? 18 : -18}px)`,
              },
              show: {
                opacity: 1,
                transform: "translateY(0px)",
                transition: {
                  type: "spring",
                  stiffness: 80,
                },
              },
            }}
          >
            {child}
          </MotionChild>
        ) : (
          child
        )
      )}
    </MotionComponent>
  );
};

/* -------------------------------------------------------------------------- */

type FadeAnimationProps = {
  className?: string;
  delay?: number;
  distance?: number;
  amount?: number | "some" | "all";
  once?: boolean;
  as?: React.ElementType;
  direction: "up" | "down";
  children: React.ReactNode;
};

const FadeAnimation = ({
  direction,
  delay = 0,
  distance = 18,
  amount = 0.3,
  once = true,
  className,
  as: Component = "span",
  children,
}: FadeAnimationProps) => {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: false,
  });

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      transition={{ delay, type: "spring", stiffness: 80 }}
      variants={{
        hidden: {
          opacity: 0,
          transform: `translateY(${direction === "up" ? distance : -distance}px)`,
        },
        show: {
          opacity: 1,
          transform: "translateY(0px)",
          transition: {
            type: "spring",
            stiffness: 80,
            delay,
          },
        },
      }}
      viewport={{ once, amount }}
      whileInView="show"
    >
      {children}
    </MotionComponent>
  );
};

export { FadeStaggeredAnimation, FadeAnimation };
