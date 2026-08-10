"use client";

import Link from "next/link";

const PAYMENT_LABEL: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  credit: "Crédito",
};

type Sale = {
  id: string;
  sale_number: number;
  customer_name: string | null;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
};

export function RecentSalesFeed({ sales }: { sales: Sale[] }) {
  if (sales.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {sales.map((s) => (
        <Link
          key={s.id}
          href="/admin/ventas"
          className="flex items-center gap-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
        >
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">#{s.sale_number}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{s.customer_name ?? "Consumidor Final"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {PAYMENT_LABEL[s.payment_method] ?? s.payment_method}
              {s.status === "cancelled" && " · Cancelada"}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className={`font-semibold ${s.status === "cancelled" ? "text-muted-foreground line-through" : ""}`}>
              ${s.total.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(s.created_at).toLocaleDateString("es-EC", { day: "2-digit", month: "short" })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}