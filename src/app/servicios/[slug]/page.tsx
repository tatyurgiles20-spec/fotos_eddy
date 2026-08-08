import { ServiceDetailView } from "@/features/services/views/ServiceDetailView";

export default async function ServicioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailView slug={slug} />;
}