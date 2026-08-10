"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/features/admin/products/hooks/useProducts";
import { useInventoryMovementsList } from "../hooks/useInventoryMovementsList";
import { InventoryMovementList } from "../components/InventoryMovementList";
import { InventoryMovementForm } from "../components/InventoryMovementForm";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import type { InventoryMovement } from "@/types/product";

const TABS = [
  { key: "in" as const, label: "Ingresos" },
  { key: "out" as const, label: "Egresos" },
];

export function InventoryMovementsManagerView() {
  const [tab, setTab] = useState<"in" | "out">("in");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editing, setEditing] = useState<InventoryMovement | null | undefined>(undefined); // undefined = modal cerrado

  const { products, refresh: refreshProducts } = useProducts(null);
  const { movements, addMovement, updateMovement, deleteMovement, refresh: refreshMovements } =
    useInventoryMovementsList(tab);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return movements;
    return movements.filter(
      (m) =>
        (m.products?.name ?? "").toLowerCase().includes(term) ||
        (m.products?.sku ?? "").toLowerCase().includes(term) ||
        (m.reason ?? "").toLowerCase().includes(term)
    );
  }, [movements, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (page > totalPages) {
    setPage(1);
  }
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleTabChange = (next: "in" | "out") => {
    setTab(next);
    setSearch("");
    setPage(1);
  };

  const handleSave = async (payload: {
    productId: string;
    quantity: number;
    unitCost?: number;
    reason?: string;
  }) => {
    if (editing) {
      await updateMovement(editing.id, payload);
    } else {
      await addMovement(payload);
    }
    setEditing(undefined);
    await refreshProducts(); // el stock del producto pudo haber cambiado
  };

  const handleDelete = async (id: string) => {
    await deleteMovement(id);
    await refreshProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Inventario</p>
        <button
          onClick={() => setEditing(null)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Nuevo {tab === "in" ? "ingreso" : "egreso"}
        </button>
      </div>

      <div className="flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar por producto, SKU o motivo..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {editing !== undefined && (
        <Modal onClose={() => setEditing(undefined)} maxWidth="max-w-md">
          <InventoryMovementForm
            movementType={tab}
            movement={editing}
            products={products}
            onSave={handleSave}
            onCancel={() => setEditing(undefined)}
          />
        </Modal>
      )}

      <InventoryMovementList
        movements={paginated}
        movementType={tab}
        onEdit={(m) => setEditing(m)}
        onDelete={handleDelete}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}