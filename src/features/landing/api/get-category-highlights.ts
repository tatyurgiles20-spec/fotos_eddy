import { createClient } from "@/lib/supabase/server";
import type { CategoryHighlight } from "@/types/category-highlight";

export async function getCategoryHighlights(): Promise<CategoryHighlight[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category_highlights")
    .select("*, product_categories(name, slug), images(direct_url, alt_text)")
    .eq("is_visible", true)
    .order("sort_order");

  return (data ?? []) as CategoryHighlight[];
}