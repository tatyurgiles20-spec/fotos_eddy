"use client";

import { useState } from "react";
import type { CarouselSlide } from "@/types/carousel";
import { useCarouselSlides } from "../hooks/useCarouselSlides";
import { CarouselSlideForm } from "../components/CarouselSlideForm";
import { CarouselSlideList } from "../components/CarouselSlideList";
import { Modal } from "@/components/ui/Modal";

export function CarouselManagerView() {
  const { slides, loading, createSlide, updateSlide, deleteSlide, moveSlide } =
    useCarouselSlides("promo");
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null | undefined>(undefined); // undefined = modal cerrado

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Slides del carrusel promocional</p>
        <button
          onClick={() => setEditingSlide(null)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Agregar slide
        </button>
      </div>

      {editingSlide !== undefined && (
        <Modal onClose={() => setEditingSlide(undefined)} maxWidth="max-w-2xl">
          <CarouselSlideForm
            editingSlide={editingSlide}
            onCreate={async (input) => {
              await createSlide(input);
              setEditingSlide(undefined);
            }}
            onUpdate={async (id, input) => {
              await updateSlide(id, input);
              setEditingSlide(undefined);
            }}
            onCancelEdit={() => setEditingSlide(undefined)}
          />
        </Modal>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <CarouselSlideList
          slides={slides}
          onEdit={(slide) => setEditingSlide(slide)}
          onDelete={deleteSlide}
          onMove={moveSlide}
          onToggleActive={(slide) => updateSlide(slide.id, { active: !slide.active })}
        />
      )}
    </div>
  );
}