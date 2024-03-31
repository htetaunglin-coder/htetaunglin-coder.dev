"use client";

import { AnimatePresence } from "framer-motion";
import React from "react";

const AnimatePresenceWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
};

export default AnimatePresenceWrapper;
