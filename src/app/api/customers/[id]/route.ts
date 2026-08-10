import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

// Nota: alinea esta firma con la convención que uses en tus otros [id]/route.ts
// (params como objeto directo o como Promise, según tu versión de Next).

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { name, identificationType, identification, email, phone, address } = body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (identificationType !== undefined) updates.identification_type = identificationType || null;
  if (identification !== undefined) updates.identification = identification || null;
  if (email !== undefined) updates.email = email || null;
  if (phone !== undefined) updates.phone = phone || null;
  if (address !== undefined) updates.address = address || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No hay cambios para guardar" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ya existe un cliente con esa identificación" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const supabase = createAdminClient();
  // Borrado suave: si el cliente ya tiene ventas ligadas, un DELETE real
  // chocaría con la referencia en sales.customer_id.
  const { error } = await supabase
    .from("customers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}