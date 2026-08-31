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

// Metadatos SEO optimizados para Ecuador
// Metadatos SEO optimizados y agresivos para Ecuador
export const metadata: Metadata = {
  metadataBase: new URL("https://novaprint.ec"),
  title: {
    default:
      "Nova Print | Fotógrafo de Eventos y Artículos Personalizados en Azogues, Cañar y Ecuador",
    template: "%s | Nova Print",
  },
  description:
    "Fotógrafo profesional de eventos en Azogues y Cañar. Especialistas en fotografía de bodas, quinceaños, bautizos y eventos. Además: sublimación, regalos personalizados, tazas, polos y merchandising con envíos a todo Ecuador. ¡Cotiza hoy!",
  keywords: [
    // Principales
    "fotógrafo de eventos azogues",
    "fotógrafo profesional cañar",
    "fotografía de bodas azogues",
    "fotógrafo de quinceaños cañar",
    "artículos personalizados ecuador",
    "sublimación azogues",
    "regalos personalizados cañar",
    "impresiones personalizadas ecuador",
    // Secundarias / long-tail
    "fotógrafo de eventos ecuador",
    "fotografía de eventos azogues",
    "estudio fotográfico azogues",
    "tazas personalizadas azogues",
    "polos personalizados ecuador",
    "merchandising personalizado cañar",
    "fotógrafo de bautizos azogues",
    "fotos de eventos cañar",
    "nova print azogues",
    "personalizados en azogues",
    "sublimación en cañar",
  ],
  authors: [{ name: "Nova Print" }],
  creator: "Nova Print",
  publisher: "Nova Print",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
    title:
      "Nova Print | Fotógrafo de Eventos y Artículos Personalizados en Azogues",
    description:
      "Fotografía profesional de bodas, quinceaños y eventos + sublimación y regalos personalizados. Cobertura en Azogues, Cañar y envíos a todo Ecuador.",
    url: "https://novaprint.ec",
    siteName: "Nova Print",
    locale: "es_EC",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // ← Reemplaza por tu imagen real (ideal 1200x630)
        width: 1200,
        height: 630,
        alt: "Nova Print - Fotografía de Eventos y Personalizados en Azogues",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Nova Print | Fotógrafo de Eventos y Artículos Personalizados en Azogues",
    description:
      "Fotografía profesional de eventos + sublimación y regalos personalizados. Azogues, Cañar y todo Ecuador.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://novaprint.ec",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema JSON-LD agresivo y completo
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://novaprint.ec",
    name: "Nova Print",
    alternateName: "Nova Print Azogues",
    description:
      "Estudio fotográfico y de artículos personalizados en Azogues, Cañar. Especialistas en fotografía de eventos (bodas, quinceaños, bautizos) y sublimación de regalos, tazas, polos y merchandising. Envíos a todo Ecuador.",
    url: "https://novaprint.ec",
    telephone: "+593978727748",
    email: "novaprintoficial1@gmail.com",
    image: "https://novaprint.ec/logo.jpg",
    logo: "https://novaprint.ec/logo.jpg",
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
        "@type": "AdministrativeArea",
        name: "Azuay",
      },
      {
        "@type": "Country",
        name: "Ecuador",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios Nova Print",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fotografía de Eventos",
            description:
              "Cobertura profesional de bodas, quinceaños, bautizos, graduaciones y eventos sociales en Azogues y Cañar.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Artículos Personalizados y Sublimación",
            description:
              "Tazas, polos, gorras, llaveros, cuadros y merchandising personalizado con envíos a todo Ecuador.",
          },
        },
      ],
    },
    knowsAbout: [
      "Fotografía de eventos",
      "Fotografía de bodas",
      "Fotografía de quinceaños",
      "Fotografía de bautizos",
      "Artículos personalizados",
      "Sublimación",
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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+593978727748",
      contactType: "customer service",
      availableLanguage: ["Spanish"],
      areaServed: "EC",
    },
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
      </body>
    </html>
  );
}