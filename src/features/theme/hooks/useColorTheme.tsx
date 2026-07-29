// src/features/theme/hooks/useColorTheme.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const COLOR_THEMES = [
  { id: "navy", label: "Medianoche", hex: "#112140" },
  { id: "magenta", label: "Fucsia", hex: "#E81E83" },
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

  // Leer localStorage en la carga inicial e inyectar data-theme de inmediato
useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY) as ColorThemeId | null;
  const theme = stored || DEFAULT_THEME;
  setColorThemeState(theme);
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.remove("dark");
}, []);

const setColorTheme = (id: ColorThemeId) => {
  setColorThemeState(id);
  localStorage.setItem(STORAGE_KEY, id);
  document.documentElement.setAttribute("data-theme", id);
  // Seguridad: mientras forcedTheme="light", nunca queremos .dark
  document.documentElement.classList.remove("dark");
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