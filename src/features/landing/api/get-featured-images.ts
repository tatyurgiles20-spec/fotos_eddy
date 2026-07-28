import { createClient } from "@/lib/supabase/server";
import type { ImageItem } from "@/types/image";

export async function getFeaturedImages(sectionKey: string): Promise<ImageItem[]> {
  const supabase = await createClient();

  const { data: section } = await supabase
    .from("sections")
    .select("id")
    .eq("key", sectionKey)
    .maybeSingle();

  if (!section) return [];

  const { data: links } = await supabase
    .from("image_sections")
    .select("image_id, sort_order, images(*)")
    .eq("section_id", section.id)
    .order("sort_order");

  if (!links) return [];

  return links.map((link) => link.images as unknown as ImageItem);
}