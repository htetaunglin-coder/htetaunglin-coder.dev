"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Context
type ExpandableScreenContextValue = {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  layoutId: string;
  triggerRadius: string;
  contentRadius: string;
  animationDuration: number;
  // Set when collapsing so the trigger can restore focus once it remounts.
  restoreFocusRef: { current: boolean };
};

const ExpandableScreenContext =
  createContext<ExpandableScreenContextValue | null>(null);

function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error(
      "useExpandableScreen must be used within an ExpandableScreen"
    );
  }
  return context;
}

// Root Component
type ExpandableScreenProps = {
  children: ReactNode;
  defaultExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  layoutId?: string;
  triggerRadius?: string;
  contentRadius?: string;
  animationDuration?: number;
  lockScroll?: boolean;
};

export function ExpandableScreen({
  children,
  defaultExpanded = false,
  onExpandChange,
  layoutId = "expandable-card",
  triggerRadius = "100px",
  contentRadius = "24px",
  animationDuration = DURATION.base,
  lockScroll = true,
}: ExpandableScreenProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const restoreFocusRef = useRef(false);

  const expand = () => {
    setIsExpanded(true);
    onExpandChange?.(true);
  };

  const collapse = () => {
    restoreFocusRef.current = true;
    setIsExpanded(false);
    onExpandChange?.(false);
  };

  useEffect(() => {
    if (lockScroll) {
      if (isExpanded) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }
  }, [isExpanded, lockScroll]);

  return (
    <ExpandableScreenContext.Provider
      value={{
        isExpanded,
        expand,
        collapse,
        layoutId,
        triggerRadius,
        contentRadius,
        animationDuration,
        restoreFocusRef,
      }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  );
}

// Trigger Component
type ExpandableScreenTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function ExpandableScreenTrigger({
  children,
  className = "",
}: ExpandableScreenTriggerProps) {
  const {
    isExpanded,
    expand,
    layoutId,
    triggerRadius,
    animationDuration,
    restoreFocusRef,
  } = useExpandableScreen();
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLDivElement>(null);

  // After the panel closes, return focus to the trigger (it unmounts while the
  // panel is open, so we restore on remount rather than from a stored node).
  useEffect(() => {
    if (isExpanded || !restoreFocusRef.current) {
      return;
    }
    restoreFocusRef.current = false;
    const el =
      triggerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    // Next frame: the panel's `inert` on the background is cleared by then.
    requestAnimationFrame(() => el?.focus());
  }, [isExpanded, restoreFocusRef]);

  // Smooth spring deceleration, no overshoot — glides to rest.
  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: animationDuration };

  return (
    <AnimatePresence initial={false}>
      {!isExpanded && (
        <motion.div
          className={cn("relative inline-block", className)}
          ref={triggerRef}
        >
          {/* Background layer with shared layoutId for morphing */}
          <motion.div
            className="absolute inset-0 transform-gpu will-change-transform"
            layout
            layoutId={layoutId}
            style={{
              borderRadius: triggerRadius,
            }}
            transition={layoutTransition}
          />
          {/* Content layer that materializes in / softly fades out on expand */}
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: reduceMotion
                ? { duration: 0 }
                : { delay: 0.25, duration: DURATION.quick, ease: EASE.out },
            }}
            className="relative cursor-pointer"
            exit={{
              opacity: 0,
              scale: 0.98,
              filter: "blur(4px)",
              transition: reduceMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: EASE.in },
            }}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            layout={false}
            onClick={expand}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Content Component
type ExpandableScreenContentProps = {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
  /** Accessible name for the dialog, announced to screen readers on open. */
  dialogLabel?: string;
};

export function ExpandableScreenContent({
  children,
  className = "",
  showCloseButton = true,
  closeButtonClassName = "",
  dialogLabel,
}: ExpandableScreenContentProps) {
  const { isExpanded, collapse, layoutId, contentRadius, animationDuration } =
    useExpandableScreen();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Keep a stable reference to collapse so the trap effect doesn't re-subscribe
  // (and steal focus) on every render while the panel is open.
  const collapseRef = useRef(collapse);
  collapseRef.current = collapse;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Move focus into the dialog when it opens so keyboard/screen-reader users
  // land on it (and it announces its role + label).
  useEffect(() => {
    if (!isExpanded) {
      return;
    }
    const frame = requestAnimationFrame(() => overlayRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isExpanded]);

  // Escape closes.
  useEffect(() => {
    if (!isExpanded) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        collapseRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  // ponytail: native `inert` (Baseline 2023) traps focus AND hides the rest
  // from assistive tech — no manual Tab loop, no aria-hidden bookkeeping.
  useEffect(() => {
    if (!isExpanded) {
      return;
    }
    const overlayEl = overlayRef.current;
    const background = [...document.body.children].filter(
      (el) => el !== overlayEl
    );
    for (const el of background) {
      el.setAttribute("inert", "");
    }
    return () => {
      for (const el of background) {
        el.removeAttribute("inert");
      }
    };
  }, [isExpanded]);

  // Same calm spring as the trigger so the morph reads as one continuous motion.
  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: animationDuration };

  const overlay = (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          aria-label={dialogLabel}
          aria-modal="true"
          className={cn(
            "fixed inset-3 z-[calc(var(--above-grainy-overlay-z-index)+12)] flex transform-gpu overflow-y-auto outline-none will-change-transform sm:inset-2",
            className
          )}
          layout
          layoutId={layoutId}
          ref={overlayRef}
          role="dialog"
          style={{
            borderRadius: contentRadius,
          }}
          tabIndex={-1}
          transition={layoutTransition}
        >
          <motion.div
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="relative z-20 w-full"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { delay: 0.3, duration: 0.5, ease: EASE.out }
            }
          >
            {children}
          </motion.div>

          {showCloseButton && (
            <motion.button
              aria-label="Close"
              className={cn(
                "absolute top-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full outline-none ring-offset-2 transition duration-300 focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-inverse",
                closeButtonClassName ||
                  "bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              )}
              onClick={collapse}
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(overlay, document.body);
}

// Background Component (optional)
type ExpandableScreenBackgroundProps = {
  trigger?: ReactNode;
  content?: ReactNode;
  className?: string;
};

export function ExpandableScreenBackground({
  trigger,
  content,
  className = "",
}: ExpandableScreenBackgroundProps) {
  const { isExpanded } = useExpandableScreen();

  if (isExpanded && content) {
    return <div className={className}>{content}</div>;
  }

  if (!isExpanded && trigger) {
    return <div className={className}>{trigger}</div>;
  }

  return null;
}

export { useExpandableScreen };
