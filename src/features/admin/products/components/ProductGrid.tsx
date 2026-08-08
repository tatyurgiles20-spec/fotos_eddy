"use client";

import type { Product } from "@/types/product";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (product: Product) => void;
};

export function ProductGrid({ products, onEdit, onDelete, onTogglePublish }: Props) {
  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay productos en esta categoría.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border bg-card px-3 py-2">
            <span className="text-sm font-semibold">{product.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                product.is_published
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {product.is_published ? "Publicado" : "Oculto"}
            </span>
          </div>

          <div className="space-y-1 px-3 py-3 text-sm">
            <p className="text-muted-foreground">
              {product.type === "service" ? "Servicio" : "Producto"}
              {product.type === "product" && ` · Stock: ${product.stock}`}
            </p>
            <p className="font-semibold">${product.sale_price.toFixed(2)}</p>
            {product.purchase_price != null && (
              <p className="text-xs text-muted-foreground">Costo: ${product.purchase_price.toFixed(2)}</p>
            )}
          </div>

          <div className="flex gap-2 border-t border-border px-3 py-2 text-xs">
            <button onClick={() => onEdit(product)} className="font-medium text-primary hover:underline">
              Editar
            </button>
            <button onClick={() => onTogglePublish(product)} className="font-medium hover:underline">
              {product.is_published ? "Ocultar" : "Publicar"}
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="ml-auto font-medium text-destructive hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}