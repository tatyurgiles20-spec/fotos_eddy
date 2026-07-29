"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type PromoSlide = {
  id: string;
  imageUrl: string;
  alt: string;
};

const DEFAULT_SLIDES: PromoSlide[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1600&auto=format&fit=crop",
    alt: "Fotos publicitarias",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1495805442109-bf1cf975750b?q=80&w=1600&auto=format&fit=crop",
    alt: "Sesiones fotográficas",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop",
    alt: "Productos personalizados",
  },
];

interface PromoCarouselProps {
  slides?: PromoSlide[];
  autoPlayInterval?: number;
}

export function PromoCarousel({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 5000,
}: PromoCarouselProps) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
        <div className="relative h-[260px] w-full sm:h-[360px] md:h-[440px]">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            {/* Flechas */}
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-background group-hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-background group-hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-primary-foreground" : "w-2 bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}