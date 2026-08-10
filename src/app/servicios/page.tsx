import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { ServicesView } from "@/features/services/views/ServicesView";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  return (
    <div>
      <Header />

      <main className="min-h-[calc(100vh-4rem)]">
        <ServicesView categorySlug={categoria} />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}