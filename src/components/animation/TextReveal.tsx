import React from "react";
import { motion } from "framer-motion";

// =========================================================

interface TextRevealProps {
  children: React.ReactNode;
  width?: string;
  delay?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({
  children,
  width = "fit-content",
  delay = 1,
}) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 top-0 z-20 bg-gray-300 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-flat-black dark:bg-flat-black dark:before:bg-white"
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{
          duration: 1.75,
          delay: delay,
          ease: [0.85, 0, 0.15, 1],
        }}
      ></motion.div>
    </div>
  );
};

export default TextReveal;
