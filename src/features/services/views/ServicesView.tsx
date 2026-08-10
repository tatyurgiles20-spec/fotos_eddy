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
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Catálogo</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {activeCategory ? activeCategory.name : "Servicios"}
          </h1>
        </div>

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
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {services.map((service) => (
              <ProductCard key={service.id} item={service} />
            ))}
          </div>
        )}
      </main> 
    </>
  );
}