"use client";

import type { Frame } from "@/types/frame";
import type { FrameStatusFilter } from "../hooks/useFrames";
import { Pagination } from "@/components/ui/Pagination";

type Props = {
  frames: Frame[];
  totalItems: number;
  page: number;
  pageSize: number;
  search: string;
  status: FrameStatusFilter;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: FrameStatusFilter) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onToggleActive: (frame: Frame) => void;
  onRename: (frame: Frame) => void;
  onDelete: (id: string) => void;
};

export function FrameList({
  frames,
  totalItems,
  page,
  pageSize,
  search,
  status,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onStatusChange,
  onMove,
  onToggleActive,
  onRename,
  onDelete,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar marco por nombre..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm sm:max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as FrameStatusFilter)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      {frames.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay marcos que coincidan con la búsqueda.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {frames.map((frame, i) => (
          <div key={frame.id} className="rounded-xl border border-border bg-card p-3">
            <img
              src={frame.directUrl}
              alt={frame.name}
              className="mb-2 aspect-square w-full rounded-lg bg-muted object-contain"
            />
            <p className="truncate text-sm font-semibold">{frame.name}</p>

            <div className="mt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => onToggleActive(frame)}
                className={`rounded-full px-2 py-0.5 font-medium ${
                  frame.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {frame.isActive ? "Activo" : "Inactivo"}
              </button>
              <div className="flex gap-1">
                <button onClick={() => onMove(frame.id, "up")} disabled={i === 0} className="disabled:opacity-30">
                  ↑
                </button>
                <button
                  onClick={() => onMove(frame.id, "down")}
                  disabled={i === frames.length - 1}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>

            <div className="mt-2 flex justify-between text-xs">
              <button onClick={() => onRename(frame)} className="font-medium text-primary hover:underline">
                Editar
              </button>
              <button onClick={() => onDelete(frame.id)} className="font-medium text-destructive hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={page}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}