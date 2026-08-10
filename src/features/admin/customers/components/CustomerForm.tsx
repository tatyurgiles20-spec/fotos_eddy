"use client";

import { useEffect, useState } from "react";
import type { Customer, IdentificationType } from "@/types/customer";

type Props = {
  customer: Customer | null; // null = nuevo
  onSave: (payload: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
};

const ID_TYPE_OPTIONS: { value: IdentificationType; label: string }[] = [
  { value: "cedula", label: "Cédula" },
  { value: "ruc", label: "RUC" },
  { value: "pasaporte", label: "Pasaporte" },
];

export function CustomerForm({ customer, onSave, onCancel }: Props) {
  const [name, setName] = useState("");
  const [identificationType, setIdentificationType] = useState<IdentificationType | "">("");
  const [identification, setIdentification] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customer) return;
    setName(customer.name);
    setIdentificationType(customer.identification_type ?? "");
    setIdentification(customer.identification ?? "");
    setEmail(customer.email ?? "");
    setPhone(customer.phone ?? "");
    setAddress(customer.address ?? "");
  }, [customer]);

  const isValid = name.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name,
        identificationType: identificationType || null,
        identification: identification || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el cliente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <p className="font-display text-lg font-bold">{customer ? "Editar" : "Nuevo"} cliente</p>

      <input
        type="text"
        placeholder="Nombre *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={identificationType}
          onChange={(e) => setIdentificationType(e.target.value as IdentificationType | "")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Sin identificación</option>
          {ID_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Número"
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
          disabled={!identificationType}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-50"
        />
      </div>

      <input
        type="email"
        placeholder="Correo (opcional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      <input
        type="text"
        placeholder="Teléfono (opcional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      <textarea
        placeholder="Dirección (opcional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={2}
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