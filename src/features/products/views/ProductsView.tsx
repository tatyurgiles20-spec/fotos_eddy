import { getProducts } from "../api/get-products";
import { getProductCategories } from "../api/get-product-categories";
import { getCategoryHighlightDescription } from "../api/get-category-highlight";
import { CategoryFilter } from "../components/CategoryFilter";
import { ProductCard } from "@/features/landing/components/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function ProductsView({ categorySlug }: { categorySlug?: string }) {
  const [products, categories, highlightDescription] = await Promise.all([
    getProducts(categorySlug),
    getProductCategories(),
    categorySlug ? getCategoryHighlightDescription(categorySlug) : Promise.resolve(null),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Catálogo</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {activeCategory ? activeCategory.name : "Productos"}
          </h1>
        </div>

        <CategoryFilter
          categories={categories}
          activeSlug={categorySlug}
          basePath="/productos"
          description={highlightDescription}
        />

        {products.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No hay productos disponibles en esta categoría todavía.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}