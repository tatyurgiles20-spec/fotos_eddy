"use client";

type Item = { productId: string; name: string; total: number };

export function TopProductsList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>;
  }

  const max = Math.max(...items.map((i) => i.total));

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={item.productId} className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-sm font-semibold text-muted-foreground">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(item.total / max) * 100}%` }} />
            </div>
          </div>
          <span className="shrink-0 text-sm font-semibold">{item.total}</span>
        </div>
      ))}
    </div>
  );
}