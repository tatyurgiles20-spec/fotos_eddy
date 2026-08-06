export type ButtonStyle = "primary" | "secondary" | "outline" | "ghost";
export type FontFamily = "auto" | "display" | "body" | "accent";
export type TextPosition =
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "middle-left"
  | "middle-center"
  | "middle-right";

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
  titleColor: string | null; // null = automático (hereda el tema)
  subtitleColor: string | null; // null = automático (hereda el tema)
  textPosition: TextPosition;
  showUnderline: boolean;
  position: number;
  active: boolean;
};

// Forma que llega directo de Supabase (snake_case + join con images)
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
  text_position: TextPosition;
  show_underline: boolean;
  position: number;
  active: boolean;
  images: { direct_url: string } | null;
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
    textPosition: row.text_position ?? "bottom-left",
    showUnderline: row.show_underline ?? true,
    position: row.position,
    active: row.active,
  };
}