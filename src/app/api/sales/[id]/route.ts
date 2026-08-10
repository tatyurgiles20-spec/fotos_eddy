import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

type CustomerRow = { name: string; identification: string | null; email: string | null; phone: string | null };

// `await params` funciona igual en Next 14 (objeto plano — await sobre algo
// que no es una Promise simplemente lo devuelve tal cual) y en Next 15 (Promise real).
// Así este archivo compila y corre sin importar cuál uses.

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;

  const supabase = createAdminClient();

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .select("*, customers(name, identification, email, phone)")
    .eq("id", id)
    .single();

  if (saleError) return NextResponse.json({ error: saleError.message }, { status: 500 });

  const { data: items, error: itemsError } = await supabase
    .from("sale_items")
    .select("*")
    .eq("sale_id", id)
    .order("id");

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  const { customers, ...saleFields } = sale as typeof sale & {
    customers: CustomerRow | CustomerRow[] | null;
  };
  const customer = Array.isArray(customers) ? (customers[0] ?? null) : customers;

  return NextResponse.json({ ...saleFields, customer, items: items ?? [] });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;

  const supabase = createAdminClient();
  const { error } = await supabase.rpc("cancel_sale", { p_sale_id: id });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}