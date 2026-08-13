import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { ProductWithImages } from "@/types/product";

type Props = {
  title: string;
  items: ProductWithImages[];
  viewAllHref: string;
};

export function RankingSection({ title, items, viewAllHref }: Props) {
  if (items.length === 0) return null;

  return (
   <section className="mx-auto max-w-7xl px-6 py-14">
      {/* Encabezado centrado con enlace simétrico */}
      <div className="mb-10 flex flex-col items-center text-center gap-2 sm:flex-row sm:justify-between sm:text-left">
        {/* Elemento invisible para balancear el grid en pantallas grandes si se prefiere centrado perfecto */}
        <div className="hidden sm:block sm:w-28" />

        {/* Título centrado */}
        <h3 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground text-center">
          {title}
        </h3>

        {/* Enlace "Ver todos" */}
        <div className="sm:w-28 sm:text-right">
          <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
            Ver todos →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}