import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sales")
    .select("*, customers(name), sale_items(count)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Igual que en /api/albums: sin tipos generados de la base, Supabase puede
  // devolver el join como array — lo aplanamos a campos simples para el frontend.
  const normalized = (data ?? []).map(({ sale_items, customers, ...sale }) => {
    const customer = Array.isArray(customers) ? customers[0] : customers;
    const items = Array.isArray(sale_items) ? sale_items[0] : sale_items;
    return {
      ...sale,
      customer_name: customer?.name ?? null,
      item_count: items?.count ?? 0,
    };
  });

  return NextResponse.json(normalized);
}

export async function POST(request: Request) {
  const { authorized, user } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { customerId, items, paymentMethod, paymentStatus, notes, discountType, discountValue } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Agrega al menos un producto a la venta" }, { status: 400 });
  }

  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      return NextResponse.json({ error: "Cada línea necesita un producto y una cantidad válida" }, { status: 400 });
    }
  }

  const supabase = createAdminClient();

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("email", user?.email ?? "")
    .maybeSingle();

  const { data: saleId, error } = await supabase.rpc("create_sale", {
    p_customer_id: customerId ?? null,
    p_items: items.map((i: {
      productId: string;
      quantity: number;
      unitPrice?: number;
      discountType?: string | null;
      discountValue?: number;
    }) => ({
      product_id: i.productId,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      discount_type: i.discountType ?? null,
      discount_value: i.discountValue ?? 0,
    })),
    p_payment_method: paymentMethod ?? "cash",
    p_payment_status: paymentStatus ?? "paid",
    p_notes: notes ?? null,
    p_created_by: admin?.id ?? null,
    p_discount_type: discountType ?? null,
    p_discount_value: discountValue ?? 0,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: saleId });
}