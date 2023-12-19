import React from "react";
import { motion } from "framer-motion";

export const Reveal = ({ children, width = "fit-content", delay = 1 }) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      {children}
      <motion.div
        className="absolute top-0 bottom-0 left-0 right-0 bg-gray-300 dark:bg-flat-black z-20 before:w-0.5 before:h-full before:absolute before:top-0 before:left-0 before:bg-flat-black dark:before:bg-white"
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{
          duration: 2,
          delay: delay,
          ease: [0.85, 0, 0.15, 1],
        }}></motion.div>
    </div>
  );
};
