"use client";

import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const ToggleTheme = ({ className }: { className?: string }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        setTheme("dark");
        localStorage.setItem("color-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        setTheme("light");
        localStorage.setItem("color-theme", "light");
      }
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        setTheme("light");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        setTheme("dark");
        localStorage.setItem("color-theme", "dark");
      }
    }
  };

  return (
    <button className={`hover:brightness-75 transition duration-200 ${className}`} onClick={toggleTheme}>
      {theme == "dark" ? <FiMoon /> : <FiSun />}
    </button>
  );
};

export default ToggleTheme;
