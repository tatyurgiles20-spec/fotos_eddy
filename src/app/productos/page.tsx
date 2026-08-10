import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { ProductsView } from "@/features/products/views/ProductsView";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  return (
    <div>
      <Header />

      <main className="min-h-[calc(100vh-4rem)]">
        <ProductsView categorySlug={categoria} />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}