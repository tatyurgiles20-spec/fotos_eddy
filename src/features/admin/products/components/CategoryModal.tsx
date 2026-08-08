"use client";

import { useState } from "react";
import type { ProductCategory } from "@/types/product";

type Props = {
  categories: ProductCategory[];
  onCreate: (name: string, slug: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function CategoryModal({ categories, onCreate, onDelete, onClose }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const handleCreate = async () => {
    if (!name || !slug) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate(name, slug);
      setName("");
      setSlug("");
      setSlugEdited(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear la categoría");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-bold">Categorías</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Nombre (ej: Camisetas)"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="slug (ej: camisetas)"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={!name || !slug || saving}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Creando..." : "Crear categoría"}
          </button>
        </div>

        <div className="border-t border-border pt-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Categorías existentes</p>
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">Todavía no hay categorías.</p>
          )}
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-xs font-medium text-destructive hover:underline"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}