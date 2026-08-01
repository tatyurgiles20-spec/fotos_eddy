"use client";

import Image from "next/image";
import type { ButtonStyle, FontFamily, TextPosition } from "@/types/carousel";

const BUTTON_STYLES: Record<ButtonStyle, string> = {
  primary: "bg-white text-black hover:bg-white/90",
  secondary: "bg-black/40 text-white border border-white/70 backdrop-blur-sm hover:bg-black/55",
  outline: "border border-white text-white hover:bg-white/10",
  ghost: "text-white underline underline-offset-4",
};

// Se aplican con `style`, no con clases de Tailwind: así no depende de
// que el JIT detecte una clase armada dinámicamente, y funciona siempre
// que la variable CSS del font (--font-sora, --font-inter, --font-caveat)
// esté cargada en el layout.
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
}: Props) {
  const fontStyle = fontFamily !== "auto" ? { fontFamily: FONT_VARS[fontFamily] } : undefined;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">Vista previa</p>
      <div className="relative h-[160px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-elevated sm:h-[220px]">
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

        {imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />}

        {imageUrl && (title || subtitle || buttonText) && (
          <div className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 ${POSITION_CLASSES[textPosition]}`}>
            {title && (
              <h2
                className={`text-lg font-bold ${titleColor ? "" : "text-white"}`}
                style={{ ...fontStyle, color: titleColor ?? undefined }}
              >
                {title}
              </h2>
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