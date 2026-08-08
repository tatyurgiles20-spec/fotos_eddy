import { ServicesView } from "@/features/services/views/ServicesView";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  return <ServicesView categorySlug={categoria} />;
}