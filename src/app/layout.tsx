import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import {
  Sora,
  Inter,
  Caveat,
  Poppins,
  Montserrat,
  Dancing_Script,
  Oswald,
  Playfair_Display,
  Bebas_Neue,
  Space_Grotesk,
  Merriweather,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

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

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Alternativa gratuita a "Playlist Script" (fuente comercial no disponible en
// next/font/google). Misma variable --font-playlist, así que si más adelante
// compras la licencia original solo hay que cambiar esta declaración por
// next/font/local con el archivo real — nada más en el proyecto se toca.
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-playlist",
  weight: ["400", "600", "700"],
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  weight: ["400", "700"],
  display: "swap",
});

// Metadatos SEO agresivos y optimizados
export const metadata: Metadata = {
  metadataBase: new URL("https://novaprintecu.com"),
  title: {
    default: "Nova Print | Fotógrafo de Eventos y Personalizados en Azogues, Cañar y Ecuador",
    template: "%s | Nova Print",
  },
  description:
    "Fotógrafo profesional de eventos, bodas y quinceaños en Azogues y Cañar. También sublimación, regalos personalizados y merchandising con envíos a todo Ecuador. ¡Agenda tu sesión hoy!",
  keywords: [
    "fotógrafo azogues",
    "fotógrafo cañar",
    "fotografía de eventos ecuador",
    "fotógrafo de bodas azogues",
    "fotógrafo de quinceaños cañar",
    "artículos personalizados azogues",
    "sublimación azogues",
    "regalos personalizados ecuador",
    "impresión personalizada cañar",
    "nova print azogues",
    "fotografía profesional ecuador",
    "merchandising personalizado ecuador",
    "fotógrafo eventos azogues",
    "tazas personalizadas azogues",
    "camisetas personalizadas cañar",
  ],
  authors: [{ name: "Nova Print", url: "https://novaprintecu.com" }],
  creator: "Nova Print",
  publisher: "Nova Print",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://novaprintecu.com",
  },
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
    title: "Nova Print | Fotógrafo de Eventos y Personalizados en Azogues y Ecuador",
    description:
      "Fotografía profesional de bodas, quinceaños y eventos + sublimación y regalos personalizados. Cobertura en Azogues, Cañar y envíos a todo Ecuador.",
    url: "https://novaprintecu.com",
    siteName: "Nova Print",
    locale: "es_EC",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // ← Asegúrate de tener una imagen 1200x630
        width: 1200,
        height: 630,
        alt: "Nova Print - Fotografía de eventos y artículos personalizados en Ecuador",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova Print | Fotógrafo de Eventos y Personalizados en Ecuador",
    description:
      "Fotografía profesional + sublimación y regalos personalizados en Azogues, Cañar y todo Ecuador.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "EC-F",
    "geo.placename": "Azogues",
    "geo.position": "-2.7396;-78.8486",
    ICBM: "-2.7396, -78.8486",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema JSON-LD muy completo y agresivo
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://novaprintecu.com",
    name: "Nova Print",
    alternateName: "Nova Print Ecuador",
    description:
      "Estudio de fotografía profesional de eventos y artículos personalizados (sublimación, regalos y merchandising) en Azogues, Cañar y con envíos a todo Ecuador.",
    url: "https://novaprintecu.com",
    telephone: "+593978727748",
    email: "novaprintoficial1@gmail.com",
    image: "https://novaprintecu.com/logo.jpg",
    logo: "https://novaprintecu.com/logo.jpg",
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Transfer, Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Azogues",
      addressLocality: "Azogues",
      addressRegion: "Cañar",
      postalCode: "030150",
      addressCountry: "EC",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -2.7396,
      longitude: -78.8486,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Azogues",
      },
      {
        "@type": "AdministrativeArea",
        name: "Cañar",
      },
      {
        "@type": "Country",
        name: "Ecuador",
      },
    ],
    knowsAbout: [
      "Fotografía de eventos",
      "Fotografía de bodas",
      "Fotografía de quinceaños",
      "Sublimación",
      "Artículos personalizados",
      "Regalos personalizados",
      "Merchandising",
      "Impresión personalizada",
    ],
    sameAs: [
      "https://www.instagram.com/nova.printec",
      "https://www.facebook.com/share/1S7LLaQq4E",
      "https://www.tiktok.com/@novaprintec",
      "https://wa.me/593978727748",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+593978727748",
        contactType: "customer service",
        areaServed: "EC",
        availableLanguage: ["Spanish"],
      },
      {
        "@type": "ContactPoint",
        email: "novaprintoficial1@gmail.com",
        contactType: "customer service",
        areaServed: "EC",
        availableLanguage: ["Spanish"],
      },
    ],
  };

  return (
    <html
      lang="es"
      className={`${sora.variable} ${inter.variable} ${caveat.variable} ${poppins.variable} ${montserrat.variable} ${dancingScript.variable} ${oswald.variable} ${playfairDisplay.variable} ${bebasNeue.variable} ${spaceGrotesk.variable} ${merriweather.variable}`}
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
        {/* Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
        {/* 2. Añadir Google Analytics aquí */}
        <GoogleAnalytics gaId="G-ZV1YBZP5XR" />
      </body>
    </html>
  );
}