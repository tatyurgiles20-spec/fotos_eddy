"use client";

import type { Sale } from "@/types/sale";

const PAYMENT_LABEL: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  credit: "Crédito",
};

type Props = {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onCancel: (id: string) => void;
};

export function SaleList({ sales, onView, onCancel }: Props) {
  if (sales.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden grid-cols-[70px_1fr_90px_90px_110px_100px_140px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
        <span>Folio</span>
        <span>Cliente</span>
        <span>Ítems</span>
        <span>Total</span>
        <span>Pago</span>
        <span>Estado</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {sales.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-3 sm:grid-cols-[70px_1fr_90px_90px_110px_100px_140px]"
          >
            <span className="text-sm font-semibold">#{s.sale_number}</span>

            <div className="min-w-0">
              <p className="truncate text-sm">{s.customer_name ?? "Consumidor Final"}</p>
<p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
  {new Date(s.created_at).toLocaleDateString("es-EC", { day: "2-digit", month: "short" })} · $
  {s.total.toFixed(2)}
  {s.discount_total > 0 && <span className="text-warning"> (desc. ${s.discount_total.toFixed(2)})</span>}
</p>
            </div>

            <span className="hidden text-sm text-muted-foreground sm:block">
              {s.item_count} {s.item_count === 1 ? "ítem" : "ítems"}
            </span>

            <span className="hidden text-sm font-semibold sm:flex sm:items-center sm:gap-1">
  ${s.total.toFixed(2)}
  {s.discount_total > 0 && (
    <span className="rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
      -${s.discount_total.toFixed(2)}
    </span>
  )}
</span>

            <span className="hidden text-sm text-muted-foreground sm:block">
              {PAYMENT_LABEL[s.payment_method] ?? s.payment_method}
            </span>

            <span className="hidden sm:block">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  s.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                }`}
              >
                {s.status === "cancelled" ? "Cancelada" : "Completada"}
              </span>
            </span>

            <div className="col-span-2 flex items-center justify-end gap-3 pt-1 text-xs sm:col-span-1 sm:pt-0">
              <button onClick={() => onView(s)} className="font-medium text-primary hover:underline">
                Ver
              </button>
              {s.status !== "cancelled" && (
                <button onClick={() => onCancel(s.id)} className="font-medium text-destructive hover:underline">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}