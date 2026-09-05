"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CarouselSlide, FontFamily, TextPosition } from "@/types/carousel";
import {
  getSlideBackgroundStyle,
  getTextStyle,
  getUnderlineColor,
  getPanelStyle,
  getButtonGradientStyle,
  getOverlayContainerStyle,
  getOverlayZIndex,
  getTitleZIndex,
} from "@/lib/carousel-style";

interface PromoCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
}

const BUTTON_STYLES: Record<CarouselSlide["buttonStyle"], string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-colored hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300",
  secondary:
    "bg-foreground/10 text-foreground border border-foreground/20 hover:bg-foreground/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300",
  outline:
    "border-2 border-foreground/70 text-foreground hover:bg-foreground hover:text-background hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300",
  ghost: "text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity",
  gradient: "text-white shadow-colored hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300",
};

const FONT_VARS: Record<Exclude<FontFamily, "auto">, string> = {
  display: "var(--font-sora)",
  body: "var(--font-inter)",
  accent: "var(--font-caveat)",
  poppins: "var(--font-poppins)",
  montserrat: "var(--font-montserrat)",
  playlist: "var(--font-playlist)",
  oswald: "var(--font-oswald)",
  playfair: "var(--font-playfair)",
  bebas: "var(--font-bebas)",
  spacegrotesk: "var(--font-space-grotesk)",
  merriweather: "var(--font-merriweather)",
};

const POSITION_CLASSES: Record<TextPosition, string> = {
  "bottom-left": "items-start text-left justify-end",
  "bottom-center": "items-center text-center justify-end",
  "bottom-right": "items-end text-right justify-end",
  "middle-left": "items-start text-left justify-center",
  "middle-center": "items-center text-center justify-center",
  "middle-right": "items-end text-right justify-center",
};

