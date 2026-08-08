import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types/product";

export async function getServiceCategories(): Promise<ProductCategory[]> {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("products")
    .select("category_id")
    .eq("type", "service")
    .eq("is_published", true)
    .is("deleted_at", null)
    .not("category_id", "is", null);

  const categoryIds = Array.from(new Set((services ?? []).map((s) => s.category_id)));
  if (categoryIds.length === 0) return [];

  const { data } = await supabase
    .from("product_categories")
    .select("*")
    .in("id", categoryIds)
    .is("deleted_at", null)
    .order("sort_order");

  return data ?? [];
}