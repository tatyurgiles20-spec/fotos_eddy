import { Sparkles, Heart, Wrench, Target } from "lucide-react";

export function NosotrosSection() {
  return (
    <section id="nosotros" className="section-spacing relative mx-auto max-w-6xl px-6 overflow-hidden">
      {/* Blobs decorativos de fondo, mismo patrón que las demás secciones */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mb-8 sm:mb-10 text-center">
        <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-2">
          <Sparkles className="h-4 w-4" />
          Conócenos
        </span>
        <h3 className="section-title !text-5xl sm:!text-6xl md:!text-7xl text-foreground">
          Nosotros
        </h3>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
        <p className="section-subtitle mt-4 text-sm text-muted-foreground">
          La historia detrás de Nova Print
        </p>
      </div>

      <div className="relative grid gap-6 md:grid-cols-3">
        {/* Tarjeta 1: Quiénes somos */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card/90 to-muted/40 dark:from-card dark:via-card/80 dark:to-muted/20 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Heart className="h-5 w-5" />
          </div>

          <h4 className="section-subtitle text-lg !font-semibold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Quiénes somos
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Somos una empresa apasionada por la personalización y la fotografía.
            Convertimos tus ideas y momentos especiales en productos únicos y recuerdos
            que cuentan historias, transmiten emociones y dejan huella. Trabajamos con
            creatividad, dedicación y responsabilidad para ofrecer productos y servicios de
            calidad, pensados especialmente para cada cliente.
          </p>
        </div>

        {/* Tarjeta 2: Qué hacemos */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card/90 to-muted/40 dark:from-card dark:via-card/80 dark:to-muted/20 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Wrench className="h-5 w-5" />
          </div>

          <h4 className="section-subtitle text-lg !font-semibold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Qué hacemos
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Ofrecemos soluciones creativas de personalización, impresión y fotografía,
            utilizando materiales de calidad y tecnología moderna para transformar ideas y
            momentos especiales en productos y recuerdos únicos. Trabajamos para emprendedores,
            empresas y particulares, adaptándonos a las necesidades de cada cliente y cuidando
            cada detalle en nuestros servicios.
          </p>
        </div>

        {/* Tarjeta 3: Misión y visión */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card/90 to-muted/40 dark:from-card dark:via-card/80 dark:to-muted/20 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Target className="h-5 w-5" />
          </div>

          <h4 className="section-subtitle text-lg !font-semibold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Misión y visión
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Misión:</span>{" "}
            Brindar servicios de personalización y fotografía de calidad, transformando ideas,
            emociones y momentos especiales en productos y recuerdos únicos. Trabajamos con
            creatividad, dedicación y responsabilidad para satisfacer las necesidades de nuestros
            clientes y ofrecerles una experiencia personalizada.
            <br />
            <span className="mt-3 inline-block font-semibold text-foreground">
              Visión:
            </span>{" "}
            Ser una empresa reconocida por su creatividad, calidad e innovación en los servicios
            de personalización y fotografía, creciendo de manera constante y convirtiéndonos
            en una opción de confianza para quienes buscan capturar y conservar sus momentos más especiales.
          </p>
        </div>
      </div>
    </section>
  );
}