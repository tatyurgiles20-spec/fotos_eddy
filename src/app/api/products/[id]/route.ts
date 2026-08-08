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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
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

  const supabase = createAdminClient();
  const { data: product, error } = await supabase
    .from("products")
    .update({
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug: slugify(slug) }),
      ...(description !== undefined && { description }),
      ...(metaDescription !== undefined && { meta_description: metaDescription }),
      ...(type !== undefined && { type }),
      ...(categoryId !== undefined && { category_id: categoryId }),
      ...(sku !== undefined && { sku }),
      ...(purchasePrice !== undefined && { purchase_price: purchasePrice }),
      ...(salePrice !== undefined && { sale_price: salePrice }),
      ...(isPublished !== undefined && { is_published: isPublished }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ya existe un producto con ese slug" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (Array.isArray(imageIds)) {
    await supabase.from("product_images").delete().eq("product_id", id);
    if (imageIds.length > 0) {
      await supabase
        .from("product_images")
        .insert(imageIds.map((imageId: string, i: number) => ({
          product_id: id,
          image_id: imageId,
          sort_order: i,
        })));
    }
  }

  return NextResponse.json(product);
}

 
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const supabase = createAdminClient();

  // soft delete: no borramos el registro, así el historial de inventario queda intacto
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}