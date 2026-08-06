"use client";

import Image from "next/image";
import type { ButtonStyle, FontFamily, TextPosition } from "@/types/carousel";

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

// left/right/center controlan la alineación horizontal; bottom/middle
// controlan si el bloque de texto va pegado abajo o centrado verticalmente.
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
  textPosition: TextPosition;
  showUnderline: boolean;
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
  textPosition,
  showUnderline,
}: Props) {
  const fontStyle = fontFamily !== "auto" ? { fontFamily: FONT_VARS[fontFamily] } : undefined;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">Vista previa</p>
      <div className="relative h-[180px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-elevated sm:h-[240px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText || "Vista previa"}
            fill
            sizes="380px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Elige una imagen para ver la vista previa
          </div>
        )}

        {imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/10" />}

        {imageUrl && (title || subtitle || buttonText) && (
          <div className={`absolute inset-0 flex flex-col gap-2 p-4 ${POSITION_CLASSES[textPosition]}`}>
            {title && (
              <div>
                <h2
                  className={`text-lg font-bold ${titleColor ? "" : "text-white"}`}
                  style={{ ...fontStyle, color: titleColor ?? undefined }}
                >
                  {title}
                </h2>
                {showUnderline && (
                  <div
                    className="mt-1 h-1.5 w-16 rounded-full opacity-80"
                    style={{ backgroundColor: titleColor ?? "currentColor", color: titleColor ?? undefined }}
                  />
                )}
              </div>
            )}
            {subtitle && (
              <p
                className={`max-w-xs text-xs ${subtitleColor ? "" : "text-white/85"}`}
                style={{ ...fontStyle, color: subtitleColor ?? undefined }}
              >
                {subtitle}
              </p>
            )}
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