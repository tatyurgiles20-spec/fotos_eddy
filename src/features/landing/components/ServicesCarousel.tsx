"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CategoryHighlight } from "@/types/category-highlight";

type ServiceSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
};

function toSlides(highlights: CategoryHighlight[]): ServiceSlide[] {
  return highlights
    .filter((h) => h.product_categories && h.images)
    .map((h) => ({
      id: h.id,
      title: h.product_categories!.name,
      description: h.description ?? "",
      imageUrl: h.images!.direct_url,
      href: `${h.target_type === "service" ? "/servicios" : "/productos"}?categoria=${h.product_categories!.slug}`,
    }));
}

// Calcula la distancia circular más corta entre el índice actual y la tarjeta objetivo
function getCircularOffset(index: number, current: number, length: number) {
  let diff = index - current;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

interface ServicesCarouselProps {
  highlights: CategoryHighlight[];
  title?: string;
  autoPlayInterval?: number;
}

export function ServicesCarousel({
  highlights,
  title = "Explora nuestras categorías",
  autoPlayInterval = 3500,
}: ServicesCarouselProps) {
  const router = useRouter();
  const services = toSlides(highlights);
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

  useEffect(() => {
    if (isPaused || length <= 1) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, goNext, length]);

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

  const handleCardClick = (index: number, offset: number, href: string) => {
    if (offset === 0) {
      router.push(href);
    } else {
      goTo(index);
    }
  };

  if (length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 text-center">
        <h3 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
          {title}
        </h3>
      </div>

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
          const isVisible = absOffset <= 1;
          const translateX = offset * 75;
          const scale = offset === 0 ? 1 : 0.82;
          const rotateY = offset * -35;
          const zIndex = 10 - absOffset;
          const opacity = !isVisible ? 0 : offset === 0 ? 1 : 0.7;

          return (
            <div
              key={service.id}
              onClick={() => handleCardClick(index, offset, service.href)}
              style={{
                transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                pointerEvents: isVisible ? "auto" : "none",
                transition:
                  "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, z-index 0.6s, box-shadow 0.6s ease",
              }}
              className={`absolute aspect-[3/4] w-48 sm:w-60 lg:w-72 cursor-pointer select-none rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-500 ${
                offset === 0
                  ? "shadow-[0_30px_60px_-10px_rgba(0,0,0,0.70)] dark:shadow-[0_0_50px_rgba(255,255,255,0.45)]"
                  : "shadow-[0_20px_40px_-10px_rgba(0,0,0,0.50)] dark:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
              }`}
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
                <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

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