import Image from "next/image";
import { Sparkles, Quote } from "lucide-react";

export function ValuePropsSection() {
  return (
    <section className="section-spacing bg-background relative overflow-hidden">
      {/* Blobs decorativos de fondo */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-10">
          <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-2">
            <Sparkles className="h-4 w-4" />
            Nova Print
          </span>
          <h2 className="section-title !text-5xl sm:!text-6xl md:!text-7xl text-foreground">
            ¿Por qué elegirnos?
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
          <p className="section-subtitle mt-4 text-sm sm:text-base text-muted-foreground">
            Nos aseguramos de que cada recuerdo impreso supere tus expectativas.
          </p>
        </div>

        {/* Layout en 2 columnas: items-stretch asegura misma altura */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Columna 1: Imagen Destacada */}
          <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl border border-border/80 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.65)] dark:shadow-[0_0_50px_rgba(255,255,255,0.35)] transition-shadow duration-300 card-hover">
            <Image
              src="/personalizados.png"
              alt="Productos personalizados de alta calidad"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            {/* Cinta/etiqueta decorativa */}
            <div className="absolute top-4 left-4 rounded-full bg-primary/90 backdrop-blur px-3 py-1 shadow-soft">
              <span className="section-subtitle text-[11px] sm:text-xs font-semibold text-primary-foreground uppercase tracking-wide">
                Hecho a mano
              </span>
            </div>
            {/* Degradado inferior sutil para dar profundidad */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Columna 2: Texto Descriptivo Principal */}
          <div className="lg:col-span-7 flex">
            <div className="relative bg-card rounded-2xl border border-border/80 border-l-4 border-l-primary p-6 sm:p-8 md:p-10 w-full h-full flex flex-col justify-center shadow-[0_30px_60px_-10px_rgba(0,0,0,0.65)] dark:shadow-[0_0_50px_rgba(255,255,255,0.35)] transition-shadow duration-300">
              <Quote className="h-8 w-8 text-primary/25 mb-2" />
              <h3 className="section-subtitle text-xl sm:text-2xl md:text-3xl !font-semibold text-card-foreground mb-4">
                Pasión y detalle en cada producto
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Porque transformamos tus ideas y momentos especiales en recuerdos únicos.
                Trabajamos con dedicación y responsabilidad, brindando un servicio personalizado,
                creativo y de calidad en cada proyecto, cuidando cada detalle para superar las
                expectativas de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}