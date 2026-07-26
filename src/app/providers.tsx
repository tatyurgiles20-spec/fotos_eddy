"use client";

import { ThemeProvider } from "next-themes";
import { ColorThemeProvider } from "@/features/theme/hooks/useColorTheme";
import { ColorThemeSwitcher } from "@/features/theme/components/ColorThemeSwitcher";

// Next.js 16.2+ / React 19 advierten sobre el <script> que next-themes
// inyecta para evitar parpadeo de tema. Es un falso positivo conocido
// (el script sí corre correctamente en SSR). Se filtra solo ese mensaje.
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ColorThemeProvider>
        {children}
        {/* TEMPORAL: quitar cuando el cliente elija el tema final */}
        <ColorThemeSwitcher />
      </ColorThemeProvider>
    </ThemeProvider>
  );
}