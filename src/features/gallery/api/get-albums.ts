import { createClient } from "@/lib/supabase/server";
import type { Album, ImageItem } from "@/types/image";

export type AlbumWithCover = Album & { cover?: ImageItem };

export async function getAlbumsWithCover(): Promise<AlbumWithCover[]> {
  const supabase = await createClient();

  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .order("sort_order");

  if (!albums) return [];

  return Promise.all(
    albums.map(async (album) => {
      const { data: cover } = await supabase
        .from("images")
        .select("*")
        .eq("album_id", album.id)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      return { ...album, cover: cover ?? undefined };
    })
  );
}