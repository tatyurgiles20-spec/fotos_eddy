"use client";

import { useMemo, useState } from "react";
import { useCategoryHighlights } from "../hooks/useCategoryHighlights";
import { CategoryHighlightForm } from "../components/CategoryHighlightForm";
import { CategoryHighlightList } from "../components/CategoryHighlightList";
import { Modal } from "@/components/ui/Modal";
import type { CategoryHighlight } from "@/types/category-highlight";

export function CategoryHighlightsManagerView() {
  const { highlights, createHighlight, updateHighlight, deleteHighlight } = useCategoryHighlights();
  const [editing, setEditing] = useState<CategoryHighlight | null | undefined>(undefined);
  const [search, setSearch] = useState("");

  const filteredHighlights = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return highlights;
    return highlights.filter(
      (h) =>
        (h.product_categories?.name ?? "").toLowerCase().includes(term) ||
        (h.description ?? "").toLowerCase().includes(term)
    );
  }, [highlights, search]);

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

      <input
        type="text"
        placeholder="Buscar por categoría o descripción..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {editing !== undefined && (
        <Modal onClose={() => setEditing(undefined)} maxWidth="max-w-lg">
          <CategoryHighlightForm highlight={editing} onSave={handleSave} onCancel={() => setEditing(undefined)} />
        </Modal>
      )}

      <CategoryHighlightList
        highlights={filteredHighlights}
        onEdit={(h) => setEditing(h)}
        onDelete={(id) => deleteHighlight(id)}
        onToggleVisible={(h) => updateHighlight(h.id, { isVisible: !h.is_visible })}
      />
    </div>
  );
}