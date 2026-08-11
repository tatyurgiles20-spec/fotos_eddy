import { createClient } from "@/lib/supabase/server";
import { mapCarouselSlideRow, type CarouselSlide, type CarouselSlideRow } from "@/types/carousel";

/**
 * Trae los slides activos de un carrusel, ordenados por posición.
 * Se llama SIEMPRE desde un Server Component (nunca desde el cliente),
 * para que el HTML inicial ya traiga las imágenes, alt, título y botón
 * y sea indexable por Google sin depender de JS.
 */
export async function getCarouselSlides(carouselKey: string): Promise<CarouselSlide[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("carousel_slides")
.select(
  "id, carousel_key, image_id, alt_text, title, subtitle, button_text, button_href, button_style, font_family, title_color, subtitle_color, title_gradient, subtitle_gradient, background_color, text_background_color, overlay_image_id, overlay_position, overlay_layer, overlay_width, text_position, show_underline, position, active, images!carousel_slides_image_id_fkey ( direct_url ), overlay_image:images!carousel_slides_overlay_image_id_fkey ( direct_url )"
)
    .eq("carousel_key", carouselKey)
    .eq("active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error(`Error al obtener slides del carrusel "${carouselKey}":`, error.message);
    return [];
  }

  return ((data ?? []) as unknown as CarouselSlideRow[]).map(mapCarouselSlideRow);
}