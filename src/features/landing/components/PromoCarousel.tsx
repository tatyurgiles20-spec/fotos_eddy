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
  const underlineAlign =
    slide.textPosition.endsWith("center") ? "mx-auto" : slide.textPosition.endsWith("right") ? "ml-auto" : "mr-auto";

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

  return (
    <section
      className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="group relative mx-auto max-w-7xl">
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-border shadow-elevated sm:flex-row sm:h-[420px] lg:h-[460px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Imagen — arriba en móvil (order-1), a la derecha en escritorio (order-2) */}
          <div
            className="relative order-1 h-56 w-full overflow-hidden sm:order-2 sm:h-full sm:flex-1"
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

          {/* Panel de texto — abajo en móvil (order-2), a la izquierda en escritorio (order-1) */}
          <div
            className={`order-2 flex w-full flex-col p-6 sm:order-1 sm:w-[38%] sm:p-8 lg:w-[34%] lg:p-10 ${positionClass}`}
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
                  <div className={`mt-2 h-2.5 w-28 sm:w-32 ${underlineAlign}`} style={{ color: underlineColor }}>
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
              className="absolute -left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground opacity-0 shadow-md transition-all duration-300 hover:scale-110 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto sm:flex sm:-left-4"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Siguiente"
              className="absolute -right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground opacity-0 shadow-md transition-all duration-300 hover:scale-110 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto sm:flex sm:-right-4"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
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