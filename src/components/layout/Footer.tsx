import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/593978727748",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/nova.printec",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1S7LLaQq4E",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@novaprintec",
  },
] as const;

function SocialIcon({ id }: { id: string }) {
  switch (id) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.31-1.93 1.36-.5.05-.95.24-3.2-.68-2.7-1.1-4.44-3.86-4.58-4.04-.13-.18-1.1-1.46-1.1-2.78 0-1.32.7-1.97.94-2.24.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.17.01.38-.06.6.45.24.55.8 1.9.87 2.04.07.14.12.3.02.48-.1.18-.15.29-.3.45-.15.16-.31.35-.44.47-.15.14-.3.3-.13.58.17.28.75 1.24 1.62 2.01 1.12.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.2.72-.83.91-1.12.19-.29.38-.24.63-.14.26.09 1.62.76 1.9.9.28.14.46.21.53.33.07.12.07.68-.17 1.36Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M13.5 21v-7.6h2.55l.38-3h-2.93V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.24C16.32 4.17 15.42 4.1 14.36 4.1c-2.2 0-3.7 1.34-3.7 3.8v2.5H8.1v3h2.56V21h2.84Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M16.6 5.82c-.9-.9-1.4-2.12-1.4-3.4h-3.1v13.44a2.6 2.6 0 1 1-2.6-2.6c.24 0 .48.03.7.09V10.2a5.7 5.7 0 0 0-.7-.04A5.72 5.72 0 1 0 15.1 15.9V9.03a7.6 7.6 0 0 0 4.4 1.4V7.36a4.7 4.7 0 0 1-2.9-1.54Z" />
        </svg>
      );
    default:
      return null;
  }
}

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-primary overflow-hidden">
      {/* Sutil decoración de fondo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Marca */}
          <div className="flex items-start gap-5 md:col-span-2">
            <Link
              href="/"
              className="shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/logo-nova-print-contorno.png"
                alt="Nova Print Logo"
                width={160}
                height={160}
                className="h-28 sm:h-36 w-auto object-contain drop-shadow-md"
                priority
              />
            </Link>

            <div className="flex flex-col items-start pt-1">
              <Link href="/">
                <span className="section-title text-4xl sm:text-5xl text-primary-foreground transition-opacity hover:opacity-90">
                  Nova Print
                </span>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
                Estudio fotográfico y personalizados: Capturamos tus momentos y
                recuerdos para convertirlos en arte personal y único, listo para
                llevar contigo.
              </p>

              <span className="tag-handwritten mt-4 inline-block text-primary-foreground!">
                Hecho con cariño
              </span>
            </div>
          </div>

          {/* Explora */}
          <div className="flex flex-col items-start text-left">
            <h3 className="section-subtitle text-xs !font-semibold uppercase tracking-wider text-primary-foreground">
              Explora
            </h3>
            <div className="mt-5 flex flex-col gap-3.5 text-sm text-primary-foreground/75">
              <a
                href="#servicios"
                className="group w-fit transition-colors hover:text-primary-foreground"
              >
                <span className="relative">
                  Servicios
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary-foreground transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
              <Link
                href="/galeria"
                className="group w-fit transition-colors hover:text-primary-foreground"
              >
                <span className="relative">
                  Galería
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary-foreground transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
              <a
                href="#contacto"
                className="group w-fit transition-colors hover:text-primary-foreground"
              >
                <span className="relative">
                  Contacto
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary-foreground transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
            </div>
          </div>

          {/* Contacto + Redes */}
          <div className="flex flex-col items-start text-left">
            <h3 className="section-subtitle text-xs !font-semibold uppercase tracking-wider text-primary-foreground">
              Contacto
            </h3>

            <div className="mt-5 flex flex-col gap-3.5 text-sm text-primary-foreground/75">
              <a
                href="mailto:novaprintoficial1@gmail.com"
                className="group flex items-center gap-2.5 transition-colors hover:text-primary-foreground"
              >
                <svg
                  className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                novaprintoficial1@gmail.com
              </a>

              <a
                href="https://wa.me/593978727748"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 transition-colors hover:text-primary-foreground"
              >
                <svg
                  className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.31-1.93 1.36-.5.05-.95.24-3.2-.68-2.7-1.1-4.44-3.86-4.58-4.04-.13-.18-1.1-1.46-1.1-2.78 0-1.32.7-1.97.94-2.24.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.17.01.38-.06.6.45.24.55.8 1.9.87 2.04.07.14.12.3.02.48-.1.18-.15.29-.3.45-.15.16-.31.35-.44.47-.15.14-.3.3-.13.58.17.28.75 1.24 1.62 2.01 1.12.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.2.72-.83.91-1.12.19-.29.38-.24.63-.14.26.09 1.62.76 1.9.9.28.14.46.21.53.33.07.12.07.68-.17 1.36Z" />
                </svg>
                +593 978 727 748
              </a>
            </div>

            {/* Iconos de redes */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/20 hover:scale-110 hover:shadow-md"
                >
                  <SocialIcon id={social.id} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/55 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Nova Print. Todos los derechos
            reservados.
          </p>

          <Link
            href="/login"
            className="btn group inline-flex items-center gap-1.5 text-primary-foreground/35 transition-colors hover:text-primary-foreground/70"
            title="Acceso administrador"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z"
              />
            </svg>
            <span>Administrador</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}