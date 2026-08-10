export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number | null;
  created_at: string;
};

export type ProductType = "product" | "service";

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  meta_description: string | null;
  type: ProductType;
  sku: string | null;
  purchase_price: number | null;
  sale_price: number;
  stock: number;
  is_published: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string | null;
  product_images?: { image_id: string; sort_order: number | null }[];
};

export type InventoryMovement = {
  id: string;
  product_id: string;
  movement_type: "in" | "out";
  quantity: number;
  unit_cost: number | null;
  reason: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
  // presente cuando la API hace el join con products (listas de ingresos/egresos)
  products?: { name: string; sku: string | null; type: ProductType } | null;
};

export type ProductWithImages = Product & {
  product_images?: {
    image_id: string;
    sort_order: number | null;
    images: { direct_url: string; alt_text: string | null } | null;
  }[];
};