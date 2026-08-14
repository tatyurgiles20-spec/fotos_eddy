import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Marca con contenido alineado a la derecha del logo */}
          <div className="flex items-start gap-6 md:col-span-2">
            <Link href="/" className="shrink-0 transition-transform duration-300 hover:scale-105">
              <Image
                src="/logo-nova-print-contorno.png" // Reemplaza con la ruta de tu logo
                alt="Nova Print Logo"
                width={160}
                height={160}
                className="h-28 sm:h-36 w-auto object-contain"
                priority
              />
            </Link>

            <div className="flex flex-col items-start">
              <Link href="/">
                <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground">
                  Nova Print
                </span>
              </Link>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
                Estudio fotográfico y personalizados: Capturamos tus momentos y recuerdos para convertirlos
                en arte personal y único, listo para llevar contigo.
              </p>

              <span className="tag-handwritten mt-3 inline-block text-primary-foreground!">
                Hecho con cariño
              </span>
            </div>
          </div>

         {/* Enlaces (Desplazados hacia la derecha con pl-4 o md:pl-8) */}
          <div className="flex flex-col items-start text-left pl-2 md:pl-16 lg:pl-24">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              Explora
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href="#servicios" className="w-fit transition-colors hover:text-primary-foreground">
                Servicios
              </a>
              <Link href="/galeria" className="w-fit transition-colors hover:text-primary-foreground">
                Galería
              </Link>
              <a href="#contacto" className="w-fit transition-colors hover:text-primary-foreground">
                Contacto
              </a>
            </div>
          </div>

          {/* Contacto (Desplazados hacia la derecha con pl-4 o md:pl-8) */}
          <div className="flex flex-col items-start text-left pl-2 md:pl-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              Contacto
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href="mailto:hola@novaprint.com" className="w-fit transition-colors hover:text-primary-foreground">
                hola@novaprint.com
              </a>
              <a href="tel:+593000000000" className="w-fit transition-colors hover:text-primary-foreground">
                +593 00 000 0000
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Nova Print. Todos los derechos reservados.</p>

          {/* Acceso administrativo — discreto */}
          <Link
            href="/login"
            className="group inline-flex items-center gap-1.5 text-primary-foreground/40 transition-colors hover:text-primary-foreground"
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