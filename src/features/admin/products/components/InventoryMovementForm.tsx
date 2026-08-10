"use client";

import { useEffect, useState } from "react";
import { ProductPicker } from "./ProductPicker";
import type { InventoryMovement, Product } from "@/types/product";

type Props = {
  movementType: "in" | "out";
  movement: InventoryMovement | null; // null = nuevo
  products: Product[]; // para resolver el producto seleccionado al editar
  onSave: (payload: {
    productId: string;
    quantity: number;
    unitCost?: number;
    reason?: string;
  }) => Promise<void>;
  onCancel: () => void;
};

export function InventoryMovementForm({ movementType, movement, products, onSave, onCancel }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movement) return;
    const found = products.find((p) => p.id === movement.product_id) ?? null;
    setSelectedProduct(found);
    setQuantity(movement.quantity.toString());
    setUnitCost(movement.unit_cost?.toString() ?? "");
    setReason(movement.reason ?? "");
  }, [movement, products]);

  const isValid = !!selectedProduct && Number(quantity) > 0;

  const willExceedStock =
    movementType === "out" &&
    selectedProduct &&
    Number(quantity || 0) >
      // si estamos editando, el stock "disponible" ya incluye este movimiento revertido
      (movement && movement.product_id === selectedProduct.id
        ? selectedProduct.stock + movement.quantity
        : selectedProduct.stock);

  const handleSubmit = async () => {
    if (!isValid || !selectedProduct) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        productId: selectedProduct.id,
        quantity: Number(quantity),
        unitCost: unitCost ? Number(unitCost) : undefined,
        reason: reason || undefined,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el movimiento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <p className="font-display text-lg font-bold">
        {movement ? "Editar" : "Nuevo"} {movementType === "in" ? "ingreso" : "egreso"}
      </p>

      <ProductPicker selected={selectedProduct} onSelect={setSelectedProduct} />

      <input
        type="number"
        placeholder="Cantidad *"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {willExceedStock && (
        <p className="text-xs text-amber-600">
          ⚠ Esta salida deja el stock en negativo. Revisa la cantidad si no es intencional.
        </p>
      )}

      {movementType === "in" && (
        <input
          type="number"
          placeholder="Costo unitario (opcional)"
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      )}

      <input
        type="text"
        placeholder="Motivo (ej: compra, venta, ajuste)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!isValid || saving}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
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