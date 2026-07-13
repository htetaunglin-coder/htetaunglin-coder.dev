"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import * as React from "react";
import { DURATION, EASE } from "@/lib/motion";

const EASE_OUT_EXPO = EASE.out;
const ENTER_DURATION = DURATION.base;

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
  // memoize so motion.create isn't re-run each render — a new
  // component type remounts the subtree and replays the entrance animation.
  const MotionComponent = React.useMemo(
    () => motion.create(Component, { forwardMotionProps: false }),
    [Component]
  );

  const MotionChild = React.useMemo(
    () => motion.create(ChildComponent, { forwardMotionProps: false }),
    [ChildComponent]
  );

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  return (
    <MotionComponent
      animate={isInView ? "show" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      variants={{
        hidden: {},
        show: {
          transition: reduceMotion
            ? { duration: 0 }
            : {
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
              hidden: reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: initialOpacity,
                    transform: `translateY(${direction === "up" ? 18 : -18}px)`,
                  },
              show: {
                opacity: 1,
                transform: "translateY(0px)",
                transition: reduceMotion
                  ? { duration: 0 }
                  : { duration: ENTER_DURATION, ease: EASE_OUT_EXPO },
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
  const MotionComponent = React.useMemo(
    () => motion.create(Component, { forwardMotionProps: false }),
    [Component]
  );
  const reduceMotion = useReducedMotion();

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      variants={{
        hidden: reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              transform: `translateY(${direction === "up" ? distance : -distance}px)`,
            },
        show: {
          opacity: 1,
          transform: "translateY(0px)",
          transition: reduceMotion
            ? { duration: 0 }
            : { duration: ENTER_DURATION, ease: EASE_OUT_EXPO, delay },
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
