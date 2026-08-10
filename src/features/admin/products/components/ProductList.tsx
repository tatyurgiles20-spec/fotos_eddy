"use client";

import type { Product } from "@/types/product";

type ProductRow = Product & {
  product_images?: {
    image_id: string;
    sort_order: number | null;
    images?: { direct_url: string; alt_text: string | null } | null;
  }[];
};

type Props = {
  products: ProductRow[];
  onEdit: (product: ProductRow) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (product: ProductRow) => void;
  onInventory: (product: ProductRow) => void;
};

export function ProductGrid({ products, onEdit, onDelete, onTogglePublish, onInventory }: Props) {
  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay productos en esta categoría.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Encabezado - solo en pantallas medianas en adelante */}
      <div className="hidden grid-cols-[56px_1fr_90px_80px_100px_110px_170px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
        <span></span>
        <span>Producto</span>
        <span>Tipo</span>
        <span>Stock</span>
        <span>Precio</span>
        <span>Estado</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {products.map((product) => {
          const thumbUrl = product.product_images?.[0]?.images?.direct_url;

          return (
            <div
              key={product.id}
              className="grid grid-cols-[56px_1fr_auto] items-center gap-3 px-3 py-3 sm:grid-cols-[56px_1fr_90px_80px_100px_110px_170px]"
            >
              {/* Thumbnail */}
              {thumbUrl ? (
                <img
                  src={thumbUrl}
                  alt={product.product_images?.[0]?.images?.alt_text ?? product.name}
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-[10px] text-muted-foreground">
                  Sin foto
                </div>
              )}

              {/* Nombre + sku (siempre visible) */}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                {product.sku && (
                  <p className="truncate text-xs text-muted-foreground">SKU: {product.sku}</p>
                )}
                {/* En mobile mostramos aquí lo que en desktop va en columnas propias */}
                <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                  {product.type === "service" ? "Servicio" : `Producto · Stock: ${product.stock}`} ·{" "}
                  <span className="font-medium">${product.sale_price.toFixed(2)}</span>
                </p>
              </div>

              {/* Tipo - desktop */}
              <span className="hidden text-sm text-muted-foreground sm:block">
                {product.type === "service" ? "Servicio" : "Producto"}
              </span>

              {/* Stock - desktop */}
              <span
                className={`hidden text-sm sm:block ${
                  product.type === "product" && product.stock <= 0
                    ? "font-semibold text-destructive"
                    : product.type === "product" && product.stock <= 5
                      ? "font-semibold text-amber-600"
                      : "text-muted-foreground"
                }`}
              >
                {product.type === "product" ? product.stock : "—"}
              </span>

              {/* Precio - desktop */}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">${product.sale_price.toFixed(2)}</p>
                {product.purchase_price != null && (
                  <p className="text-xs text-muted-foreground">Costo: ${product.purchase_price.toFixed(2)}</p>
                )}
              </div>

              {/* Estado */}
              <div className="row-start-1 self-start justify-self-end sm:row-start-auto sm:justify-self-start">
                <button
                  onClick={() => onTogglePublish(product)}
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    product.is_published
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {product.is_published ? "Publicado" : "Oculto"}
                </button>
              </div>

              {/* Acciones */}
              <div className="col-span-3 flex items-center justify-end gap-3 pt-1 text-xs sm:col-span-1 sm:pt-0">
                {product.type === "product" && (
                  <button
                    onClick={() => onInventory(product)}
                    title="Registrar entrada o salida de stock"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    📦 Inventario
                  </button>
                )}
                <button onClick={() => onEdit(product)} className="font-medium text-primary hover:underline">
                  Editar
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="font-medium text-destructive hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}