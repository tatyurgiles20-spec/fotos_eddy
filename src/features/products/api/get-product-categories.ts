import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types/product";

export async function getProductCategories(): Promise<ProductCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_categories")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");
  return data ?? [];
}