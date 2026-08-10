"use client";

import { useCallback, useEffect, useState } from "react";
import type { InventoryMovement } from "@/types/product";

export function useInventoryMovementsList(movementType: "in" | "out") {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/inventory-movements?movementType=${movementType}`);
    setMovements(await res.json());
    setLoading(false);
  }, [movementType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addMovement = async (payload: {
    productId: string;
    quantity: number;
    unitCost?: number;
    reason?: string;
  }) => {
    const res = await fetch("/api/inventory-movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, movementType }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const updateMovement = async (
    id: string,
    payload: { productId: string; quantity: number; unitCost?: number; reason?: string }
  ) => {
    const res = await fetch(`/api/inventory-movements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteMovement = async (id: string) => {
    const res = await fetch(`/api/inventory-movements/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  return { movements, loading, addMovement, updateMovement, deleteMovement, refresh };
}