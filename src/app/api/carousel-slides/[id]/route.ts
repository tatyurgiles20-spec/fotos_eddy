import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

// PUT /api/carousel-slides/:id
// Body: cualquier subconjunto de los campos editables del slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params; // Next.js 16: params es una Promise, hay que esperarla

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("carousel_slides")
    .update({
      image_id: body.image_id,
      alt_text: body.alt_text,
      title: body.title,
      subtitle: body.subtitle,
      button_text: body.button_text,
      button_href: body.button_href,
      button_style: body.button_style,
      font_family: body.font_family,
      title_color: body.title_color,
      subtitle_color: body.subtitle_color,
      text_position: body.text_position,
      show_underline: body.show_underline,
      position: body.position,
      active: body.active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ data });
}

// DELETE /api/carousel-slides/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params; // Next.js 16: params es una Promise, hay que esperarla

  const supabase = createAdminClient();

  const { error } = await supabase.from("carousel_slides").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ success: true });
}