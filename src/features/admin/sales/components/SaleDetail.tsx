"use client";

import type { SaleDetail as SaleDetailType } from "@/types/sale";

const PAYMENT_LABEL: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  credit: "Crédito",
};

type Props = {
  sale: SaleDetailType | null;
  loading: boolean;
  error?: string | null;
};
function formatDiscount(type: string | null, value: number): string | null {
  if (!type || value <= 0) return null;
  return type === "percentage" ? `${value}%` : `$${value.toFixed(2)}`;
}
export function SaleDetail({ sale, loading, error }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">No se encontró la venta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-bold">Venta #{sale.sale_number}</p>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            sale.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          }`}
        >
          {sale.status === "cancelled" ? "Cancelada" : "Completada"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Cliente</p>
          <p>{sale.customer?.name ?? "Consumidor Final"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Fecha</p>
          <p>
            {new Date(sale.created_at).toLocaleDateString("es-EC", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pago</p>
          <p>{PAYMENT_LABEL[sale.payment_method] ?? sale.payment_method}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Estado de pago</p>
          <p>{sale.payment_status === "paid" ? "Pagado" : "Pendiente"}</p>
        </div>
      </div>

<div className="overflow-hidden rounded-lg border border-border">
  <div className="hidden grid-cols-[1fr_60px_80px_80px_90px] gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
    <span>Producto</span>
    <span>Cant.</span>
    <span>Precio</span>
    <span>Desc.</span>
    <span>Subtotal</span>
  </div>
  <div className="flex flex-col divide-y divide-border">
    {(sale.items ?? []).map((item) => {
      const itemDiscount = formatDiscount(item.discount_type, item.discount_value);
      return (
        <div key={item.id} className="grid grid-cols-2 gap-2 px-3 py-2 text-sm sm:grid-cols-[1fr_60px_80px_80px_90px]">
          <p className="truncate">{item.product_name_snapshot}</p>
          <span className="text-muted-foreground">x{item.quantity}</span>
          <span className="hidden text-muted-foreground sm:block">${item.unit_price.toFixed(2)}</span>
          <span className="hidden text-xs text-destructive sm:block">{itemDiscount ?? "—"}</span>
          <span className="hidden font-medium sm:block">${item.subtotal.toFixed(2)}</span>
        </div>
      );
    })}
  </div>
</div>

      {sale.notes && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Notas:</span> {sale.notes}
        </p>
      )}

<div className="space-y-1 border-t border-border pt-3">
  <div className="flex items-center justify-between text-sm text-muted-foreground">
    <span>Subtotal</span>
    <span>${sale.subtotal.toFixed(2)}</span>
  </div>
  {sale.discount_total > 0 && (
    <div className="flex items-center justify-between text-sm text-destructive">
      <span>
        Descuento
        {formatDiscount(sale.discount_type, sale.discount_value) && sale.discount_type
          ? ` (venta: ${formatDiscount(sale.discount_type, sale.discount_value)})`
          : ""}
      </span>
      <span>-${sale.discount_total.toFixed(2)}</span>
    </div>
  )}
  <div className="flex items-center justify-between pt-1">
    <span className="text-sm font-medium text-muted-foreground">Total</span>
    <span className="font-display text-xl font-bold">${sale.total.toFixed(2)}</span>
  </div>
</div>
    </div>
  );
}