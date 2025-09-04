"use client";

import { useEffect, useState } from "react";

const themes = ["bumblebee", "dark"];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>("dark");

  // Detect system theme or saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = prefersDark ? "dark" : "bumblebee";
      setTheme(systemTheme);
      document.documentElement.setAttribute("data-theme", systemTheme);
    }
  }, []);

  // Toggle theme and persist
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "bumblebee" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="font-bold">تم:</label>
      <input
        type="checkbox"
        className="toggle toggle-xs"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <span>{theme === "dark" ? "تاریک" : "روشن"}</span>
    </div>
  );
}
