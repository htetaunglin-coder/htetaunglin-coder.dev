"use client";

import { motion, useInView, type Variants } from "motion/react";
import * as React from "react";

const FADE_UP_VARIANT: Variants = {
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
  hidden: { opacity: 0, y: 18 },
};

const FADE_DOWN_VARIANT: Variants = {
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
  hidden: { opacity: 0, y: -18 },
};

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
  delay = 0.25,
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
            variants={direction === "up" ? FADE_UP_VARIANT : FADE_DOWN_VARIANT}
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
  delay = 0.25,
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
      variants={direction === "up" ? FADE_UP_VARIANT : FADE_DOWN_VARIANT}
      viewport={{ once: true, amount: 0.3 }}
      whileInView="show"
    >
      {children}
    </MotionComponent>
  );
};

export { FadeStaggeredAnimation, FadeAnimation };
