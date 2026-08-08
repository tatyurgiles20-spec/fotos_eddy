export type CategoryHighlight = {
  id: string;
  category_id: string;
  target_type: "product" | "service";
  description: string | null;
  image_id: string | null;
  is_visible: boolean;
  sort_order: number | null;
  created_at: string;
  product_categories?: { name: string; slug: string } | null;
  images?: { direct_url: string; alt_text: string | null } | null;
};