import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { ServiceDetailView } from "@/features/services/views/ServiceDetailView";

export default async function ServicioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <Header />

      <main className="min-h-[calc(100vh-4rem)]">
        <ServiceDetailView slug={slug} />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}