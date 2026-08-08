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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {highlights.map((h) => (
        <div key={h.id} className="overflow-hidden rounded-lg border border-border">
          <div className="relative aspect-video w-full bg-muted">
            {h.images?.direct_url && (
              <img src={h.images.direct_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>

          <div className="space-y-1 px-3 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{h.product_categories?.name ?? "—"}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  h.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {h.is_visible ? "Visible" : "Oculto"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {h.target_type === "service" ? "→ Servicios" : "→ Productos"}
            </p>
            {h.description && <p className="line-clamp-2 text-xs text-muted-foreground">{h.description}</p>}
          </div>

          <div className="flex gap-2 border-t border-border px-3 py-2 text-xs">
            <button onClick={() => onEdit(h)} className="font-medium text-primary hover:underline">
              Editar
            </button>
            <button onClick={() => onToggleVisible(h)} className="font-medium hover:underline">
              {h.is_visible ? "Ocultar" : "Mostrar"}
            </button>
            <button onClick={() => onDelete(h.id)} className="ml-auto font-medium text-destructive hover:underline">
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}