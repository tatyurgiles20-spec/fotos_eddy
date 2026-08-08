import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ... GET queda igual ...

export async function POST(request: Request) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const {
    name,
    slug,
    description,
    metaDescription,
    type,
    categoryId,
    sku,
    purchasePrice,
    salePrice,
    isPublished,
    imageIds,
  } = body;

  if (!name || !salePrice) {
    return NextResponse.json({ error: "Falta el nombre o el precio de venta" }, { status: 400 });
  }

  const finalSlug = slug?.trim() ? slugify(slug) : slugify(name);
  if (!finalSlug) {
    return NextResponse.json({ error: "El slug no puede quedar vacío" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: finalSlug,
      description: description ?? null,
      meta_description: metaDescription ?? null,
      type: type ?? "product",
      category_id: categoryId ?? null,
      sku: sku ?? null,
      purchase_price: purchasePrice ?? null,
      sale_price: salePrice,
      is_published: isPublished ?? false,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ya existe un producto con ese slug" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (Array.isArray(imageIds) && imageIds.length > 0) {
    await supabase
      .from("product_images")
      .insert(imageIds.map((imageId: string, i: number) => ({
        product_id: product.id,
        image_id: imageId,
        sort_order: i,
      })));
  }

  return NextResponse.json(product);
}