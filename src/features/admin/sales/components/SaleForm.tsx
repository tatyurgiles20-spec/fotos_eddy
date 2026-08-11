"use client";

import { useState } from "react";
import { CustomerPicker } from "@/features/admin/customers/components/CustomerPicker";
import { ProductPicker } from "@/features/admin/products/components/ProductPicker";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import type { DiscountType } from "@/types/sale";

type LineItem = {
  tempId: string;
  productId: string;
  name: string;
  quantity: number | string;
  unitPrice: number | string;
  discountType: DiscountType | null;
  discountValue: number | string;
};

type Props = {
  onSave: (payload: {
    customerId: string | null;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
      discountType?: DiscountType | null;
      discountValue?: number;
    }[];
    paymentMethod: string;
    paymentStatus: string;
    notes?: string;
    discountType?: DiscountType | null;
    discountValue?: number;
  }) => Promise<void>;
  onCancel: () => void;
};

const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: "cash", label: "Efectivo" },
  { value: "transfer", label: "Transferencia" },
  { value: "card", label: "Tarjeta" },
  { value: "credit", label: "Crédito" },
];

function lineDiscountAmount(item: LineItem): number {
  const qty = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const discountValue = Number(item.discountValue) || 0;
  const raw = qty * unitPrice;

  if (item.discountType === "percentage") return Math.min(raw, (raw * discountValue) / 100);
  if (item.discountType === "amount") return Math.min(raw, discountValue);
  return 0;
}

