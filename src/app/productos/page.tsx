import { ProductsView } from "@/features/products/views/ProductsView";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  return <ProductsView categorySlug={categoria} />;
}