"use client";

import { useCallback, useEffect, useState } from "react";
import type { ButtonStyle, CarouselSlide, FontFamily, TextPosition } from "@/types/carousel";

export type CarouselSlideInput = {
  image_id: string;
  alt_text: string;
  title?: string | null;
  subtitle?: string | null;
  button_text?: string | null;
  button_href?: string | null;
  button_style?: ButtonStyle;
  font_family?: FontFamily | null;
  title_color?: string | null;
  subtitle_color?: string | null;
  text_position?: TextPosition;
  show_underline?: boolean;
  position?: number;
  active?: boolean;
};

export function useCarouselSlides(carouselKey: string) {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/carousel-slides?carousel_key=${carouselKey}`);
    const { data } = await res.json();
    setSlides(data ?? []);
    setLoading(false);
  }, [carouselKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSlide = async (input: CarouselSlideInput) => {
    const res = await fetch("/api/carousel-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carousel_key: carouselKey, ...input }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const updateSlide = async (id: string, input: Partial<CarouselSlideInput>) => {
    const res = await fetch(`/api/carousel-slides/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteSlide = async (id: string) => {
    const res = await fetch(`/api/carousel-slides/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  // Intercambia la posición con el vecino de arriba/abajo en la lista actual
  const moveSlide = async (id: string, direction: "up" | "down") => {
    const index = slides.findIndex((s) => s.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= slides.length) return;

    const current = slides[index];
    const target = slides[targetIndex];

    await Promise.all([
      updateSlide(current.id, { position: target.position }),
      updateSlide(target.id, { position: current.position }),
    ]);
  };

  return { slides, loading, createSlide, updateSlide, deleteSlide, moveSlide, refresh };
}