export function SaleForm({ onSave, onCancel }: Props) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<LineItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderDiscountType, setOrderDiscountType] = useState<DiscountType | null>(null);
  const [orderDiscountValue, setOrderDiscountValue] = useState<number | string>(0);

  const addProduct = (product: Product | null) => {
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: (Number(i.quantity) || 0) + 1 } : i
        );
      }
      return [
        ...prev,
        {
          tempId: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.sale_price,
          discountType: null,
          discountValue: 0,
        },
      ];
    });
  };

  const updateItem = (tempId: string, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((i) => (i.tempId === tempId ? { ...i, ...patch } : i)));

  const removeItem = (tempId: string) => setItems((prev) => prev.filter((i) => i.tempId !== tempId));

  const rawSubtotal = items.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
    0
  );
  const itemsDiscountTotal = items.reduce((sum, i) => sum + lineDiscountAmount(i), 0);
  const netAfterItemDiscounts = rawSubtotal - itemsDiscountTotal;

  const orderDiscountNum = Number(orderDiscountValue) || 0;
  const orderDiscountAmount =
    orderDiscountType === "percentage"
      ? Math.min(netAfterItemDiscounts, (netAfterItemDiscounts * orderDiscountNum) / 100)
      : orderDiscountType === "amount"
      ? Math.min(netAfterItemDiscounts, orderDiscountNum)
      : 0;

  const discountTotal = itemsDiscountTotal + orderDiscountAmount;
  const grandTotal = rawSubtotal - discountTotal;

  const isValid =
    items.length > 0 &&
    items.every(
      (i) =>
        i.quantity !== "" &&
        !isNaN(Number(i.quantity)) &&
        Number(i.quantity) > 0 &&
        i.unitPrice !== "" &&
        !isNaN(Number(i.unitPrice)) &&
        Number(i.unitPrice) >= 0
    );

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        customerId: customer?.id ?? null,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity) || 1,
          unitPrice: Number(i.unitPrice) || 0,
          discountType: i.discountType,
          discountValue: Number(i.discountValue) || 0,
        })),
        paymentMethod,
        paymentStatus: paymentMethod === "credit" ? "pending" : "paid",
        notes: notes || undefined,
        discountType: orderDiscountType,
        discountValue: Number(orderDiscountValue) || 0,
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
          <div className="hidden grid-cols-[1fr_60px_80px_100px_90px_28px] gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
            <span>Producto</span>
            <span>Cant.</span>
            <span>Precio</span>
            <span>Descuento</span>
            <span>Subtotal</span>
            <span></span>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {items.map((item) => {
              const qty = Number(item.quantity) || 0;
              const unitPrice = Number(item.unitPrice) || 0;
              const rawLine = qty * unitPrice;
              const lineDiscount = lineDiscountAmount(item);
              const lineNet = rawLine - lineDiscount;
              return (
                <div
                  key={item.tempId}
                  className="flex flex-col gap-2 px-3 py-2 sm:grid sm:grid-cols-[1fr_60px_80px_100px_90px_28px] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      ${unitPrice.toFixed(2)} c/u · ${lineNet.toFixed(2)}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => updateItem(item.tempId, { quantity: e.target.value })}
                    onBlur={() => {
                      const num = Number(item.quantity);
                      if (item.quantity === "" || isNaN(num) || num < 1) {
                        updateItem(item.tempId, { quantity: 1 });
                      } else {
                        updateItem(item.tempId, { quantity: num });
                      }
                    }}
                    className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => updateItem(item.tempId, { unitPrice: e.target.value })}
                    onBlur={() => {
                      const num = Number(item.unitPrice);
                      if (item.unitPrice === "" || isNaN(num) || num < 0) {
                        updateItem(item.tempId, { unitPrice: 0 });
                      } else {
                        updateItem(item.tempId, { unitPrice: num });
                      }
                    }}
                    className="hidden w-20 rounded-md border border-border bg-background px-2 py-1 text-sm sm:block"
                  />
                  <div className="flex items-center gap-1">
                    <select
                      value={item.discountType ?? "none"}
                      onChange={(e) =>
                        updateItem(item.tempId, {
                          discountType: e.target.value === "none" ? null : (e.target.value as DiscountType),
                          discountValue: e.target.value === "none" ? 0 : item.discountValue,
                        })
                      }
                      className="rounded-md border border-border bg-background px-1 py-1 text-xs"
                    >
                      <option value="none">—</option>
                      <option value="amount">$</option>
                      <option value="percentage">%</option>
                    </select>
                    {item.discountType && (
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.discountValue}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateItem(item.tempId, { discountValue: e.target.value })}
                        onBlur={() => {
                          const num = Number(item.discountValue);
                          if (item.discountValue === "" || isNaN(num) || num < 0) {
                            updateItem(item.tempId, { discountValue: 0 });
                          } else {
                            updateItem(item.tempId, { discountValue: num });
                          }
                        }}
                        className="w-16 rounded-md border border-border bg-background px-2 py-1 text-xs"
                      />
                    )}
                  </div>
                  <span className="hidden text-sm font-medium sm:block">${lineNet.toFixed(2)}</span>
                  <button
                    onClick={() => removeItem(item.tempId)}
                    aria-label="Quitar"
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Descuento sobre el total de la venta */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">Descuento adicional a la venta</span>
        <select
          value={orderDiscountType ?? "none"}
          onChange={(e) => {
            const v = e.target.value;
            setOrderDiscountType(v === "none" ? null : (v as DiscountType));
            if (v === "none") setOrderDiscountValue(0);
          }}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          <option value="none">Sin descuento</option>
          <option value="amount">Monto fijo ($)</option>
          <option value="percentage">Porcentaje (%)</option>
        </select>
        {orderDiscountType && (
          <input
            type="number"
            min={0}
            step="0.01"
            value={orderDiscountValue}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setOrderDiscountValue(e.target.value)}
            onBlur={() => {
              const num = Number(orderDiscountValue);
              if (orderDiscountValue === "" || isNaN(num) || num < 0) {
                setOrderDiscountValue(0);
              } else {
                setOrderDiscountValue(num);
              }
            }}
            className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
        )}
      </div>

      <div className="space-y-1 rounded-lg border border-border bg-muted/30 px-3 py-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>${rawSubtotal.toFixed(2)}</span>
        </div>
        {discountTotal > 0 && (
          <div className="flex items-center justify-between text-sm text-destructive">
            <span>Descuento total</span>
            <span>-${discountTotal.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="font-display text-xl font-bold">${grandTotal.toFixed(2)}</span>
        </div>
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

      <textarea
        placeholder="Notas (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
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