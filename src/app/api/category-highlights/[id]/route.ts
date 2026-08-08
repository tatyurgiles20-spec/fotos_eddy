import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const SELECT = "*, product_categories(name, slug), images(direct_url, alt_text)";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const { categoryId, targetType, description, imageId, isVisible, sortOrder } = body;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("category_highlights")
    .update({
      ...(categoryId !== undefined && { category_id: categoryId }),
      ...(targetType !== undefined && { target_type: targetType }),
      ...(description !== undefined && { description }),
      ...(imageId !== undefined && { image_id: imageId }),
      ...(isVisible !== undefined && { is_visible: isVisible }),
      ...(sortOrder !== undefined && { sort_order: sortOrder }),
    })
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("category_highlights").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}