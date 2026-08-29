import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Sora, Inter, Caveat } from "next/font/google";

// Tipografías
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

// Metadatos SEO optimizados para Ecuador
export const metadata: Metadata = {
  metadataBase: new URL("https://novaprint.ec"), // Cambia por tu dominio real
  title: {
    default: "Nova Print | Fotografía de Eventos y Artículos Personalizados en Ecuador",
    template: "%s | Nova Print",
  },
  description:
    "Servicios profesionales de fotografía para eventos y personalizados (sublimación, regalos y merchandising). Atención en Azogues, Cañar y envíos a todo el Ecuador.",
  keywords: [
    "fotografia de eventos ecuador",
    "fotografo profesional azogues",
    "articulos personalizados ecuador",
    "sublimacion y regalos azogues",
    "fotografia de bodas cañar",
    "impresion personalizada ecuador",
    "nova print azogues",
  ],
  authors: [{ name: "Nova Print" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Nova Print | Fotografía de Eventos y Artículos Personalizados",
    description:
      "Dale color a tus ideas. Cobertura en fotografía de eventos y artículos personalizados con envíos a todo el Ecuador.",
    url: "https://novaprint.ec",
    siteName: "Nova Print",
    locale: "es_EC",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema JSON-LD para avisar a Google de tus servicios y cobertura
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Nova Print",
    "image": "https://novaprint.ec/logo.jpg", // Cambia por la URL de tu logo
    "@id": "https://novaprint.ec",
    "url": "https://novaprint.ec",
    "telephone": "+593900000000", // Agrega tu WhatsApp / Teléfono real
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Azogues",
      "addressLocality": "Azogues",
      "addressRegion": "Cañar",
      "postalCode": "030150",
      "addressCountry": "EC",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -2.7396,
      "longitude": -78.8486,
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Azogues",
      },
      {
        "@type": "AdministrativeArea",
        "name": "Cañar",
      },
      {
        "@type": "Country",
        "name": "Ecuador",
      },
    ],
    "knowsAbout": [
      "Fotografía de eventos",
      "Artículos personalizados",
      "Sublimación",
      "Regalos personalizados",
    ],
  };

  return (
    <html
      lang="es"
      className={`${sora.variable} ${inter.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Script para evitar FOUC */}
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
        {/* Inyección del Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}