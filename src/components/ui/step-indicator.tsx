"use client";

import { motion, useReducedMotion } from "motion/react";
import { tv } from "tailwind-variants";

import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const stepIndicatorStyles = tv({
  slots: {
    base: "relative inline-flex items-center",
    fill: "absolute rounded-full bg-fg-brand",
    // The dot is the visual, the slot around it is the pointer target.
    slot: "relative z-10 flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fg-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
    dot: "rounded-full duration-300 ease-in-out",
  },
});

// The fill has to land exactly on the dots it covers, so both are measured from
// these rather than tuned by eye.
const SLOT_SIZE = 20;
const DOT_SIZE = 6;
const FILL_PADDING = 4;

export { stepIndicatorStyles };

/* -------------------------------------------------------------------------- */

export type StepIndicatorProps = {
  /** One label per step, in order. Each names its step to assistive tech. */
  steps: string[];
  /** How many dots are filled, counted from the start. */
  current: number;
  /** Omit to render a read-only `progressbar` instead of a jump control. */
  onSelect?: (index: number) => void;
  className?: string;
};

export function StepIndicator({
  steps,
  current,
  onSelect,
  className,
}: StepIndicatorProps) {
  const { base, fill, slot, dot } = stepIndicatorStyles();
  const reduceMotion = useReducedMotion();
  const done = Math.max(0, Math.min(current, steps.length));

  const status = onSelect
    ? {}
    : ({
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": steps.length,
        "aria-valuenow": done,
        "aria-valuetext": `${done} of ${steps.length} done`,
      } as const);

  return (
    <div className={base({ className })} {...status}>
      <motion.span
        animate={{ width: fillWidth(done), y: "-50%" }}
        aria-hidden="true"
        className={fill()}
        // In place on first paint, rather than replaying from zero on mount.
        initial={false}
        style={{
          left: (SLOT_SIZE - DOT_SIZE) / 2 - FILL_PADDING,
          top: "50%",
          height: DOT_SIZE + FILL_PADDING * 2,
        }}
        transition={reduceMotion ? { duration: 0 } : SPRING.smooth}
      />

      {steps.map((label, index) => {
        const marker = (
          <span
            className={dot({
              className: cn(
                index < done ? "bg-bg-default-alt" : "bg-outline-default"
              ),
            })}
            style={{ width: DOT_SIZE, height: DOT_SIZE }}
          />
        );
        const size = { width: SLOT_SIZE, height: SLOT_SIZE };

        if (!onSelect) {
          return (
            <span className={slot()} key={label} style={size}>
              {marker}
            </span>
          );
        }

        return (
          <button
            aria-current={index === done - 1 ? "step" : undefined}
            aria-label={`Step ${index + 1} of ${steps.length}: ${label}`}
            className={slot({ className: "cursor-pointer" })}
            key={label}
            onClick={() => onSelect(index)}
            style={size}
            type="button"
          >
            {marker}
          </button>
        );
      })}
    </div>
  );
}

function fillWidth(done: number): number {
  if (done <= 0) {
    return 0;
  }

  return (done - 1) * SLOT_SIZE + DOT_SIZE + FILL_PADDING * 2;
}
