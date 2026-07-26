"use client";

import { COLOR_THEMES, useColorTheme } from "@/features/theme/hooks/useColorTheme";

// TEMPORAL: selector de color de marca para que el cliente elija.
export function ColorThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex gap-2 rounded-full border border-border bg-card p-2 shadow-lg">
      {COLOR_THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setColorTheme(theme.id)}
          title={theme.label}
          aria-label={`Tema ${theme.label}`}
          className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${
            colorTheme === theme.id ? "ring-2 ring-offset-2 ring-offset-card ring-foreground" : ""
          }`}
          style={{ backgroundColor: theme.hex }}
        />
      ))}
    </div>
  );
}