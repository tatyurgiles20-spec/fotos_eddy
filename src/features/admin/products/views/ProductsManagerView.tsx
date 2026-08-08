"use client";

import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useProductCategories } from "../hooks/useProductCategories";
import { useInventoryMovements } from "../hooks/useInventoryMovements";
import { ProductForm } from "../components/ProductForm";
import { ProductGrid } from "../components/ProductList";
import { StockMovementForm } from "../components/StockMovementForm";
import type { Product } from "@/types/product";
import { CategoryModal } from "../components/CategoryModal";
import { Modal } from "@/components/ui/Modal";

export function ProductsManagerView() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { categories, createCategory, deleteCategory } = useProductCategories();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { products, createProduct, updateProduct, deleteProduct } = useProducts(categoryFilter);

  const [editing, setEditing] = useState<Product | null | undefined>(undefined); // undefined = modal cerrado
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const { addMovement } = useInventoryMovements(stockProduct?.id ?? null);

  const handleSave = async (payload: Record<string, unknown>) => {
    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await createProduct(payload);
    }
    setEditing(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Productos y servicios</p>
        <button
          onClick={() => setEditing(null)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Nuevo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCategoryFilter(null)}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            !categoryFilter ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              categoryFilter === cat.id ? "border-primary bg-primary text-primary-foreground" : "border-border"
            }`}
          >
            {cat.name}
          </button>
        ))}
        <button
          onClick={() => setShowCategoryModal(true)}
          className="rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          + Categoría
        </button>
      </div>

      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          onCreate={createCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {editing !== undefined && (
        <Modal onClose={() => setEditing(undefined)} maxWidth="max-w-xl">
          <ProductForm
            categories={categories}
            product={editing}
            onSave={handleSave}
            onCancel={() => setEditing(undefined)}
          />
        </Modal>
      )}

      {stockProduct && (
        <Modal onClose={() => setStockProduct(null)} maxWidth="max-w-md">
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <p className="font-display text-lg font-bold">Movimientos de: {stockProduct.name}</p>
            <StockMovementForm
              onSubmit={async (type, qty, unitCost, reason) => {
                await addMovement(type, qty, unitCost, reason);
              }}
            />
          </div>
        </Modal>
      )}

      <ProductGrid
        products={products}
        onEdit={(p) => setEditing(p)}
        onDelete={(id) => deleteProduct(id)}
        onTogglePublish={(p) => updateProduct(p.id, { isPublished: !p.is_published })}
      />

      <div className="flex flex-wrap gap-2">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => setStockProduct(p)}
            className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted"
          >
            Inventario: {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}