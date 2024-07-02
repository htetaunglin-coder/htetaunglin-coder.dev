"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

// =========================================================

interface TransitionProps {
  children: React.ReactNode;
}

const Transition: React.FC<TransitionProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {children}
      <motion.div
        className="slide-in bg-zinc-500 dark:bg-secondary"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
      />
      <motion.div
        className="slide-out bg-zinc-500 dark:bg-secondary"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{
          duration: 1,
          ease: [0.85, 0, 0.15, 1],
        }}
      />
    </>
  );
};

export default Transition;
