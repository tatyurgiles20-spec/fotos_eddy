import { ProductDetailView } from "@/features/products/views/ProductDetailView";

export default async function ProductoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}