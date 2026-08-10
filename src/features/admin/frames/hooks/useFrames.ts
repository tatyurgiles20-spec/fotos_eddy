"use client";

import { useCallback, useEffect, useState } from "react";
import type { Frame } from "@/types/frame";

export type FrameStatusFilter = "all" | "active" | "inactive";

export function useFrames() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FrameStatusFilter>("all");

  const refresh = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      search,
      status,
    });
    const res = await fetch(`/api/frames?${params.toString()}`);
    const { data, count } = await res.json();
    setFrames(data ?? []);
    setTotalItems(count ?? 0);
    setLoading(false);
  }, [page, pageSize, search, status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Búsqueda/filtro cambian → volvemos a página 1
  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const updateStatus = (value: FrameStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const createFrame = async (file: File, name: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    const res = await fetch("/api/frames", { method: "POST", body: formData });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const updateFrame = async (id: string, input: Partial<Pick<Frame, "name" | "isActive" | "sortOrder">>) => {
    const res = await fetch(`/api/frames/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        is_active: input.isActive,
        sort_order: input.sortOrder,
      }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteFrame = async (id: string) => {
    const res = await fetch(`/api/frames/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const moveFrame = async (id: string, direction: "up" | "down") => {
    const index = frames.findIndex((f) => f.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= frames.length) return;

    const current = frames[index];
    const target = frames[targetIndex];

    await Promise.all([
      updateFrame(current.id, { sortOrder: target.sortOrder }),
      updateFrame(target.id, { sortOrder: current.sortOrder }),
    ]);
  };

  return {
    frames,
    totalItems,
    loading,
    page,
    pageSize,
    search,
    status,
    setPage,
    setPageSize,
    setSearch: updateSearch,
    setStatus: updateStatus,
    createFrame,
    updateFrame,
    deleteFrame,
    moveFrame,
    refresh,
  };
}