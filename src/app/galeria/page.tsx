import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { GalleryView } from "@/features/gallery/views/GalleryView";

export default function GaleriaPage() {
  return (
    <div>
      <Header />

      <main className="min-h-[calc(100vh-4rem)]">
        <GalleryView />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}