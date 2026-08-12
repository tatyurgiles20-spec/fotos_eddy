import type { CSSProperties } from "react";

// Fondo detrás de la imagen. Si el admin no eligió uno, negro por defecto
// (igual que antes, no rompe slides existentes).
export function getSlideBackgroundColor(backgroundColor: string | null): string {
  return backgroundColor?.trim() || "#000000";
}

// "colorA, colorB" guardado en BD -> array de colores limpio.
export function parseGradientColors(gradient: string | null): string[] {
  if (!gradient) return [];
  return gradient.split(",").map((c) => c.trim()).filter(Boolean);
}

// Si hay 2+ colores de degradado los aplica con background-clip;
// si no, cae al color sólido (o automático si es null).
export function getTextStyle(
  solidColor: string | null,
  gradient: string | null,
  extra?: CSSProperties
): CSSProperties {
  const colors = parseGradientColors(gradient);
  if (colors.length >= 2) {
    return {
      ...extra,
      backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    };
  }
  return { ...extra, color: solidColor ?? undefined };
}

// Color del subrayado decorativo: primer color del degradado si existe,
// si no el color sólido, si no undefined (hereda currentColor del tema).
export function getUnderlineColor(solidColor: string | null, gradient: string | null): string | undefined {
  const colors = parseGradientColors(gradient);
  return colors[0] ?? solidColor ?? undefined;
}

// Panel semi-opaco detrás del bloque de texto. null/"" = sin panel (como antes).
export function getTextPanelStyle(textBackgroundColor: string | null): CSSProperties | undefined {
  if (!textBackgroundColor?.trim()) return undefined;
  return {
    backgroundColor: textBackgroundColor,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };
}
export type OverlayPosition = "overlap" | "tight" | "close" | "spaced" | "far";
export type OverlayLayer = "front" | "back";
export type OverlayWidth = "small" | "medium" | "large";

const OVERLAY_SPACING_PX: Record<OverlayPosition, number> = {
  overlap: -12,
  tight: 2,
  close: 12,
  spaced: 24,
  far: 44,
};

const OVERLAY_WIDTH_PX: Record<OverlayWidth, number> = {
  small: 90,
  medium: 150,
  large: 220,
};

export function getOverlayContainerStyle(
  position: OverlayPosition | null,
  width: OverlayWidth | null
): CSSProperties {
  const pos = position ?? "close";
  const w = width ?? "medium";
  return {
    marginBottom: OVERLAY_SPACING_PX[pos],
    width: OVERLAY_WIDTH_PX[w],
    position: "relative",
  };
}

export function getOverlayZIndex(layer: OverlayLayer | null): number {
  return layer === "back" ? 0 : 2;
}

export function getTitleZIndex(layer: OverlayLayer | null): number {
  return layer === "back" ? 1 : 1;
}
export function getSlideBackgroundStyle(
  backgroundColor: string | null,
  backgroundGradient: string | null
): CSSProperties {
  const colors = parseGradientColors(backgroundGradient);
  if (colors.length >= 2) {
    return { backgroundImage: `linear-gradient(135deg, ${colors.join(", ")})` };
  }
  return { backgroundColor: getSlideBackgroundColor(backgroundColor) };
}

export function getButtonGradientStyle(buttonGradient: string | null): CSSProperties | undefined {
  const colors = parseGradientColors(buttonGradient);
  if (colors.length < 2) return undefined;
  return { backgroundImage: `linear-gradient(135deg, ${colors.join(", ")})` };
}