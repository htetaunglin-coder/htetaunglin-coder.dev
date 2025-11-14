"use client";

import { motion, useInView } from "motion/react";
import * as React from "react";

/* -------------------------------------------------------------------------- */

type FadeStaggeredAnimationProps = {
  className?: string;
  delay?: number;
  as?: React.ElementType;
  direction: "up" | "down";
  children: React.ReactNode;
  staggerChildren?: number;
};

const FadeStaggeredAnimation = ({
  as: Component = "div",
  direction,
  children,
  className = "",
  staggerChildren = 0.1,
  delay = 0,
}: FadeStaggeredAnimationProps) => {
  const MotionComponent = motion.create(Component, {
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
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: direction === "up" ? 18 : -18,
              },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 80,
                },
              },
            }}
          >
            {child}
          </motion.div>
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
  as?: React.ElementType;
  direction: "up" | "down";
  children: React.ReactNode;
};

const FadeAnimation = ({
  direction,
  delay = 0,
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
          y: direction === "up" ? 18 : -18,
        },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 80,
            delay,
          },
        },
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView="show"
    >
      {children}
    </MotionComponent>
  );
};

export { FadeStaggeredAnimation, FadeAnimation };
