import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Marca */}
          <div className="md:col-span-2">
            <span className="font-display text-xl font-bold tracking-tight text-primary-foreground">
              Nova Print
            </span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              Estudio fotográfico y personalizados: capturamos tus recuerdos y los convertimos en arte único, listo para llevar contigo.
            </p>
            <span className="tag-handwritten mt-4 inline-block text-primary-foreground!">
              Hecho con cariño
            </span>
          </div>

          {/* Enlaces */}
          <div>
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

          {/* Contacto */}
          <div>
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

          {/* Acceso administrativo — discreto, no destinado al público */}
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