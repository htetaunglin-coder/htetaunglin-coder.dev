"use client";

import { motion } from "framer-motion";

// =========================================================

interface AnimateDivProps {
  variants: any;
  className?: string;
  delayTime?: number;
  duration?: number;
  children: React.ReactNode;
}

const AnimatedDiv: React.FC<AnimateDivProps> = ({
  variants,
  className,
  delayTime,
  duration,
  children,
}) => {
  return (
    <motion.div
      className={className || ""}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        delay: delayTime ? delayTime : 0,
        duration: duration || 0.5,
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedDiv;
