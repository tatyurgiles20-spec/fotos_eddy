import { createClient } from "@/lib/supabase/server";
import { mapFrameRow, type Frame, type FrameRow } from "@/types/frame";

export async function getFrames(): Promise<Frame[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("frames")
    .select("id, name, drive_file_id, direct_url, width, height, is_active, sort_order, created_at, updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error cargando marcos:", error.message);
    return [];
  }

  return ((data ?? []) as FrameRow[]).map(mapFrameRow);
}
export async function getRandomFrame(): Promise<Frame | null> {
  const frames = await getFrames();
  if (frames.length === 0) return null;
  return frames[Math.floor(Math.random() * frames.length)];
}