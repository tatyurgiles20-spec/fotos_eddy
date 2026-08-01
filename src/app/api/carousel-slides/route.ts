import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapCarouselSlideRow, type CarouselSlideRow } from "@/types/carousel";

// GET /api/carousel-slides?carousel_key=promo
// Uso: panel de admin (trae TODOS los slides, activos e inactivos, para poder editarlos)
export async function GET(request: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const carouselKey = request.nextUrl.searchParams.get("carousel_key") ?? "promo";
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("carousel_slides")
    .select(
      "id, carousel_key, image_id, alt_text, title, subtitle, button_text, button_href, button_style, font_family, title_color, subtitle_color, text_position, position, active, images ( id, direct_url )"
    )
    .eq("carousel_key", carouselKey)
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = ((data ?? []) as unknown as CarouselSlideRow[]).map(mapCarouselSlideRow);

  return NextResponse.json({ data: mapped });
}

// POST /api/carousel-slides
// Body: { carousel_key, image_id, alt_text, title?, subtitle?, button_text?, button_href?, button_style?, position?, active? }
export async function POST(request: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();

  if (!body.image_id || !body.alt_text) {
    return NextResponse.json(
      { error: "image_id y alt_text son obligatorios" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("carousel_slides")
    .insert({
      carousel_key: body.carousel_key ?? "promo",
      image_id: body.image_id,
      alt_text: body.alt_text,
      title: body.title ?? null,
      subtitle: body.subtitle ?? null,
      button_text: body.button_text ?? null,
      button_href: body.button_href ?? null,
      button_style: body.button_style ?? "primary",
      font_family: body.font_family ?? null,
      title_color: body.title_color ?? null,
      subtitle_color: body.subtitle_color ?? null,
      text_position: body.text_position ?? "left",
      position: body.position ?? 0,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // La landing usa un Server Component cacheado: esto fuerza que el
  // próximo request ya traiga el slide nuevo sin esperar el revalidate normal.
  revalidatePath("/");

  return NextResponse.json({ data }, { status: 201 });
}