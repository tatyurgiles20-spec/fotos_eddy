"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";

export function useProducts(categoryId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ all: "true" });
    if (categoryId) params.set("categoryId", categoryId);
    const res = await fetch(`/api/products?${params.toString()}`);
    setProducts(await res.json());
    setLoading(false);
  }, [categoryId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProduct = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const updateProduct = async (id: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  return { products, loading, createProduct, updateProduct, deleteProduct, refresh };
}