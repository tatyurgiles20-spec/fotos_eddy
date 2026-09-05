import { Sparkles } from "lucide-react";
import { getServices } from "../api/get-services";
import { getServiceCategories } from "../api/get-service-categories";
import { getCategoryHighlightDescription } from "../api/get-category-highlight";
import { CategoryFilter } from "@/features/products/components/CategoryFilter";
import { ProductCard } from "@/features/landing/components/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function ServicesView({ categorySlug }: { categorySlug?: string }) {
  const [services, categories, highlightDescription] = await Promise.all([
    getServices(categorySlug),
    getServiceCategories(),
    categorySlug ? getCategoryHighlightDescription(categorySlug) : Promise.resolve(null),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <>
      <main className="section-spacing relative mx-auto max-w-7xl px-6 overflow-hidden">
        {/* Blobs decorativos de fondo, mismo patrón que el resto de la landing */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mb-8 sm:mb-10 text-center">
          <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-4 w-4" />
            Catálogo
          </span>
          <h1 className="section-title mt-2 !text-4xl sm:!text-5xl text-foreground">
            {activeCategory ? activeCategory.name : "Servicios"}
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
        </div>

        <div className="relative">
          <CategoryFilter
            categories={categories}
            activeSlug={categorySlug}
            basePath="/servicios"
            description={highlightDescription}
          />

          {services.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No hay servicios disponibles en esta categoría todavía.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {services.map((service) => (
                <ProductCard key={service.id} item={service} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}