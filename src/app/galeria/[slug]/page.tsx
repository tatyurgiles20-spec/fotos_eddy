import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { AlbumView } from "@/features/gallery/views/AlbumView";

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div>
      <Header />

      <main className="min-h-[calc(100vh-4rem)]">
        <AlbumView slug={slug} />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}