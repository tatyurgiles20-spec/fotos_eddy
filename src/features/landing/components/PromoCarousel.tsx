"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CarouselSlide, FontFamily, TextPosition } from "@/types/carousel";

interface PromoCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
}

const BUTTON_STYLES: Record<CarouselSlide["buttonStyle"], string> = {
  primary:
    "bg-white text-black hover:bg-white/90 shadow-lg hover:-translate-y-1 active:translate-y-0",
  secondary:
    "bg-black/50 text-white border border-white/60 backdrop-blur-md hover:bg-black/70 hover:border-white hover:-translate-y-1 active:translate-y-0",
  outline:
    "border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm hover:-translate-y-1 active:translate-y-0",
  ghost:
    "text-white underline underline-offset-8 decoration-white/70 hover:decoration-white",
};

const FONT_VARS: Record<Exclude<FontFamily, "auto">, string> = {
  display: "var(--font-sora)",
  body: "var(--font-inter)",
  accent: "var(--font-caveat)",
};

const POSITION_CLASSES: Record<TextPosition, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export function PromoCarousel({
  slides,
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

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Altura de Hero: 85vh en escritorio (mínimo 600px), 520px en móvil */}
      <div className="relative h-[520px] min-h-[520px] w-full sm:h-[650px] lg:h-[85vh] lg:min-h-[620px]">
        {slides.map((slide, i) => {
          const hasButton = Boolean(slide.buttonText && slide.buttonHref);
          const isExternal = hasButton
            ? !slide.buttonHref!.startsWith("/")
            : false;
          const buttonClassName = `inline-flex items-center justify-center rounded-2xl px-8 py-3.5 text-base font-bold transition-all duration-300 ${
            BUTTON_STYLES[slide.buttonStyle] ?? BUTTON_STYLES.primary
          }`;
          const fontStyle =
            slide.fontFamily !== "auto"
              ? { fontFamily: FONT_VARS[slide.fontFamily] }
              : undefined;
          const positionClass =
            POSITION_CLASSES[slide.textPosition] ?? POSITION_CLASSES.left;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                i === index
                  ? "opacity-100 scale-100 z-10"
                  : "pointer-events-none opacity-0 scale-105 z-0"
              }`}
            >
              {/* Imagen principal */}
              <Image
                src={slide.imageUrl}
                alt={slide.altText}
                fill
                sizes="100vw"
                className="object-cover object-center brightness-95"
                priority={i === 0}
              />

              {/* Degradado progresivo premium para legibilidad de texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 md:bg-gradient-to-r md:from-black/85 md:via-black/40 md:to-transparent" />

              {/* Contenido del Slide */}
              {(slide.title || slide.subtitle || hasButton) && (
                <div className="mx-auto h-full max-w-7xl px-6 sm:px-10 lg:px-12">
                  <div
                    className={`flex h-full flex-col justify-end pb-16 pt-20 lg:pb-24 ${positionClass}`}
                  >
                    {/* Badge destacado decorativo */}
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-white">
                        Destacado
                      </span>
                    </div>

                    {/* Título con subrayado estilizado */}
                    {slide.title && (
                      <div className="relative max-w-3xl">
                        <h1
                          className={`font-display text-3xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl drop-shadow-lg ${
                            slide.titleColor ? "" : "text-white"
                          }`}
                          style={{
                            ...fontStyle,
                            color: slide.titleColor ?? undefined,
                          }}
                        >
                          {slide.title}
                        </h1>

                        {/* Subrayado decorativo SVG bajo el título */}
                        <div
                          className={`mt-2 h-3 w-36 sm:w-48 lg:w-64 ${
                            slide.textPosition === "center"
                              ? "mx-auto"
                              : slide.textPosition === "right"
                              ? "ml-auto"
                              : "mr-auto"
                          }`}
                        >
                          <svg
                            viewBox="0 0 250 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-full w-full text-primary"
                          >
                            <path
                              d="M3 14C50 4 150 3 247 11M15 17C80 9 170 8 230 15"
                              stroke="currentColor"
                              strokeWidth="5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Subtítulo */}
                    {slide.subtitle && (
                      <p
                        className={`mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl drop-shadow ${
                          slide.subtitleColor ? "" : "text-white/90"
                        }`}
                        style={{
                          ...fontStyle,
                          color: slide.subtitleColor ?? undefined,
                        }}
                      >
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Botón Call to Action */}
                    {hasButton && (
                      <div className="mt-6 pt-2">
                        {isExternal ? (
                          <a
                            href={slide.buttonHref!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonClassName}
                          >
                            {slide.buttonText}
                          </a>
                        ) : (
                          <Link
                            href={slide.buttonHref!}
                            className={buttonClassName}
                          >
                            {slide.buttonText}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controles del Hero Carrusel */}
      {slides.length > 1 && (
        <>
          {/* Flecha Izquierda */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/70 group-hover:opacity-100 sm:left-8"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Flecha Derecha */}
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/70 group-hover:opacity-100 sm:right-8"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Píldora con los Indicadores de Páginas */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2.5 rounded-full border border-white/15 bg-black/50 px-4 py-2 backdrop-blur-md sm:bottom-10 sm:right-12">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}