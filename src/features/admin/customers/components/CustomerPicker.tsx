"use client";

import { useEffect, useState } from "react";
import type { Customer } from "@/types/customer";

type Props = {
  selected: Customer | null;
  onSelect: (customer: Customer | null) => void;
};

export function CustomerPicker({ selected, onSelect }: Props) {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setAllCustomers(Array.isArray(data) ? data : []))
      .catch(() => setAllCustomers([]));
  }, []);

  const term = search.trim().toLowerCase();
  const results = allCustomers
    .filter(
      (c) =>
        term === "" ||
        c.name.toLowerCase().includes(term) ||
        (c.identification ?? "").toLowerCase().includes(term)
    )
    .slice(0, 8);

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
        <div className="min-w-0">
          <p className="truncate font-medium">{selected.name}</p>
          {selected.identification && <p className="text-xs text-muted-foreground">{selected.identification}</p>}
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
        placeholder="Buscar cliente (vacío = Consumidor Final)..."
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
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelect(c);
                setOpen(false);
                setSearch("");
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <span className="truncate">{c.name}</span>
              {c.identification && <span className="shrink-0 text-xs text-muted-foreground">{c.identification}</span>}
            </button>
          ))}
        </div>
      )}

      {open && term !== "" && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground shadow-lg">
          Sin resultados — puedes dejarlo vacío para "Consumidor Final"
        </div>
      )}
    </div>
  );
}