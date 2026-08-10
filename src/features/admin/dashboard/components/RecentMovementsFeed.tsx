"use client";

type Movement = {
  id: string;
  movement_type: "in" | "out";
  quantity: number;
  reason: string | null;
  created_at: string;
  products?: { name: string; sku: string | null } | null;
};

export function RecentMovementsFeed({ movements }: { movements: Movement[] }) {
  if (movements.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay movimientos registrados.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {movements.map((m) => (
        <div key={m.id} className="flex items-center gap-3 py-2.5 text-sm">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
              m.movement_type === "in" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}
          >
            {m.movement_type === "in" ? "+" : "-"}
            {m.quantity}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{m.products?.name ?? "Producto eliminado"}</p>
            {m.reason && <p className="truncate text-xs text-muted-foreground">{m.reason}</p>}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {new Date(m.created_at).toLocaleDateString("es-EC", { day: "2-digit", month: "short" })}
          </span>
        </div>
      ))}
    </div>
  );
}