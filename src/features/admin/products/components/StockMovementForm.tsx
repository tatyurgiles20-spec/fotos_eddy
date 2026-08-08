"use client";

import { useState } from "react";

type Props = {
  onSubmit: (type: "in" | "out", quantity: number, unitCost?: number, reason?: string) => Promise<void>;
};

export function StockMovementForm({ onSubmit }: Props) {
  const [type, setType] = useState<"in" | "out">("in");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!quantity) return;
    setSaving(true);
    try {
      await onSubmit(type, Number(quantity), unitCost ? Number(unitCost) : undefined, reason || undefined);
      setQuantity("");
      setUnitCost("");
      setReason("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-sm font-semibold">Registrar movimiento de inventario</p>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setType("in")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
            type === "in" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Entrada
        </button>
        <button
          type="button"
          onClick={() => setType("out")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
            type === "out" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Salida
        </button>
      </div>
      <input
        type="number"
        placeholder="Cantidad"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      {type === "in" && (
        <input
          type="number"
          placeholder="Costo unitario (opcional)"
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      )}
      <input
        type="text"
        placeholder="Motivo (ej: compra, venta, ajuste)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={!quantity || saving}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Registrar"}
      </button>
    </div>
  );
}