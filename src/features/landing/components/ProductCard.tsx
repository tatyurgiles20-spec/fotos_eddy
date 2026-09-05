import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
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
      className="card-hover group relative block overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-shadow duration-300 hover:shadow-elevated"
    >
      {/* Badge de tipo (Producto/Servicio), dato real que ya tenías en item.type */}
      <span className="absolute left-2 top-2 z-10 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary shadow-soft">
        {item.type === "service" ? "Servicio" : "Producto"}
      </span>

      <div className="relative aspect-square w-full bg-muted">
        {cover ? (
          <>
            <Image
              src={cover.direct_url}
              alt={cover.alt_text ?? item.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Sombra ultra clara y delicada */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/30 opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Ícono de vista rápida al hacer hover, solo decorativo */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft">
                <Eye className="h-4 w-4" />
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="section-subtitle text-sm !font-semibold line-clamp-1">{item.name}</h4>
        <p className="btn mt-1 text-sm !font-bold text-primary">${item.sale_price.toFixed(2)}</p>
      </div>
    </Link>
  );
}