"use client";

import Image from "next/image";
import type { ButtonStyle, FontFamily, OverlayLayer, OverlayPosition, OverlayWidth, TextPosition } from "@/types/carousel";
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

const BUTTON_STYLES: Record<ButtonStyle, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-foreground/10 text-foreground border border-foreground/20",
  outline: "border border-foreground/70 text-foreground",
  ghost: "text-foreground underline underline-offset-4",
  gradient: "text-white",
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

type Props = {
  imageUrl: string;
  altText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonStyle: ButtonStyle;
  fontFamily: FontFamily;
  titleColor: string | null;
  subtitleColor: string | null;
  titleGradient: string | null;
  subtitleGradient: string | null;
  backgroundColor: string | null;
  backgroundGradient: string | null;
  textBackgroundColor: string | null;
  textBackgroundGradient: string | null;
  textPosition: TextPosition;
  showUnderline: boolean;
  overlayImageUrl: string | null;
  overlayPosition: OverlayPosition;
  overlayLayer: OverlayLayer;
  overlayWidth: OverlayWidth;
  buttonGradient: string | null;
};

export function CarouselSlidePreview({
  imageUrl,
  altText,
  title,
  subtitle,
  buttonText,
  buttonStyle,
  fontFamily,
  titleColor,
  subtitleColor,
  titleGradient,
  subtitleGradient,
  backgroundColor,
  backgroundGradient,
  textBackgroundColor,
  textBackgroundGradient,
  textPosition,
  showUnderline,
  overlayImageUrl,
  overlayPosition,
  overlayLayer,
  overlayWidth,
  buttonGradient,
}: Props) {
  const fontStyle = fontFamily !== "auto" ? { fontFamily: FONT_VARS[fontFamily] } : undefined;
  const titleStyle = getTextStyle(titleColor, titleGradient, fontStyle);
  const subtitleStyle = getTextStyle(subtitleColor, subtitleGradient, fontStyle);
  const underlineColor = getUnderlineColor(titleColor, titleGradient);
  const isTitleAuto = !titleColor && !titleGradient;
  const isSubtitleAuto = !subtitleColor && !subtitleGradient;
  const panelStyle = getPanelStyle(textBackgroundColor, textBackgroundGradient);
  const imageBoxStyle = getSlideBackgroundStyle(backgroundColor, backgroundGradient);
  const buttonGradientStyle = buttonStyle === "gradient" ? getButtonGradientStyle(buttonGradient) : undefined;

  const overlayScale =
    overlayWidth === "large" ? 80 : overlayWidth === "medium" ? 55 : 35;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">Vista previa</p>
      <div className="overflow-hidden rounded-2xl border border-border shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:h-[200px]">
          {/* Imagen — arriba en móvil, derecha en escritorio (igual que en el sitio real) */}
          <div className="relative order-1 h-32 w-full overflow-hidden sm:order-2 sm:h-full sm:flex-1" style={imageBoxStyle}>
            {imageUrl ? (
              <Image src={imageUrl} alt={altText || "Vista previa"} fill sizes="380px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-card text-xs text-muted-foreground">
                Elige una imagen
              </div>
            )}
          </div>

          {/* Panel de texto — abajo en móvil, izquierda en escritorio */}
          <div
            className={`order-2 flex w-full flex-col justify-center p-3 sm:order-1 sm:w-[42%] sm:p-4 ${POSITION_CLASSES[textPosition]}`}
            style={panelStyle}
          >
            {overlayImageUrl && (
              <div
                style={{
                  ...getOverlayContainerStyle(overlayPosition, overlayWidth),
                  zIndex: getOverlayZIndex(overlayLayer),
                  width: Math.min(60, overlayScale),
                }}
              >
                <img src={overlayImageUrl} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            )}

            {title && (
              <div style={{ zIndex: getTitleZIndex(overlayLayer), position: "relative" }}>
                <h2 className={`text-base font-bold leading-tight ${isTitleAuto ? "text-foreground" : ""}`} style={titleStyle}>
                  {title}
                </h2>
                {showUnderline && (
                  <div
                    className="mt-1 h-1.5 w-14 rounded-full opacity-80"
                    style={{ backgroundColor: underlineColor ?? "currentColor" }}
                  />
                )}
              </div>
            )}

            {subtitle && (
              <p className={`mt-1.5 text-xs leading-snug whitespace-pre-line ${isSubtitleAuto ? "text-muted-foreground" : ""}`} style={subtitleStyle}>
                {subtitle}
              </p>
            )}

            {buttonText && (
              <span
                className={`pointer-events-none mt-2 inline-block w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${BUTTON_STYLES[buttonStyle]}`}
                style={buttonGradientStyle}
              >
                {buttonText}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}