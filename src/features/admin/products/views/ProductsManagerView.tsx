"use client";

import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useProductCategories } from "../hooks/useProductCategories";
import { useInventoryMovements } from "../hooks/useInventoryMovements";
import { ProductForm } from "../components/ProductForm";
import { ProductGrid } from "../components/ProductList";
import { StockMovementForm } from "../components/StockMovementForm";
import type { Product, ProductType } from "@/types/product";
import { CategoryModal } from "../components/CategoryModal";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";

export function ProductsManagerView() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ProductType | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { categories, createCategory, deleteCategory } = useProductCategories();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { products, createProduct, updateProduct, deleteProduct, refresh: refreshProducts } = useProducts(categoryFilter);

  const [editing, setEditing] = useState<Product | null | undefined>(undefined); // undefined = modal cerrado
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const { addMovement } = useInventoryMovements(stockProduct?.id ?? null);

  // El stock mostrado en el modal debe reflejar el dato más reciente de la lista,
  // no la foto del producto tomada al momento de abrir el modal.
  const liveStockProduct = stockProduct
    ? products.find((p) => p.id === stockProduct.id) ?? stockProduct
    : null;

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      const matchesSearch =
        term === "" ||
        p.name.toLowerCase().includes(term) ||
        (p.sku ?? "").toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [products, typeFilter, search]);

  // Si cambian filtros/orden/pageSize y la página actual queda "fuera de rango", volvemos a la 1
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  if (page > totalPages) {
    setPage(1);
  }

  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm sm:max-w-xs"
        />

        <select
          value={categoryFilter ?? ""}
          onChange={(e) => handleFilterChange(setCategoryFilter)(e.target.value || null)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => handleFilterChange(setTypeFilter)(e.target.value as ProductType | "all")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Productos y servicios</option>
          <option value="product">Solo productos</option>
          <option value="service">Solo servicios</option>
        </select>

        <button
          onClick={() => setShowCategoryModal(true)}
          className="rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted sm:ml-auto"
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

      {liveStockProduct && (
        <Modal onClose={() => setStockProduct(null)} maxWidth="max-w-md">
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="font-display text-lg font-bold">Movimientos de: {liveStockProduct.name}</p>
              <p className="text-sm text-muted-foreground">
                Stock actual:{" "}
                <span
                  className={
                    liveStockProduct.stock <= 0
                      ? "font-semibold text-destructive"
                      : liveStockProduct.stock <= 5
                        ? "font-semibold text-amber-600"
                        : "font-semibold text-foreground"
                  }
                >
                  {liveStockProduct.stock}
                </span>
              </p>
            </div>
            <StockMovementForm
              onSubmit={async (type, qty, unitCost, reason) => {
                await addMovement(type, qty, unitCost, reason);
                await refreshProducts();
              }}
            />
          </div>
        </Modal>
      )}

      <ProductGrid
        products={paginatedProducts}
        onEdit={(p) => setEditing(p)}
        onDelete={(id) => deleteProduct(id)}
        onTogglePublish={(p) => updateProduct(p.id, { isPublished: !p.is_published })}
        onInventory={(p) => setStockProduct(p)}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={filteredProducts.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}