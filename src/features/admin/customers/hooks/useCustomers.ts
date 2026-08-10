"use client";

import { useCallback, useEffect, useState } from "react";
import type { Customer } from "@/types/customer";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/customers");
    setCustomers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createCustomer = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const updateCustomer = async (id: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteCustomer = async (id: string) => {
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  return { customers, loading, createCustomer, updateCustomer, deleteCustomer, refresh };
}