export type ButtonStyle = "primary" | "secondary" | "outline" | "ghost" | "gradient";
export type FontFamily =
  | "auto"
  | "display"     // Sora — ya la tenías
  | "body"        // Inter — ya la tenías
  | "accent"      // Caveat — ya la tenías
  | "poppins"
  | "montserrat"
  | "playlist"    // cursiva/script — Dancing Script por ahora
  | "oswald"
  | "playfair"
  | "bebas"
  | "spacegrotesk"
  | "merriweather";
export type TextPosition =
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "middle-left"
  | "middle-center"
  | "middle-right";
export type OverlayPosition = "overlap" | "tight" | "close" | "spaced" | "far";
export type OverlayLayer = "front" | "back";
export type OverlayWidth = "small" | "medium" | "large";

export type CarouselSlide = {
  id: string;
  carouselKey: string;
  imageId: string;
  imageUrl: string;
  altText: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonHref: string | null;
  buttonStyle: ButtonStyle;
  fontFamily: FontFamily;
  titleColor: string | null;
  subtitleColor: string | null;
  titleGradient: string | null;
  subtitleGradient: string | null;
  backgroundColor: string | null;
  textBackgroundColor: string | null;
  overlayImageId: string | null;
  overlayImageUrl: string | null;
  overlayPosition: OverlayPosition;
  overlayLayer: OverlayLayer;
  overlayWidth: OverlayWidth;
  textPosition: TextPosition;
  showUnderline: boolean;
  position: number;
  active: boolean;
  backgroundGradient: string | null;
  buttonGradient: string | null;
  textBackgroundGradient: string | null;
    imagePosition: "left" | "right";
};

export type CarouselSlideRow = {
  id: string;
  carousel_key: string;
  image_id: string;
  alt_text: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_href: string | null;
  button_style: ButtonStyle;
  font_family: FontFamily | null;
  title_color: string | null;
  subtitle_color: string | null;
  title_gradient: string | null;
  subtitle_gradient: string | null;
  background_color: string | null;
  text_background_color: string | null;
  overlay_image_id: string | null;
  overlay_position: OverlayPosition | null;
  overlay_layer: OverlayLayer | null;
  overlay_width: OverlayWidth | null;
  text_position: TextPosition;
  show_underline: boolean;
  position: number;
  active: boolean;
  images: { direct_url: string } | null;
  overlay_image: { direct_url: string } | null;
  background_gradient: string | null;
  button_gradient: string | null;
  text_background_gradient: string | null;
    image_position: "left" | "right" | null;
};

export function mapCarouselSlideRow(row: CarouselSlideRow): CarouselSlide {
  return {
    id: row.id,
    carouselKey: row.carousel_key,
    imageId: row.image_id,
    imageUrl: row.images?.direct_url ?? "",
    altText: row.alt_text,
    title: row.title,
    subtitle: row.subtitle,
    buttonText: row.button_text,
    buttonHref: row.button_href,
    buttonStyle: row.button_style ?? "primary",
    fontFamily: row.font_family ?? "auto",
    titleColor: row.title_color ?? null,
    subtitleColor: row.subtitle_color ?? null,
    titleGradient: row.title_gradient ?? null,
    subtitleGradient: row.subtitle_gradient ?? null,
    backgroundColor: row.background_color ?? null,
    textBackgroundColor: row.text_background_color ?? null,
    overlayImageId: row.overlay_image_id ?? null,
    overlayImageUrl: row.overlay_image?.direct_url ?? null,
    overlayPosition: row.overlay_position ?? "close",
    overlayLayer: row.overlay_layer ?? "front",
    overlayWidth: row.overlay_width ?? "medium",
    textPosition: row.text_position ?? "bottom-left",
    showUnderline: row.show_underline ?? true,
    position: row.position,
    active: row.active,
    backgroundGradient: row.background_gradient ?? null,
    buttonGradient: row.button_gradient ?? null,
    textBackgroundGradient: row.text_background_gradient ?? null,
        imagePosition: row.image_position ?? "right",
  };
}