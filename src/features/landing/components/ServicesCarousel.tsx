"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ServiceSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

const DEFAULT_SERVICES: ServiceSlide[] = [
  {
    id: "1",
    title: "Sesiones fotográficas",
    description: "Estudio, retrato y producto",
    imageUrl:
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Tazas & Regalos",
    description: "Personalizados con tu foto",
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Ropa & Estampados",
    description: "Impresión de alta definición",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Cuadros & Decoración",
    description: "Convierte tus fotos en arte",
    imageUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
  },
];

interface ServicesCarouselProps {
  services?: ServiceSlide[];
  title?: string;
  autoPlayInterval?: number;
}

// Calcula la distancia circular más corta entre el índice actual y la tarjeta objetivo
function getCircularOffset(index: number, current: number, length: number) {
  let diff = index - current;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

export function ServicesCarousel({
  services = DEFAULT_SERVICES,
  title = "Carrusel con los servicios que ofrecemos",
  autoPlayInterval = 3500,
}: ServicesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const length = services.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % length) + length) % length);
    },
    [length]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % length);
  }, [length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + length) % length);
  }, [length]);

  // Autoplay continuo (se pausa al pasar el mouse o tocar)
  useEffect(() => {
    if (isPaused || length <= 1) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, goNext, length]);

  // Manejo de gestos táctiles para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      {/* Escenario 3D */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: "1000px" }}
        className="relative flex h-[320px] sm:h-[380px] lg:h-[420px] w-full items-center justify-center"
      >
        {services.map((service, index) => {
          const offset = getCircularOffset(index, currentIndex, length);
          const absOffset = Math.abs(offset);

          // Máximo 3 visibles: la central (0) y una a cada lado (-1 y 1)
          const isVisible = absOffset <= 1;

          // Separación horizontal (%)
          const translateX = offset * 75;

          // Tamaño y escala
          const scale = offset === 0 ? 1 : 0.82;

          // Rotación 3D Cover Flow tipo libro
          const rotateY = offset * -35;

          // Prioridad de capas (Z-index)
          const zIndex = 10 - absOffset;

          // Opacidad suave
          const opacity = !isVisible ? 0 : offset === 0 ? 1 : 0.7;

          return (
            <div
              key={service.id}
              onClick={() => goTo(index)}
              style={{
                transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                pointerEvents: isVisible ? "auto" : "none",
                transition:
                  "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, z-index 0.6s",
              }}
              className="absolute aspect-[3/4] w-48 sm:w-60 lg:w-72 cursor-pointer select-none overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 192px, (max-width: 1024px) 240px, 288px"
                className="pointer-events-none object-cover"
                priority={offset === 0}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Información de la tarjeta activa */}
              <div
                style={{
                  opacity: offset === 0 ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
                className="pointer-events-none absolute inset-x-0 bottom-0 p-5"
              >
                <h4 className="font-display text-base sm:text-lg font-bold text-white">
                  {service.title}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-white/80">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores inferiores */}
      <div className="mt-8 flex justify-center gap-2">
        {services.map((service, index) => (
          <button
            key={service.id}
            onClick={() => goTo(index)}
            aria-label={`Ir a ${service.title}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-foreground"
                : "w-2 bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}