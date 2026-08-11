"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CarouselSlide, FontFamily, TextPosition } from "@/types/carousel";
import {
  getSlideBackgroundColor,
  getTextStyle,
  getUnderlineColor,
  getTextPanelStyle,
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
    "bg-black/40 text-white border border-white/25 backdrop-blur-xl hover:bg-black/60 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0 shadow-lg transition-all duration-300",
  outline:
    "border-2 border-white/80 text-white backdrop-blur-md hover:bg-white hover:text-foreground hover:border-white hover:-translate-y-0.5 active:translate-y-0 shadow-md transition-all duration-300",
  ghost:
    "bg-white/10 text-white border border-white/15 backdrop-blur-md hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300",
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

const POSITION_PADDING: Record<TextPosition, string> = {
  "bottom-left": "pb-16 pt-20 lg:pb-24",
  "bottom-center": "pb-16 pt-20 lg:pb-24",
  "bottom-right": "pb-16 pt-20 lg:pb-24",
  "middle-left": "py-10",
  "middle-center": "py-10",
  "middle-right": "py-10",
};

export function PromoCarousel({ slides, autoPlayInterval = 5000 }: PromoCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  if (slides.length === 0) return null;

  return (
    <section
      className="group relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative h-[520px] min-h-[520px] w-full sm:h-[650px] lg:h-[85vh] lg:min-h-[620px]">
        {slides.map((slide, i) => {
          const hasButton = Boolean(slide.buttonText?.trim() && slide.buttonHref?.trim());
          const isExternal = hasButton ? !slide.buttonHref!.startsWith("/") : false;
          const buttonClassName = `relative z-10 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 ${
            BUTTON_STYLES[slide.buttonStyle] ?? BUTTON_STYLES.primary
          }`;
          const fontStyle =
            slide.fontFamily !== "auto" ? { fontFamily: FONT_VARS[slide.fontFamily] } : undefined;
          const positionClass = POSITION_CLASSES[slide.textPosition] ?? POSITION_CLASSES["bottom-left"];
          const paddingClass = POSITION_PADDING[slide.textPosition] ?? POSITION_PADDING["bottom-left"];
          const underlineAlign =
            slide.textPosition.endsWith("center")
              ? "mx-auto"
              : slide.textPosition.endsWith("right")
              ? "ml-auto"
              : "mr-auto";

          const titleStyle = getTextStyle(slide.titleColor, slide.titleGradient, fontStyle);
          const subtitleStyle = getTextStyle(slide.subtitleColor, slide.subtitleGradient, fontStyle);
          const underlineColor = getUnderlineColor(slide.titleColor, slide.titleGradient);
          const isTitleAuto = !slide.titleColor && !slide.titleGradient;
          const isSubtitleAuto = !slide.subtitleColor && !slide.subtitleGradient;
          const textPanelStyle = getTextPanelStyle(slide.textBackgroundColor);
const overlayContainerStyle = slide.overlayImageUrl
  ? getOverlayContainerStyle(slide.overlayPosition, slide.overlayWidth)
  : undefined;
const overlayZ = getOverlayZIndex(slide.overlayLayer);
const titleZ = getTitleZIndex(slide.overlayLayer);
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                i === index ? "opacity-100 scale-100 z-10" : "pointer-events-none opacity-0 scale-105 z-0"
              }`}
              style={{ backgroundColor: getSlideBackgroundColor(slide.backgroundColor) }}
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

              {/* Degradado de contraste general */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 md:bg-gradient-to-r md:from-black/85 md:via-black/40 md:to-transparent" />

              {/* Contenido del Slide */}
              {(slide.title || slide.subtitle || hasButton) && (
                <div className="relative z-10 mx-auto h-full max-w-7xl px-6 sm:px-10 lg:px-12">
                  <div className={`flex h-full flex-col ${paddingClass} ${positionClass}`}>
 
                    {/* Panel de texto: si hay textBackgroundColor, envuelve título+subtítulo */}
<div
  className={textPanelStyle ? "rounded-xl px-4 py-3 sm:px-5 sm:py-4" : undefined}
  style={textPanelStyle}
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
    <div className="relative max-w-3xl" style={{ zIndex: titleZ }}>
      <h1
        className={`text-3xl font-extrabold leading-[1.15] sm:text-5xl lg:text-6xl drop-shadow-lg ${
          isTitleAuto ? "text-white" : ""
        }`}
        style={titleStyle}
      >
        {slide.title}
      </h1>

      {slide.showUnderline && (
        <div className={`mt-2 h-3 w-36 sm:w-48 lg:w-64 ${underlineAlign}`} style={{ color: underlineColor }}>
          <svg
            viewBox="0 0 250 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`h-full w-full ${underlineColor ? "" : "text-primary"}`}
          >
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
      className={`mt-4 max-w-xl text-base leading-relaxed sm:text-lg lg:text-xl drop-shadow whitespace-pre-line ${
        isSubtitleAuto ? "text-white/90" : ""
      }`}
      style={subtitleStyle}
    >
      {slide.subtitle}
    </p>
  )}
</div>
                    {hasButton && (
                      <div className="mt-6 pt-2">
                        {isExternal ? (
                          
                           <a href={slide.buttonHref!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonClassName}
                          >
                            {slide.buttonText}
                          </a>
                        ) : (
                          <Link href={slide.buttonHref!} className={buttonClassName}>
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

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/70 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto sm:left-8"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/70 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto sm:right-8"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2.5 rounded-full border border-white/15 bg-black/50 px-4 py-2 backdrop-blur-md sm:bottom-10 sm:right-12">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}