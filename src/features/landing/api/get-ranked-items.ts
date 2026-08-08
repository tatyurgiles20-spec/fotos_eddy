import { createClient } from "@/lib/supabase/server";
import type { ProductType } from "@/types/product";
import type { ProductWithImages } from "@/types/product";

const PRODUCT_IMAGE_SELECT = "*, product_images(image_id, sort_order, images(direct_url, alt_text))";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function getRankedItems(type: ProductType, limit = 4): Promise<ProductWithImages[]> {
  const supabase = await createClient();

  const { data: ranking } = await supabase
    .from("product_sales_ranking")
    .select("product_id, total_sold")
    .eq("type", type)
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("total_sold", { ascending: false })
    .limit(limit);

  const hasSales = (ranking ?? []).some((r) => r.total_sold > 0);

  if (hasSales && ranking) {
    const ids = ranking.map((r) => r.product_id);
    const { data: products } = await supabase
      .from("products")
      .select(PRODUCT_IMAGE_SELECT)
      .in("id", ids);

    // Supabase no garantiza el orden del IN, reordenamos según el ranking real
    const order = new Map(ids.map((id, i) => [id, i]));
    return ((products ?? []) as ProductWithImages[]).sort(
      (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
    );
  }

  // Todavía no hay ventas de este tipo: mostramos una selección aleatoria
  const { data: allItems } = await supabase
    .from("products")
    .select(PRODUCT_IMAGE_SELECT)
    .eq("type", type)
    .eq("is_published", true)
    .is("deleted_at", null);

  return shuffle((allItems ?? []) as ProductWithImages[]).slice(0, limit);
}