export function PromoCarousel({ slides, autoPlayInterval = 5000 }: PromoCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, slides.length, autoPlayInterval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const SWIPE_THRESHOLD = 50;
    if (touchDeltaX.current > SWIPE_THRESHOLD) goTo(index - 1);
    else if (touchDeltaX.current < -SWIPE_THRESHOLD) goTo(index + 1);
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  if (slides.length === 0) return null;

  const slide = slides[index];
  const hasButton = Boolean(slide.buttonText?.trim() && slide.buttonHref?.trim());
  const isExternal = hasButton ? !slide.buttonHref!.startsWith("/") : false;
  const buttonClassName = `relative z-10 inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-bold sm:text-base transition-all duration-300 ${
    BUTTON_STYLES[slide.buttonStyle] ?? BUTTON_STYLES.primary
  }`;
  const buttonGradientStyle =
    slide.buttonStyle === "gradient" ? getButtonGradientStyle(slide.buttonGradient) : undefined;
  const fontStyle = slide.fontFamily !== "auto" ? { fontFamily: FONT_VARS[slide.fontFamily] } : undefined;

  const positionClass = POSITION_CLASSES[slide.textPosition] ?? POSITION_CLASSES["bottom-left"];
  // La posición configurada en el admin solo aplica desde sm: en adelante;
  // en móvil siempre queda centrado (ver className del panel más abajo).
  const positionClassDesktopOnly = positionClass
    .split(" ")
    .map((cls) => `sm:${cls}`)
    .join(" ");

  const underlineAlignDesktop =
    slide.textPosition.endsWith("center")
      ? "sm:mx-auto"
      : slide.textPosition.endsWith("right")
      ? "sm:ml-auto sm:mr-0"
      : "sm:mr-auto sm:ml-0";

  const titleStyle = getTextStyle(slide.titleColor, slide.titleGradient, fontStyle);
  const subtitleStyle = getTextStyle(slide.subtitleColor, slide.subtitleGradient, fontStyle);
  const underlineColor = getUnderlineColor(slide.titleColor, slide.titleGradient);
  const isTitleAuto = !slide.titleColor && !slide.titleGradient;
  const isSubtitleAuto = !slide.subtitleColor && !slide.subtitleGradient;

  const panelStyle = getPanelStyle(slide.textBackgroundColor, slide.textBackgroundGradient);
  const imageBoxStyle = getSlideBackgroundStyle(slide.backgroundColor, slide.backgroundGradient);

  const overlayContainerStyle = slide.overlayImageUrl
    ? getOverlayContainerStyle(slide.overlayPosition, slide.overlayWidth)
    : undefined;
  const overlayZ = getOverlayZIndex(slide.overlayLayer);
  const titleZ = getTitleZIndex(slide.overlayLayer);

  // El orden base (sin sm:) queda fijo: imagen arriba (order-1), panel abajo
  // (order-2) — así el móvil nunca cambia. Solo el orden en escritorio (sm:)
  // varía según qué lado eligió el admin para la imagen.
  const imageOrderClass = slide.imagePosition === "left" ? "sm:order-1" : "sm:order-2";
  const panelOrderClass = slide.imagePosition === "left" ? "sm:order-2" : "sm:order-1";

  return (
    <section
      className="relative w-full overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Blobs decorativos de fondo, solo chrome — no tocan contenido del admin */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="group relative mx-auto max-w-7xl">
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-border shadow-elevated ring-1 ring-border/40 sm:flex-row sm:h-[420px] lg:h-[460px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Imagen — siempre arriba en móvil (order-1); en escritorio, el lado
              depende de slide.imagePosition */}
          <div
            className={`relative order-1 h-56 w-full overflow-hidden ${imageOrderClass} sm:h-full sm:flex-1`}
            style={imageBoxStyle}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.altText}
              fill
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Panel de texto — siempre abajo en móvil (order-2); en escritorio,
              el lado depende de slide.imagePosition. Altura mínima fija en
              móvil para que no "salte" de tamaño entre slides con/sin botón o
              título largo. Centrado forzado en móvil; la posición real elegida
              por el admin solo entra en vigor desde sm: en adelante. */}
          <div
            className={`order-2 flex min-h-[260px] w-full flex-col items-center justify-center p-6 text-center ${panelOrderClass} sm:min-h-0 sm:w-[38%] sm:p-8 sm:text-left lg:w-[34%] lg:p-10 ${positionClassDesktopOnly}`}
            style={panelStyle}
          >
            {slide.overlayImageUrl && (
              <div style={{ ...overlayContainerStyle, zIndex: overlayZ }}>
                <img
                  src={slide.overlayImageUrl}
                  alt=""
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            )}

            {slide.title && (
              <div className="relative max-w-md" style={{ zIndex: titleZ }}>
                <h1
                  className={`text-2xl font-extrabold leading-[1.15] sm:text-3xl lg:text-4xl ${
                    isTitleAuto ? "text-foreground" : ""
                  }`}
                  style={titleStyle}
                >
                  {slide.title}
                </h1>

                {slide.showUnderline && (
                  <div
                    className={`mx-auto mt-2 h-2.5 w-28 sm:w-32 ${underlineAlignDesktop}`}
                    style={{ color: underlineColor }}
                  >
                    <svg viewBox="0 0 250 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-full w-full ${underlineColor ? "" : "text-primary"}`}>
                      <path
                        d="M3 14C50 4 150 3 247 11M15 17C80 9 170 8 230 15"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}

            {slide.subtitle && (
              <p
                className={`mt-3 max-w-sm text-sm leading-relaxed whitespace-pre-line sm:text-base ${
                  isSubtitleAuto ? "text-muted-foreground" : ""
                }`}
                style={subtitleStyle}
              >
                {slide.subtitle}
              </p>
            )}

            {hasButton && (
              <div className="mt-5">
                {isExternal ? (
                  <a href={slide.buttonHref!} target="_blank" rel="noopener noreferrer" className={buttonClassName} style={buttonGradientStyle}>
                    {slide.buttonText}
                  </a>
                ) : (
                  <Link href={slide.buttonHref!} className={buttonClassName} style={buttonGradientStyle}>
                    {slide.buttonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Anterior"
              className="absolute -left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card/90 backdrop-blur text-foreground opacity-0 shadow-soft transition-all duration-300 hover:scale-110 hover:bg-card pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto sm:flex sm:-left-4"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Siguiente"
              className="absolute -right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card/90 backdrop-blur text-foreground opacity-0 shadow-soft transition-all duration-300 hover:scale-110 hover:bg-card pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto sm:flex sm:-right-4"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="mt-3 flex items-center justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === index ? "w-6 bg-primary shadow-colored" : "w-2 bg-border hover:bg-muted-foreground"
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