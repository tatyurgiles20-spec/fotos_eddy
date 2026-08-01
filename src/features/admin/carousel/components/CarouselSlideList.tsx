"use client";

import type { CarouselSlide } from "@/types/carousel";

type Props = {
  slides: CarouselSlide[];
  onEdit: (slide: CarouselSlide) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onToggleActive: (slide: CarouselSlide) => void;
};

export function CarouselSlideList({ slides, onEdit, onDelete, onMove, onToggleActive }: Props) {
  if (slides.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay slides en este carrusel.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
        >
          <img
            src={slide.imageUrl}
            alt={slide.altText}
            className="h-16 w-24 shrink-0 rounded-md object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{slide.title || "(sin título)"}</p>
            <p className="truncate text-xs text-muted-foreground">{slide.altText}</p>
            {slide.buttonText && (
              <p className="mt-1 text-xs text-muted-foreground">
                Botón: "{slide.buttonText}" → {slide.buttonHref} ({slide.buttonStyle})
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => onMove(slide.id, "up")}
              disabled={i === 0}
              aria-label="Subir"
              className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-30"
            >
              ↑
            </button>
            <button
              onClick={() => onMove(slide.id, "down")}
              disabled={i === slides.length - 1}
              aria-label="Bajar"
              className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-30"
            >
              ↓
            </button>
            <button
              onClick={() => onToggleActive(slide)}
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                slide.active
                  ? "border-success text-success"
                  : "border-border text-muted-foreground"
              }`}
            >
              {slide.active ? "Activo" : "Inactivo"}
            </button>
            <button
              onClick={() => onEdit(slide)}
              className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-muted"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(slide.id)}
              className="rounded-md border border-danger px-2 py-1 text-xs font-medium text-danger hover:bg-danger/10"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}