"use client";

import type { InventoryMovement } from "@/types/product";

type Props = {
  movements: InventoryMovement[];
  movementType: "in" | "out";
  onEdit: (movement: InventoryMovement) => void;
  onDelete: (id: string) => void;
};

export function InventoryMovementList({ movements, movementType, onEdit, onDelete }: Props) {
  if (movements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay {movementType === "in" ? "ingresos" : "egresos"} registrados.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden grid-cols-[1fr_90px_100px_1fr_110px_140px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
        <span>Producto</span>
        <span>Cantidad</span>
        <span>{movementType === "in" ? "Costo unit." : ""}</span>
        <span>Motivo</span>
        <span>Fecha</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {movements.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[1fr_auto] gap-3 px-3 py-3 sm:grid-cols-[1fr_90px_100px_1fr_110px_140px] sm:items-center"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{m.products?.name ?? "Producto eliminado"}</p>
              {m.products?.sku && (
                <p className="truncate text-xs text-muted-foreground">SKU: {m.products.sku}</p>
              )}
            </div>

            <span className={`text-sm font-semibold ${movementType === "in" ? "text-primary" : "text-destructive"}`}>
              {movementType === "in" ? "+" : "-"}
              {m.quantity}
            </span>

            <span className="hidden text-sm text-muted-foreground sm:block">
              {movementType === "in" && m.unit_cost != null ? `$${m.unit_cost.toFixed(2)}` : "—"}
            </span>

            <span className="col-span-2 truncate text-sm text-muted-foreground sm:col-span-1">
              {m.reason || "—"}
            </span>

            <span className="hidden text-xs text-muted-foreground sm:block">
              {new Date(m.created_at).toLocaleDateString("es-EC", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>

            <div className="col-span-2 flex items-center justify-end gap-3 text-xs sm:col-span-1">
              <button onClick={() => onEdit(m)} className="font-medium text-primary hover:underline">
                Editar
              </button>
              <button onClick={() => onDelete(m.id)} className="font-medium text-destructive hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}