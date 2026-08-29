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
  const baseSlides = highlights
    .filter((h) => h.product_categories && h.images)
    .map((h) => ({
      id: h.id,
      title: h.product_categories!.name,
      description: h.description ?? "",
      imageUrl: h.images!.direct_url,
      href: `${h.target_type === "service" ? "/servicios" : "/productos"}?categoria=${h.product_categories!.slug}`,
    }));

  if (baseSlides.length === 0) return [];

  let extended = [...baseSlides];
  while (extended.length < 5) {
    extended = [
      ...extended,
      ...baseSlides.map((item, idx) => ({
        ...item,
        id: `${item.id}-dup-${extended.length + idx}`,
      })),
    ];
  }
  return extended;
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

  // Detectamos si la pantalla es de escritorio/tablet para ajustar animaciones dinámicas
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const visibleOffsets = [-2, -1, 0, 1, 2];

  return (
    <section className="mx-auto max-w-7xl px-2 sm:px-6 py-12 overflow-x-clip">
      <div className="mb-10 text-center">
        <h3 className="tag-handwritten !text-3xl sm:!text-4xl md:!text-5xl font-bold tracking-wide text-foreground">
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
        {visibleOffsets.map((offset) => {
          const serviceIndex = ((currentIndex + offset) % length + length) % length;
          const service = services[serviceIndex];
          const absOffset = Math.abs(offset);

          // Si es móvil y la posición es ±2, la ocultamos completamente
          const isHiddenOnMobile = isMobile && absOffset === 2;

          // Separación responsive
          const stepPercent = isMobile ? 65 : 85;
          const translateXPercent = offset * stepPercent;

          const scale = offset === 0 ? 1 : absOffset === 1 ? (isMobile ? 0.75 : 0.8) : 0.62;
          const rotateY = offset * -18;
          const zIndex = 10 - absOffset;

          // Opacidad 0 si está oculta en móvil
          const opacity = isHiddenOnMobile
            ? 0
            : offset === 0
            ? 1
            : absOffset === 1
            ? 0.85
            : 0.55;

          const boxShadow =
            offset === 0
              ? "0 20px 40px -10px rgba(0,0,0,0.6)"
              : absOffset === 1
              ? "0 15px 30px -10px rgba(0,0,0,0.4)"
              : "0 10px 20px -5px rgba(0,0,0,0.25)";

          return (
            <div
              key={`${service.id}-pos-${offset}`}
              onClick={() => handleCardClick(serviceIndex, offset, service.href)}
              style={{
                transform: `translateX(${translateXPercent}%) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                boxShadow,
                pointerEvents: isHiddenOnMobile ? "none" : "auto",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform, opacity",
              }}
              className="absolute aspect-[3/4] w-36 sm:w-40 lg:w-52 cursor-pointer select-none rounded-2xl border border-border/80 bg-card overflow-hidden"
            >
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 208px"
                className="pointer-events-none object-cover transition-transform duration-700 ease-out"
                priority={offset === 0}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div
                style={{
                  opacity: offset === 0 ? 1 : 0,
                  transform: offset === 0 ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
                className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-5"
              >
                <h4 className="font-display text-xs sm:text-base lg:text-lg font-bold text-white">
                  {service.title}
                </h4>
                <p className="mt-1 text-[10px] sm:text-sm text-white/80 line-clamp-2">
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
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
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