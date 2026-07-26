"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const COLOR_THEMES = [
  { id: "navy", label: "Medianoche", hex: "#112140" },
  { id: "cyan", label: "Cielo", hex: "#00AEEF" },
  { id: "magenta", label: "Fucsia", hex: "#E81E83" },
  { id: "amber", label: "Ámbar", hex: "#FFC107" },
  { id: "orange", label: "Naranja", hex: "#EB6100" },
  { id: "carbon", label: "Carbón", hex: "#101010" },
] as const;

export type ColorThemeId = (typeof COLOR_THEMES)[number]["id"];

type ColorThemeContextValue = {
  colorTheme: ColorThemeId;
  setColorTheme: (id: ColorThemeId) => void;
};

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);
const STORAGE_KEY = "color-theme";
const DEFAULT_THEME: ColorThemeId = "navy";

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorThemeId | null;
    if (stored) setColorThemeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  const setColorTheme = (id: ColorThemeId) => {
    setColorThemeState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const ctx = useContext(ColorThemeContext);
  if (!ctx) throw new Error("useColorTheme debe usarse dentro de ColorThemeProvider");
  return ctx;
}