"use client";

import { useMemo, useState, useEffect } from "react";
import { useCustomers } from "../hooks/useCustomers";
import { CustomerForm } from "../components/CustomerForm";
import { CustomerList } from "../components/CustomerList";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import type { Customer } from "@/types/customer";

export function CustomersManagerView() {
  const { customers, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [editing, setEditing] = useState<Customer | null | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Nos aseguramos de que siempre trabajamos sobre un arreglo seguro
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return safeCustomers;

    return safeCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.identification ?? "").toLowerCase().includes(term) ||
        (c.email ?? "").toLowerCase().includes(term) ||
        (c.phone ?? "").toLowerCase().includes(term)
    );
  }, [safeCustomers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // 2. Controlamos el desbordamiento de página usando useEffect en lugar de set state en el render
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSave = async (payload: Record<string, unknown>) => {
    if (editing) {
      await updateCustomer(editing.id, payload);
    } else {
      await createCustomer(payload);
    }
    setEditing(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Clientes</p>
        <button
          onClick={() => setEditing(null)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Nuevo cliente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, identificación, correo o teléfono..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {editing !== undefined && (
        <Modal onClose={() => setEditing(undefined)} maxWidth="max-w-lg">
          <CustomerForm customer={editing} onSave={handleSave} onCancel={() => setEditing(undefined)} />
        </Modal>
      )}

      <CustomerList customers={paginated} onDelete={deleteCustomer} onEdit={(c) => setEditing(c)} />

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