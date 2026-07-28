import type { Metadata } from "next"; 
import "./globals.css";
import { Providers } from "./providers"; 
import { Sora, Inter, Caveat } from "next/font/google";
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nova Print | Dale color a tus ideas",
  description: "Landing y administración de imágenes de Nova Print",
};

// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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