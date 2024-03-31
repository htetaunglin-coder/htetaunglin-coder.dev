import { motion } from "framer-motion";
import { ReactNode } from "react";

const Transition = (OgComponent: () => ReactNode) => {
  return () => (
    <>
      <OgComponent />
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
        }}></motion.div>
    </>
  );
};

export default Transition;
