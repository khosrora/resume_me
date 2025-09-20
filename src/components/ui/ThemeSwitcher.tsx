"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>("dark");

  // Detect system theme or saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
      document.documentElement.setAttribute("data-theme", systemTheme);
      if (systemTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Toggle theme and persist
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <span>{theme === "dark" ? <IconMoon /> : <IconSun />}</span>
      <input
        type="checkbox"
        className="toggle toggle-xs"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
    </div>
  );
}
