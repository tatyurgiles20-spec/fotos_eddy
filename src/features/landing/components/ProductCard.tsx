import Image from "next/image";
import Link from "next/link";
import type { ProductWithImages } from "@/types/product";

export function ProductCard({ item }: { item: ProductWithImages }) {
  const sortedImages = [...(item.product_images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const cover = sortedImages[0]?.images;
  const basePath = item.type === "service" ? "/servicios" : "/productos";

  return (
    <Link
      href={`${basePath}/${item.slug ?? item.id}`}
      className="card-hover group block overflow-hidden rounded-xl border border-border bg-card shadow-soft"
    >
      <div className="relative aspect-square w-full bg-muted">
        {cover ? (
          <Image
            src={cover.direct_url}
            alt={cover.alt_text ?? item.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-display text-sm font-bold">{item.name}</h4>
        <p className="mt-1 text-sm font-semibold text-primary">${item.sale_price.toFixed(2)}</p>
      </div>
    </Link>
  );
}