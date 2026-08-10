import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { ProductDetailView } from "@/features/products/views/ProductDetailView";

export default async function ProductoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <Header />

      <main className="min-h-[calc(100vh-4rem)]">
        <ProductDetailView slug={slug} />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}