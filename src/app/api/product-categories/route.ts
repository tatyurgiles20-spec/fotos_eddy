import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { name, slug, sortOrder } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Falta el nombre o el slug" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_categories")
    .insert({ name, slug, sort_order: sortOrder ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}