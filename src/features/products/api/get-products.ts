import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/types/product";

const PRODUCT_IMAGE_SELECT = "*, product_images(image_id, sort_order, images(direct_url, alt_text))";

export async function getProducts(categorySlug?: string): Promise<ProductWithImages[]> {
  const supabase = await createClient();

  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: category } = await supabase
      .from("product_categories")
      .select("id")
      .eq("slug", categorySlug)
      .is("deleted_at", null)
      .maybeSingle();
    if (!category) return [];
    categoryId = category.id;
  }

  let query = supabase
    .from("products")
    .select(PRODUCT_IMAGE_SELECT)
    .eq("type", "product")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order");

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data } = await query;
  return (data ?? []) as ProductWithImages[];
}