import { Sparkles } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Cuéntanos tu idea",
    description: "¿Tienes una idea en mente? Cuéntanos qué necesitas y, si quieres, sube imágenes o fotos de referencia: te ayudamos a convertirla en un recuerdo único.",
  },
  {
    step: "02",
    title: "Revisa y confirma",
    description: "Hemos creado una imagen según tu idea. Revísala y confírmanos si te gusta o si hay algo que quieras cambiar.",
  },
  {
    step: "03",
    title: "Elaboramos tu pedido",
    description: "Tu idea ha sido plasmada con la mejor calidad en el producto que has pedido.",
  },
  {
    step: "04",
    title: "Disfruta tu producto",
    description: "¡Tu pedido ha sido realizado! Puedes retirarlo en cualquier momento. Esperamos que te guste, y recuerda que en Nova Print transformamos tus ideas en recuerdos únicos.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="section-spacing relative bg-background overflow-hidden">
      {/* Blobs decorativos de fondo, igual que en las demás secciones */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-12">
          <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-2">
            <Sparkles className="h-4 w-4" />
            Proceso simple
          </span>
          <h2 className="section-title !text-5xl sm:!text-6xl md:!text-7xl text-foreground">
            ¿Cómo pedir tu personalizado?
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
          <p className="section-subtitle mt-4 text-muted-foreground">
            Transformar tus recuerdos en detalles únicos es muy fácil.
          </p>
        </div>

        {/* Grid de Pasos */}
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Línea conectora entre pasos, solo visible en desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block" />

          {STEPS.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card/90 to-muted/40 dark:from-card dark:via-card/80 dark:to-muted/20 p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50 overflow-hidden"
            >
              {/* Degradado decorativo sutil en la parte superior de cada tarjeta */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Número con texto degradado (Gradient Text) */}
              <span className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background/80 text-5xl font-black bg-gradient-to-br from-primary via-primary/80 to-primary/40 dark:from-primary dark:via-primary/70 dark:to-primary/30 bg-clip-text text-transparent drop-shadow-sm select-none ring-1 ring-border/60">
                {item.step}
              </span>

              {/* Título de la tarjeta */}
              <h3 className="section-subtitle text-lg !font-semibold text-card-foreground capitalize tracking-wide">
                {item.title}
              </h3>

              {/* Descripción */}
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {/* Flecha conectora entre tarjetas (excepto la última) */}
              {index < STEPS.length - 1 && (
                <div className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card text-primary lg:flex">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}