import Link from "next/link";
import { ArrowRight, Frame as FrameIcon } from "lucide-react";
import type { Frame } from "@/types/frame";

type Props = {
  frame: Frame | null;
};

export function FrameTeaserSection({ frame }: Props) {
  if (!frame) return null;

  return (
    <section id="marcos" className="section-spacing scroll-mt-20 relative bg-background overflow-hidden">
      {/* Blobs decorativos de fondo, mismo patrón que las demás secciones */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 max-w-5xl relative">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-10">
          <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-2">
            <FrameIcon className="h-4 w-4" />
            Vista previa gratis
          </span>
          <h2 className="section-title !text-5xl sm:!text-6xl md:!text-7xl text-foreground">
            Marcos y Cuadros
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
        </div>

        {/* Contenido de la sección con SOMBRA VISIBLE EN AMBOS MODOS */}
        <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:text-left rounded-2xl border border-border/60 border-l-4 border-l-primary bg-card p-6 sm:p-8 shadow-xl dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8)] dark:border-border transition-shadow duration-300">
          <div className="w-40 shrink-0 sm:w-52">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60 shadow-soft card-hover">
              <img src={frame.directUrl} alt={frame.name} className="h-full w-full object-contain" />
            </div>
          </div>

          <div>
            <p className="section-subtitle text-2xl !font-semibold sm:text-3xl text-card-foreground">
              Prueba tus fotos con un marco
            </p>
            <p className="mt-2 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
              Sube tu foto, elige uno de nuestros marcos y personalízala como quieras.
              Explora diferentes estilos y descubre cómo podría quedar tu recuerdo antes de
              llevarlo a un producto personalizado. ¡Es fácil, rápido y gratuito!
            </p>
            <Link
              href="/marcos"
              className="btn mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-colored transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:bg-primary-hover active:translate-y-0"
            >
              Probar marcos ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}