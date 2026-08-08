"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductCategory } from "@/types/product";

export function useProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/product-categories");
    setCategories(await res.json());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createCategory = async (name: string, slug: string) => {
    const res = await fetch("/api/product-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteCategory = async (id: string) => {
  const res = await fetch(`/api/product-categories/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error);
  await refresh();
};

return { categories, createCategory, deleteCategory, refresh };
}