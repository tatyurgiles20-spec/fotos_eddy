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
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h3>
        <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
          Ver todos →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}