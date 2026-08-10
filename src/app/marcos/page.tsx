import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { getFrames } from "@/features/marcos/api/get-frames";
import { MarcosView } from "@/features/marcos/views/MarcosView";

export default async function MarcosPage() {
  const frames = await getFrames();

  return (
    <div>
      <Header />

      {/* min-h-[calc(100vh-4rem)] asegura que la vista negra ocupe toda la pantalla visible */}
      <main className="min-h-[calc(100vh-4rem)]">
        <MarcosView frames={frames} />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}