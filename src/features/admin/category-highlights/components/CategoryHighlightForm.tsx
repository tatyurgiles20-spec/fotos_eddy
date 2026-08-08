"use client";

import { useEffect, useState } from "react";
import { useProductCategories } from "@/features/admin/products/hooks/useProductCategories";
import { ImagePicker } from "@/features/admin/carousel/components/ImagePicker";
import type { CategoryHighlight } from "@/types/category-highlight";

type Props = {
  highlight: CategoryHighlight | null; // null = creando uno nuevo
  onSave: (payload: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
};

export function CategoryHighlightForm({ highlight, onSave, onCancel }: Props) {
  const { categories } = useProductCategories();
  const [categoryId, setCategoryId] = useState("");
  const [targetType, setTargetType] = useState<"product" | "service">("product");
  const [description, setDescription] = useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!highlight) return;
    setCategoryId(highlight.category_id);
    setTargetType(highlight.target_type);
    setDescription(highlight.description ?? "");
    setImageId(highlight.image_id);
    setImageUrl(highlight.images?.direct_url ?? null);
    setIsVisible(highlight.is_visible);
    setSortOrder(highlight.sort_order?.toString() ?? "");
  }, [highlight]);

  const handleSubmit = async () => {
    if (!categoryId) return;
    setSaving(true);
    try {
      await onSave({
        categoryId,
        targetType,
        description: description || null,
        imageId,
        isVisible,
        sortOrder: sortOrder ? Number(sortOrder) : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <p className="font-display text-lg font-bold">
        {highlight ? "Editar" : "Nueva"} categoría destacada
      </p>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">Selecciona una categoría...</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTargetType("product")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
            targetType === "product" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Redirige a Productos
        </button>
        <button
          type="button"
          onClick={() => setTargetType("service")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
            targetType === "service" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Redirige a Servicios
        </button>
      </div>

      <textarea
        placeholder="Descripción (se usa en la tarjeta del carrusel y en la página de listado)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Orden (opcional)"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
          Visible en el carrusel
        </label>
      </div>

      {imageUrl && (
        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <ImagePicker
        selectedImageId={imageId}
        onSelect={(id, url) => {
          setImageId(id);
          setImageUrl(url);
        }}
      />

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!categoryId || saving}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}