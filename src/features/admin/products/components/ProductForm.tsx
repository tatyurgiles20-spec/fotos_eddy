"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "@/features/admin/carousel/components/ImagePicker";
import type { Product, ProductCategory, ProductType } from "@/types/product";

type Props = {
  categories: ProductCategory[];
  product: Product | null;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function ProductForm({ categories, product, onSave, onCancel }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [type, setType] = useState<ProductType>("product");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [sku, setSku] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ id: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setSlug(product.slug);
    setSlugEdited(true); // ya tiene slug propio, no lo regeneres al editar el nombre
    setType(product.type);
    setCategoryId(product.category_id ?? "");
    setDescription(product.description ?? "");
    setMetaDescription(product.meta_description ?? "");
    setSku(product.sku ?? "");
    setPurchasePrice(product.purchase_price?.toString() ?? "");
    setSalePrice(product.sale_price.toString());
    setIsPublished(product.is_published);
    setSelectedImages((product.product_images ?? []).map((pi) => ({ id: pi.image_id, url: "" })));
  }, [product]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const toggleImage = (imageId: string, directUrl: string) => {
    setSelectedImages((prev) =>
      prev.some((img) => img.id === imageId)
        ? prev.filter((img) => img.id !== imageId)
        : [...prev, { id: imageId, url: directUrl }]
    );
  };

  const isValid = name.trim() && slug.trim() && salePrice.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name,
        slug,
        type,
        categoryId: categoryId || null,
        description: description || null,
        metaDescription: metaDescription || null,
        sku: sku || null,
        purchasePrice: purchasePrice ? Number(purchasePrice) : null,
        salePrice: Number(salePrice),
        isPublished,
        imageIds: selectedImages.map((img) => img.id),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <p className="font-display text-lg font-bold">
        {product ? "Editar" : "Nuevo"} {type === "service" ? "servicio" : "producto"}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("product")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
            type === "product" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Producto
        </button>
        <button
          type="button"
          onClick={() => setType("service")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
            type === "service" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Servicio
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Nombre *"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="slug *"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugEdited(true);
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          URL pública: /{type === "service" ? "servicios" : "productos"}/{slug || "..."}
        </p>
      </div>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">Sin categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      <div>
        <textarea
          placeholder="Meta descripción (opcional, para buscadores — si la dejas vacía se usa la descripción)"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted-foreground">{metaDescription.length}/160</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="SKU (opcional)"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Precio de compra"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <input
        type="number"
        placeholder="Precio de venta *"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Mostrar en la landing
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedImages.map((img) => (
            <div key={img.id} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
              {img.url && <img src={img.url} alt="" className="h-full w-full object-cover" />}
              <button
                type="button"
                onClick={() => setSelectedImages((prev) => prev.filter((i) => i.id !== img.id))}
                className="absolute right-0 top-0 bg-black/60 px-1 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <ImagePicker selectedImageId={null} onSelect={(imageId, directUrl) => toggleImage(imageId, directUrl)} />

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!isValid || saving}
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