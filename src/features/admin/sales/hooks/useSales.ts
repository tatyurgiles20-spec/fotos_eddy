"use client";

import { useCallback, useEffect, useState } from "react";
import type { Sale } from "@/types/sale";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/sales");
    setSales(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

const createSale = async (payload: {
  customerId: string | null;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discountType?: "amount" | "percentage" | null;
    discountValue?: number;
  }[];
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  discountType?: "amount" | "percentage" | null;
  discountValue?: number;
}) => {
  const res = await fetch("/api/sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  await refresh();
};
  const cancelSale = async (id: string) => {
    const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  return { sales, loading, createSale, cancelSale, refresh };
}