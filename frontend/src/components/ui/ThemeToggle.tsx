"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial state from localStorage or system preference
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return <div className="w-10 h-10"></div>; // Placeholder to avoid hydration mismatch

  return (
    <button 
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
      title="Toggle theme"
    >
      <span className="material-symbols-outlined text-[1.375rem]">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
