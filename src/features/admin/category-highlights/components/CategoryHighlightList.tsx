"use client";

import type { CategoryHighlight } from "@/types/category-highlight";

type Props = {
  highlights: CategoryHighlight[];
  onEdit: (highlight: CategoryHighlight) => void;
  onDelete: (id: string) => void;
  onToggleVisible: (highlight: CategoryHighlight) => void;
};

export function CategoryHighlightList({ highlights, onEdit, onDelete, onToggleVisible }: Props) {
  if (highlights.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay categorías destacadas.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden grid-cols-[64px_1fr_110px_1fr_100px_140px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
        <span></span>
        <span>Categoría</span>
        <span>Destino</span>
        <span>Descripción</span>
        <span>Estado</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {highlights.map((h) => (
          <div
            key={h.id}
            className="grid grid-cols-[56px_1fr_auto] items-center gap-3 px-3 py-3 sm:grid-cols-[64px_1fr_110px_1fr_100px_140px]"
          >
            {h.images?.direct_url ? (
              <img
                src={h.images.direct_url}
                alt=""
                className="h-12 w-16 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-[10px] text-muted-foreground">
                Sin foto
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{h.product_categories?.name ?? "—"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                {h.target_type === "service" ? "→ Servicios" : "→ Productos"}
              </p>
            </div>

            <span className="hidden text-sm text-muted-foreground sm:block">
              {h.target_type === "service" ? "→ Servicios" : "→ Productos"}
            </span>

            <p className="col-span-2 hidden truncate text-sm text-muted-foreground sm:col-span-1 sm:block">
              {h.description || "—"}
            </p>

            <div className="row-start-1 self-start justify-self-end sm:row-start-auto sm:justify-self-start">
              <button
                onClick={() => onToggleVisible(h)}
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  h.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {h.is_visible ? "Visible" : "Oculto"}
              </button>
            </div>

            <div className="col-span-3 flex items-center justify-end gap-3 pt-1 text-xs sm:col-span-1 sm:pt-0">
              <button onClick={() => onEdit(h)} className="font-medium text-primary hover:underline">
                Editar
              </button>
              <button
                onClick={() => onDelete(h.id)}
                className="font-medium text-destructive hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}