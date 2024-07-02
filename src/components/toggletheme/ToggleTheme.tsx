"use client";

import React, { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

// =========================================================

const ToggleTheme = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return;

  if (resolvedTheme === "dark") {
    return (
      <button
        onClick={() => setTheme("light")}
        className={`transition duration-200 hover:brightness-75 ${className}`}>
        <FiSun />
      </button>
    );
  }
  if (resolvedTheme === "light") {
    return (
      <button
        onClick={() => setTheme("dark")}
        className={`transition duration-200 hover:brightness-75 ${className}`}>
        <FiMoon />
      </button>
    );
  }
};

export default ToggleTheme;
