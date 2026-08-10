"use client";

import { useMemo, useState } from "react";
import { useSales } from "../hooks/useSales";
import { useSaleDetail } from "../hooks/useSaleDetail";
import { SaleForm } from "../components/SaleForm";
import { SaleList } from "../components/SaleList";
import { SaleDetail } from "../components/SaleDetail";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import type { Sale } from "@/types/sale";

export function SalesManagerView() {
  const { sales, createSale, cancelSale } = useSales();
  const { detail, loading: loadingDetail, error: detailError, load, clear } = useSaleDetail();
  const [showForm, setShowForm] = useState(false);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return sales;
    return sales.filter(
      (s) =>
        (s.customer_name ?? "consumidor final").toLowerCase().includes(term) ||
        s.sale_number.toString().includes(term)
    );
  }, [sales, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (page > totalPages) {
    setPage(1);
  }
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleView = (sale: Sale) => {
    setViewingSale(sale);
    load(sale.id);
  };

  const handleCloseDetail = () => {
    setViewingSale(null);
    clear();
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelSale(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cancelar la venta");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Ventas</p>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Nueva venta
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por cliente o folio..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {showForm && (
        <Modal onClose={() => setShowForm(false)} maxWidth="max-w-2xl">
          <SaleForm
            onSave={async (payload) => {
              await createSale(payload);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}

      {viewingSale && (
        <Modal onClose={handleCloseDetail} maxWidth="max-w-xl">
          <SaleDetail sale={detail} loading={loadingDetail} error={detailError} />
        </Modal>
      )}

      <SaleList sales={paginated} onView={handleView} onCancel={handleCancel} />

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