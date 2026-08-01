"use client";

import { useState } from "react";
import type { CarouselSlide } from "@/types/carousel";
import { useCarouselSlides } from "../hooks/useCarouselSlides";
import { CarouselSlideForm } from "../components/CarouselSlideForm";
import { CarouselSlideList } from "../components/CarouselSlideList";

export function CarouselManagerView() {
  const { slides, loading, createSlide, updateSlide, deleteSlide, moveSlide } =
    useCarouselSlides("promo");
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      <CarouselSlideForm
        editingSlide={editingSlide}
        onCreate={createSlide}
        onUpdate={async (id, input) => {
          await updateSlide(id, input);
          setEditingSlide(null);
        }}
        onCancelEdit={() => setEditingSlide(null)}
      />

      <div>
        <p className="mb-3 font-display text-lg font-bold">Slides del carrusel promocional</p>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : (
          <CarouselSlideList
            slides={slides}
            onEdit={setEditingSlide}
            onDelete={deleteSlide}
            onMove={moveSlide}
            onToggleActive={(slide) => updateSlide(slide.id, { active: !slide.active })}
          />
        )}
      </div>
    </div>
  );
}