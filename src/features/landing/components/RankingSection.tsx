import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
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
    <section className="section-spacing relative mx-auto max-w-7xl px-6 overflow-hidden">
      {/* Blobs decorativos de fondo, igual que en las secciones anteriores */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      {/* Encabezado centrado con enlace simétrico */}
      <div className="relative mb-6 sm:mb-8 flex flex-col items-center text-center gap-3 sm:flex-row sm:justify-between sm:text-left">
        {/* Elemento invisible para balancear el grid en pantallas grandes si se prefiere centrado perfecto */}
        <div className="hidden sm:block sm:w-28" />

        {/* Título centrado */}
        <div className="flex flex-col items-center">
          <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-1">
            <Sparkles className="h-4 w-4" />
            Lo más destacado
          </span>
          <h3 className="section-title !text-5xl sm:!text-6xl md:!text-7xl text-foreground text-center">
            {title}
          </h3>
          <div className="mt-3 h-1 w-16 rounded-full bg-primary/70" />
        </div>

        {/* Enlace "Ver todos" */}
        <div className="sm:w-28 sm:text-right">
          <Link
            href={viewAllHref}
            className="btn inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium text-primary shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/40"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
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