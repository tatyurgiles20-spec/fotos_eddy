import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/types/product";

const PRODUCT_IMAGE_SELECT = "*, product_images(image_id, sort_order, images(direct_url, alt_text))";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getServiceBySlug(slugOrId: string): Promise<ProductWithImages | null> {
  const supabase = await createClient();
  const baseQuery = () =>
    supabase
      .from("products")
      .select(PRODUCT_IMAGE_SELECT)
      .eq("type", "service")
      .eq("is_published", true)
      .is("deleted_at", null);

  const bySlug = await baseQuery().eq("slug", slugOrId).maybeSingle();
  if (bySlug.data) return bySlug.data as ProductWithImages;

  if (!UUID_REGEX.test(slugOrId)) return null;
  const byId = await baseQuery().eq("id", slugOrId).maybeSingle();
  return (byId.data as ProductWithImages) ?? null;
}