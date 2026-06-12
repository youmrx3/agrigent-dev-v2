import { create } from "zustand";

type Theme =
  | "dark"
  | "light";

type ThemeStore = {
  theme: Theme;

  toggleTheme: () => void;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme =
    localStorage.getItem("theme");

  return savedTheme === "light"
    ? "light"
    : "dark";
};

export const useThemeStore =
  create<ThemeStore>((set, get) => ({
    theme: getInitialTheme(),

    toggleTheme: () => {
      const nextTheme =
        get().theme === "dark"
          ? "light"
          : "dark";

      localStorage.setItem(
        "theme",
        nextTheme
      );

      set({
        theme: nextTheme,
      });
    },
  }));