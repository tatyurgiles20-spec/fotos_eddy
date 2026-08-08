"use client";

import { useCallback, useEffect, useState } from "react";
import type { InventoryMovement } from "@/types/product";

export function useInventoryMovements(productId: string | null) {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const refresh = useCallback(async () => {
    if (!productId) return setMovements([]);
    const res = await fetch(`/api/inventory-movements?productId=${productId}`);
    setMovements(await res.json());
  }, [productId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addMovement = async (
    movementType: "in" | "out",
    quantity: number,
    unitCost?: number,
    reason?: string
  ) => {
    const res = await fetch("/api/inventory-movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, movementType, quantity, unitCost, reason }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  return { movements, addMovement, refresh };
}