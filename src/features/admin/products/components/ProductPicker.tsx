"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

type Props = {
  selected: Product | null;
  onSelect: (product: Product | null) => void;
};

export function ProductPicker({ selected, onSelect }: Props) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products?all=true")
      .then((res) => res.json())
      .then((data) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => setAllProducts([]));
  }, []);

  const term = search.trim().toLowerCase();
  const results = allProducts
    .filter((p) => p.type === "product") // los servicios no manejan stock/inventario
    .filter(
      (p) =>
        term === "" ||
        p.name.toLowerCase().includes(term) ||
        (p.sku ?? "").toLowerCase().includes(term)
    )
    .slice(0, 8);

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
        <div className="min-w-0">
          <p className="truncate font-medium">{selected.name}</p>
          <p className="text-xs text-muted-foreground">
            Stock actual: {selected.stock}
            {selected.sku && ` · SKU: ${selected.sku}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="shrink-0 text-xs font-medium text-primary hover:underline"
        >
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar producto por nombre o SKU..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelect(p);
                setOpen(false);
                setSearch("");
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <span className="truncate">{p.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">Stock: {p.stock}</span>
            </button>
          ))}
        </div>
      )}

      {open && term !== "" && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground shadow-lg">
          Sin resultados
        </div>
      )}
    </div>
  );
}