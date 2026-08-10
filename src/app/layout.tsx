import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Sora, Inter, Caveat } from "next/font/google";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";

// 1. Tipografías con variables CSS y pesos completos (incluido 400 para textos normales)
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nova Print | Dale color a tus ideas",
  description: "Landing y administración de imágenes de Nova Print",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 2. Inyección de variables tipográficas en la etiqueta <html>
    <html
      lang="es"
      className={`${sora.variable} ${inter.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Script para evitar FOUC (parpadeo de tema) antes del renderizado */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('color-theme') || 'navy';
                  document.documentElement.setAttribute('data-theme', t);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
         
      </body>
    </html>
  );
}