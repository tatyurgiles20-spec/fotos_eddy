"use client";

import { useCallback, useEffect, useState } from "react";
import type { CategoryHighlight } from "@/types/category-highlight";

export function useCategoryHighlights() {
  const [highlights, setHighlights] = useState<CategoryHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/category-highlights");
    setHighlights(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createHighlight = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/category-highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const updateHighlight = async (id: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/category-highlights/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteHighlight = async (id: string) => {
    const res = await fetch(`/api/category-highlights/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  return { highlights, loading, createHighlight, updateHighlight, deleteHighlight, refresh };
}