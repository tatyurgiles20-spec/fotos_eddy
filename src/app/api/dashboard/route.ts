import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const PAYMENT_LABEL: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  credit: "Crédito",
};

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const supabase = createAdminClient();
  const now = new Date();
  const startOfPrevYear = new Date(now.getFullYear() - 1, 0, 1).toISOString();

  const [productsRes, highlightsRes, slidesRes, saleItemsRes, salesTotalsRes, recentSalesRes, pendingPaymentsRes] =
    await Promise.all([
      supabase
        .from("products")
        .select("id, name, type, stock, purchase_price, is_published")
        .is("deleted_at", null),
      supabase.from("category_highlights").select("id", { count: "exact", head: true }).eq("is_visible", true),
      supabase
        .from("carousel_slides")
        .select("id", { count: "exact", head: true })
        .eq("active", true)
        .eq("carousel_key", "promo"),
      // Unidades vendidas y ranking de productos: esto sí puede salir de sale_items,
      // porque las UNIDADES no cambian con el descuento, solo el dinero.
      supabase
        .from("sale_items")
        .select("quantity, subtotal, product_id, product_name_snapshot, sales!inner(created_at, status)")
        .eq("sales.status", "completed")
        .gte("sales.created_at", startOfPrevYear),
      // Ingresos y descuentos reales: deben salir de sales.total/discount_total,
      // que ya incluyen TANTO el descuento por línea COMO el descuento de la venta
      // completa. Sumar sale_items.subtotal se queda corto porque ese campo solo
      // refleja el descuento de línea, no el de la venta.
      supabase
        .from("sales")
        .select("id, total, discount_total, payment_method, created_at, status")
        .eq("status", "completed")
        .gte("created_at", startOfPrevYear),
      supabase
        .from("sales")
        .select("id, sale_number, total, payment_method, status, created_at, customers(name)")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("sales")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed")
        .eq("payment_status", "pending"),
    ]);

  if (productsRes.error) return NextResponse.json({ error: productsRes.error.message }, { status: 500 });
  if (saleItemsRes.error) return NextResponse.json({ error: saleItemsRes.error.message }, { status: 500 });
  if (salesTotalsRes.error) return NextResponse.json({ error: salesTotalsRes.error.message }, { status: 500 });
  if (recentSalesRes.error) return NextResponse.json({ error: recentSalesRes.error.message }, { status: 500 });

  // ---------- Productos: stock, valor de inventario, publicados/ocultos ----------
  const products = productsRes.data ?? [];
  const stockItems = products.filter((p) => p.type === "product");
  const outOfStock = stockItems.filter((p) => p.stock <= 0);
  const lowStock = stockItems.filter((p) => p.stock > 0 && p.stock <= 5);
  const inventoryValue = stockItems.reduce(
    (sum, p) => sum + (p.purchase_price != null ? p.stock * p.purchase_price : 0),
    0
  );
  const missingCostCount = stockItems.filter((p) => p.purchase_price == null && p.stock > 0).length;
  const published = products.filter((p) => p.is_published).length;
  const hidden = products.filter((p) => !p.is_published).length;

  // ---------- Unidades vendidas, ranking y gráficas (desde sale_items) ----------
  type SalesJoin = { created_at: string; status: string };
  const getSaleInfo = (row: { sales: SalesJoin | SalesJoin[] | null }): SalesJoin | null => {
    const s = row.sales as unknown;
    if (Array.isArray(s)) return (s[0] as SalesJoin) ?? null;
    return (s as SalesJoin) ?? null;
  };

  const saleItems = saleItemsRes.data ?? [];

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let unitsThisMonth = 0;
  let unitsLastMonth = 0;

  const salesByProduct = new Map<string, { name: string; total: number }>();

  const dailyMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }
  const weekBuckets = new Array(12).fill(0) as number[];
  const monthBuckets = new Array(12).fill(0) as number[];

  for (const item of saleItems) {
    const saleInfo = getSaleInfo(item);
    if (!saleInfo) continue;
    const created = new Date(saleInfo.created_at);

    if (created >= monthStart) {
      unitsThisMonth += item.quantity;
    } else if (created >= prevMonthStart && created < monthStart) {
      unitsLastMonth += item.quantity;
    }

    if (item.product_id) {
      const prev = salesByProduct.get(item.product_id) ?? { name: item.product_name_snapshot, total: 0 };
      prev.total += item.quantity;
      salesByProduct.set(item.product_id, prev);
    }

    const dayKey = created.toISOString().slice(0, 10);
    if (dailyMap.has(dayKey)) dailyMap.set(dayKey, (dailyMap.get(dayKey) ?? 0) + item.quantity);

    const diffDays = Math.floor((now.getTime() - created.getTime()) / 86400000);
    const weekIndex = Math.floor(diffDays / 7);
    if (weekIndex >= 0 && weekIndex < 12) weekBuckets[11 - weekIndex] += item.quantity;

    if (created.getFullYear() === now.getFullYear()) monthBuckets[created.getMonth()] += item.quantity;
  }

  const topProducts = [...salesByProduct.entries()]
    .map(([productId, v]) => ({ productId, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const daily = [...dailyMap.entries()].map(([date, value]) => ({
    label: new Date(`${date}T00:00:00`).toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit" }),
    value,
  }));
  const weekly = weekBuckets.map((value, i) => ({ label: `Sem ${i + 1}`, value }));
  const monthly = monthBuckets.map((value, i) => ({ label: MONTH_NAMES[i], value }));

  // ---------- Ingresos y descuentos reales (desde sales.total/discount_total) ----------
  const salesTotals = salesTotalsRes.data ?? [];

  let revenueThisMonth = 0;
  let revenueLastMonth = 0;
  let discountThisMonth = 0;
  const paymentBreakdown = new Map<string, number>();

  for (const sale of salesTotals) {
    const created = new Date(sale.created_at);

    if (created >= monthStart) {
      revenueThisMonth += sale.total;
      discountThisMonth += sale.discount_total;
      paymentBreakdown.set(sale.payment_method, (paymentBreakdown.get(sale.payment_method) ?? 0) + sale.total);
    } else if (created >= prevMonthStart && created < monthStart) {
      revenueLastMonth += sale.total;
    }
  }

  const paymentMethods = [...paymentBreakdown.entries()]
    .map(([method, total]) => ({ method, label: PAYMENT_LABEL[method] ?? method, total }))
    .sort((a, b) => b.total - a.total);

  // ---------- Últimas ventas ----------
  type CustomerJoin = { name: string };
  const recentSales = (recentSalesRes.data ?? []).map((s) => {
    const raw = s.customers as unknown;
    const customer = Array.isArray(raw) ? (raw[0] as CustomerJoin | undefined) : (raw as CustomerJoin | null);
    return {
      id: s.id,
      sale_number: s.sale_number,
      customer_name: customer?.name ?? null,
      total: s.total,
      payment_method: s.payment_method,
      status: s.status,
      created_at: s.created_at,
    };
  });

  return NextResponse.json({
    stockAlerts: {
      outOfStock: outOfStock.length,
      lowStock: lowStock.length,
      items: [...outOfStock, ...lowStock]
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
        .map((p) => ({ id: p.id, name: p.name, stock: p.stock })),
    },
    contentAlerts: {
      visibleHighlights: highlightsRes.count ?? 0,
      activeSlides: slidesRes.count ?? 0,
    },
    salesAlerts: {
      pendingPayments: pendingPaymentsRes.count ?? 0,
    },
    sales: { unitsThisMonth, unitsLastMonth, revenueThisMonth, revenueLastMonth },
    discounts: { thisMonth: discountThisMonth },
    paymentMethods,
    topProducts,
    inventoryValue: { total: inventoryValue, missingCostCount },
    catalog: { published, hidden },
    recentSales,
    charts: { daily, weekly, monthly },
  });
}