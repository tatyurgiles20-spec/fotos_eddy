import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../api/get-product-by-slug";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function ProductDetailView({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const sortedImages = [...(product.product_images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="grid gap-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted">
              {sortedImages[0]?.images && (
                <Image
                  src={sortedImages[0].images.direct_url}
                  alt={sortedImages[0].images.alt_text ?? product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {sortedImages.slice(1).map(
                  (img) =>
                    img.images && (
                      <div key={img.image_id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                        <Image src={img.images.direct_url} alt={img.images.alt_text ?? ""} fill className="object-cover" />
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold">{product.name}</h1>
            <p className="mt-3 text-2xl font-semibold text-primary">${product.sale_price.toFixed(2)}</p>
            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}