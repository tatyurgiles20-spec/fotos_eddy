import { Sparkles, Expand } from "lucide-react";
import type { ImageItem } from "@/types/image";

export function FeaturedGallery({ images }: { images: ImageItem[] }) {
  if (images.length === 0) return null;

  return (
    <section id="galeria" className="section-spacing relative mx-auto max-w-6xl px-6 overflow-hidden">
      {/* Blobs decorativos de fondo, mismo patrón que las demás secciones */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Div vacío para balancear el grid en pantallas grandes */}
        <div className="hidden sm:block sm:w-1/4" />

        {/* Título y barra centrados */}
        <div className="text-center sm:w-1/2">
          <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-2">
            <Sparkles className="h-4 w-4" />
            Nuestro trabajo
          </span>
          <h2 className="section-title !text-5xl sm:!text-6xl md:!text-7xl text-foreground">
            Galería
          </h2>
          <span className="mt-3 block h-1 w-16 rounded-full bg-primary/70 mx-auto" />
        </div>

        {/* Enlace alineado a la derecha */}
        <div className="text-center sm:text-right sm:w-1/4">
          <a
            href="/galeria"
            className="btn inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium text-primary shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/40"
          >
            Ver todos los álbumes
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square w-full overflow-hidden rounded-lg
                      shadow-[0_10px_25px_rgba(0,0,0,0.20)]
                      hover:shadow-[0_20px_35px_rgba(0,0,0,0.30)]
                      dark:shadow-[0_0_20px_rgba(255,255,255,0.18)]
                      dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
                      hover:-translate-y-1.5 transition-all duration-300"
          >
            <img
              src={image.direct_url}
              alt={image.alt_text ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay con ícono de zoom al hacer hover, solo decorativo */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
              <Expand className="h-6 w-6 text-white drop-shadow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}