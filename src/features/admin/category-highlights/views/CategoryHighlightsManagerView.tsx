"use client";

import { useState } from "react";
import { useCategoryHighlights } from "../hooks/useCategoryHighlights";
import { CategoryHighlightForm } from "../components/CategoryHighlightForm";
import { CategoryHighlightList } from "../components/CategoryHighlightList";
import type { CategoryHighlight } from "@/types/category-highlight";

export function CategoryHighlightsManagerView() {
  const { highlights, createHighlight, updateHighlight, deleteHighlight } = useCategoryHighlights();
  const [editing, setEditing] = useState<CategoryHighlight | null | undefined>(undefined);

  const handleSave = async (payload: Record<string, unknown>) => {
    if (editing) {
      await updateHighlight(editing.id, payload);
    } else {
      await createHighlight(payload);
    }
    setEditing(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Categorías destacadas (carrusel)</p>
        <button
          onClick={() => setEditing(null)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Nueva
        </button>
      </div>

      {editing !== undefined && (
        <CategoryHighlightForm highlight={editing} onSave={handleSave} onCancel={() => setEditing(undefined)} />
      )}

      <CategoryHighlightList
        highlights={highlights}
        onEdit={(h) => setEditing(h)}
        onDelete={(id) => deleteHighlight(id)}
        onToggleVisible={(h) => updateHighlight(h.id, { isVisible: !h.is_visible })}
      />
    </div>
  );
}