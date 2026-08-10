"use client";

import { useCallback, useState } from "react";
import type { SaleDetail } from "@/types/sale";

export function useSaleDetail() {
  const [detail, setDetail] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setDetail(null);
    setError(null);
    try {
      const res = await fetch(`/api/sales/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al cargar la venta");
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar la venta");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = () => {
    setDetail(null);
    setError(null);
  };

  return { detail, loading, error, load, clear };
}