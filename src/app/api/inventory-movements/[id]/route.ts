import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

// Nota: si tus otros archivos [id]/route.ts (products, images, etc.) usan
// `{ params }: { params: Promise<{ id: string }> }` (convención de Next 15),
// ajusta la firma de estas dos funciones igual para mantener consistencia.

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { productId, movementType, quantity, unitCost, reason } = body;

  const updates: Record<string, unknown> = {};
  if (productId !== undefined) updates.product_id = productId;
  if (movementType !== undefined) updates.movement_type = movementType;
  if (quantity !== undefined) updates.quantity = quantity;
  if (unitCost !== undefined) updates.unit_cost = unitCost;
  if (reason !== undefined) updates.reason = reason;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No hay cambios para guardar" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inventory_movements")
    .update(updates)
    .eq("id", params.id)
    .select("*, products(name, sku, type)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("inventory_movements").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}