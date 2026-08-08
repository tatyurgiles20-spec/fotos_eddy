import { createClient } from "@/lib/supabase/server";

export async function getCategoryHighlightDescription(categorySlug: string): Promise<string | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category_highlights")
    .select("description, product_categories!inner(slug)")
    .eq("target_type", "product")
    .eq("product_categories.slug", categorySlug)
    .maybeSingle();

  return data?.description ?? null;
}