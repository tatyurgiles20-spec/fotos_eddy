// src/app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { ColorThemeProvider } from "@/features/theme/hooks/useColorTheme";
import { ColorThemeSwitcher } from "@/features/theme/components/ColorThemeSwitcher";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    originalError(...args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // forcedTheme="light" bloquea la inyección de la clase .dark de next-themes
    <ThemeProvider attribute="class" defaultTheme="light">
      <ColorThemeProvider>
        {children}
        {/* TEMPORAL: selector de color de marca */}
        <ColorThemeSwitcher />
      </ColorThemeProvider>
    </ThemeProvider>
  );
}