import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const SELECT = "*, product_categories(name, slug), images(direct_url, alt_text)";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("category_highlights")
    .select(SELECT)
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { categoryId, targetType, description, imageId, isVisible, sortOrder } = body;

  if (!categoryId || !targetType) {
    return NextResponse.json({ error: "Falta la categoría o el tipo" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("category_highlights")
    .insert({
      category_id: categoryId,
      target_type: targetType,
      description: description ?? null,
      image_id: imageId ?? null,
      is_visible: isVisible ?? true,
      sort_order: sortOrder ?? null,
    })
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}