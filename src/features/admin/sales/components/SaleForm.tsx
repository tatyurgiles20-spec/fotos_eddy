"use client";

import { useState } from "react";
import { CustomerPicker } from "@/features/admin/customers/components/CustomerPicker";
import { ProductPicker } from "@/features/admin/products/components/ProductPicker";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";

type LineItem = {
  tempId: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type Props = {
  onSave: (payload: {
    customerId: string | null;
    items: { productId: string; quantity: number; unitPrice: number }[];
    paymentMethod: string;
    paymentStatus: string;
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
};

const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: "cash", label: "Efectivo" },
  { value: "transfer", label: "Transferencia" },
  { value: "card", label: "Tarjeta" },
  { value: "credit", label: "Crédito" },
];

export function SaleForm({ onSave, onCancel }: Props) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<LineItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = (product: Product | null) => {
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          tempId: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.sale_price,
        },
      ];
    });
  };

  const updateItem = (tempId: string, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((i) => (i.tempId === tempId ? { ...i, ...patch } : i)));

  const removeItem = (tempId: string) => setItems((prev) => prev.filter((i) => i.tempId !== tempId));

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const isValid = items.length > 0 && items.every((i) => i.quantity > 0 && i.unitPrice >= 0);

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        customerId: customer?.id ?? null,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
        paymentMethod,
        paymentStatus: paymentMethod === "credit" ? "pending" : "paid",
        notes: notes || undefined,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al registrar la venta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <p className="font-display text-lg font-bold">Nueva venta</p>

      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">Cliente</p>
        <CustomerPicker selected={customer} onSelect={setCustomer} />
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">Agregar producto</p>
        <ProductPicker selected={null} onSelect={addProduct} />
      </div>

      {items.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="hidden grid-cols-[1fr_70px_90px_90px_28px] gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
            <span>Producto</span>
            <span>Cant.</span>
            <span>Precio</span>
            <span>Subtotal</span>
            <span></span>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.tempId}
                className="grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-2 sm:grid-cols-[1fr_70px_90px_90px_28px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    ${item.unitPrice.toFixed(2)} c/u · ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.tempId, { quantity: Math.max(1, Number(e.target.value)) })}
                  className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.tempId, { unitPrice: Math.max(0, Number(e.target.value)) })}
                  className="hidden w-20 rounded-md border border-border bg-background px-2 py-1 text-sm sm:block"
                />
                <span className="hidden text-sm font-medium sm:block">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.tempId)}
                  aria-label="Quitar"
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
        <span className="text-sm font-medium text-muted-foreground">Total</span>
        <span className="font-display text-xl font-bold">${total.toFixed(2)}</span>
      </div>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        {PAYMENT_METHODS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Notas (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!isValid || saving}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Registrar venta"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}