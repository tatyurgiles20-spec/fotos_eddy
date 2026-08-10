"use client";

import type { Customer } from "@/types/customer";

type Props = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
};

const ID_TYPE_LABEL: Record<string, string> = {
  cedula: "Cédula",
  ruc: "RUC",
  pasaporte: "Pasaporte",
};

export function CustomerList({ customers, onEdit, onDelete }: Props) {
  if (customers.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay clientes registrados.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden grid-cols-[1fr_140px_1fr_140px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
        <span>Cliente</span>
        <span>Identificación</span>
        <span>Contacto</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {customers.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-3 sm:grid-cols-[1fr_140px_1fr_140px]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{c.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground sm:hidden">
                {c.email || c.phone || "—"}
              </p>
            </div>

            <span className="hidden text-sm text-muted-foreground sm:block">
              {c.identification ? (
                <>
                  {ID_TYPE_LABEL[c.identification_type ?? ""] ?? ""} {c.identification}
                </>
              ) : (
                "—"
              )}
            </span>

            <div className="hidden min-w-0 text-sm text-muted-foreground sm:block">
              {c.email && <p className="truncate">{c.email}</p>}
              {c.phone && <p className="truncate">{c.phone}</p>}
              {!c.email && !c.phone && "—"}
            </div>

            <div className="col-span-2 flex items-center justify-end gap-3 pt-1 text-xs sm:col-span-1 sm:pt-0">
              <button onClick={() => onEdit(c)} className="font-medium text-primary hover:underline">
                Editar
              </button>
              <button onClick={() => onDelete(c.id)} className="font-medium text-destructive hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}