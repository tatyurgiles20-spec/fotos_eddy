import { createClient } from "@/lib/supabase/server";
import type { Album, ImageItem } from "@/types/image";

export async function getAlbumWithImages(
  slug: string
): Promise<{ album: Album; images: ImageItem[] } | null> {
  const supabase = await createClient();

  const { data: album } = await supabase
    .from("albums")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!album) return null;

  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("album_id", album.id)
    .order("sort_order");

  return { album, images: images ?? [] };
}