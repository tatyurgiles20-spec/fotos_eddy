"use client";

type Props = {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
};

export function Pagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-3 text-sm sm:flex-row">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>
          {from}–{to} de {totalItems}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} por página
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium disabled:opacity-30"
        >
          ← Anterior
        </button>
        <span className="text-xs text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium disabled:opacity-30"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}