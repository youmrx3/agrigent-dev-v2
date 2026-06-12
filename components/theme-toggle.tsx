"use client";

import {
  Moon,
  Sun,
} from "lucide-react";

import { useThemeStore } from "@/stores/theme-store";

export default function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 text-slate-300 transition hover:text-white"
    >
      {theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}