import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "Falta productId" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inventory_movements")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { authorized, user } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { productId, movementType, quantity, unitCost, reason } = body;

  if (!productId || !movementType || !quantity) {
    return NextResponse.json({ error: "Faltan datos del movimiento" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // buscamos el id de admin a partir del email de auth (mismo patrón que require-admin.ts)
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("email", user?.email ?? "")
    .maybeSingle();

  const { data, error } = await supabase
    .from("inventory_movements")
    .insert({
      product_id: productId,
      movement_type: movementType,
      quantity,
      unit_cost: unitCost ?? null,
      reason: reason ?? null,
      created_by: admin?.id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}