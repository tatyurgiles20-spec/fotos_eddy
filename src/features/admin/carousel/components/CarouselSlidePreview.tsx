"use client";

import Image from "next/image";
import type { ButtonStyle, FontFamily, OverlayLayer, OverlayPosition, OverlayWidth, TextPosition } from "@/types/carousel";
import {
  getSlideBackgroundColor,
  getTextStyle,
  getUnderlineColor,
  getTextPanelStyle,
  getOverlayContainerStyle,
  getOverlayZIndex,
  getTitleZIndex,
} from "@/lib/carousel-style";

const BUTTON_STYLES: Record<ButtonStyle, string> = {
  primary: "bg-white text-black hover:bg-white/90",
  secondary: "bg-black/40 text-white border border-white/70 backdrop-blur-sm hover:bg-black/55",
  outline: "border border-white text-white hover:bg-white/10",
  ghost: "text-white underline underline-offset-4",
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
  textBackgroundColor: string | null;
  textPosition: TextPosition;
  showUnderline: boolean;
  overlayImageUrl: string | null;
  overlayPosition: OverlayPosition;
  overlayLayer: OverlayLayer;
  overlayWidth: OverlayWidth;
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
  textBackgroundColor,
  textPosition,
  showUnderline,
  overlayImageUrl,
  overlayPosition,
  overlayLayer,
  overlayWidth,
}: Props) {
  const fontStyle = fontFamily !== "auto" ? { fontFamily: FONT_VARS[fontFamily] } : undefined;
  const titleStyle = getTextStyle(titleColor, titleGradient, fontStyle);
  const subtitleStyle = getTextStyle(subtitleColor, subtitleGradient, fontStyle);
  const underlineColor = getUnderlineColor(titleColor, titleGradient);
  const isTitleAuto = !titleColor && !titleGradient;
  const isSubtitleAuto = !subtitleColor && !subtitleGradient;
  const textPanelStyle = getTextPanelStyle(textBackgroundColor);

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">Vista previa</p>
      <div
        className="relative h-[180px] w-full overflow-hidden rounded-2xl border border-border shadow-elevated sm:h-[240px]"
        style={{ backgroundColor: imageUrl ? getSlideBackgroundColor(backgroundColor) : undefined }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText || "Vista previa"}
            fill
            sizes="380px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-card text-sm text-muted-foreground">
            Elige una imagen para ver la vista previa
          </div>
        )}

        {imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/10" />}

        {imageUrl && (title || subtitle || buttonText) && (
          <div className={`absolute inset-0 flex flex-col gap-2 p-4 ${POSITION_CLASSES[textPosition]}`}>
            <div className={textPanelStyle ? "rounded-lg px-2.5 py-2" : undefined} style={textPanelStyle}>
              {overlayImageUrl && (
                <div
                  style={{
                    ...getOverlayContainerStyle(overlayPosition, overlayWidth),
                    zIndex: getOverlayZIndex(overlayLayer),
                    width: Math.min(
                      80,
                      overlayWidth === "large" ? 80 : overlayWidth === "medium" ? 55 : 35
                    ), // escala reducida para la miniatura de preview
                  }}
                >
                  <img src={overlayImageUrl} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              )}
              {title && (
                <div style={{ zIndex: getTitleZIndex(overlayLayer), position: "relative" }}>
                  <h2 className={`text-lg font-bold ${isTitleAuto ? "text-white" : ""}`} style={titleStyle}>
                    {title}
                  </h2>
                  {showUnderline && (
                    <div className="mt-1 h-1.5 w-16 rounded-full opacity-80" style={{ backgroundColor: underlineColor ?? "currentColor" }} />
                  )}
                </div>
              )}
              {subtitle && (
                <p className={`max-w-xs text-xs whitespace-pre-line ${isSubtitleAuto ? "text-white/85" : ""}`} style={subtitleStyle}>
                  {subtitle}
                </p>
              )}
            </div>
            {buttonText && (
              <span
                className={`pointer-events-none inline-block rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm ${BUTTON_STYLES[buttonStyle]}`}
              >
                {buttonText}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}