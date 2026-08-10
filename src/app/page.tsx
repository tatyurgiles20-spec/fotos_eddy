import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { LandingView } from "@/features/landing/views/LandingView"; 

export default function Home() {
  return (
    <div>
      <Header />

      <main>
        <LandingView />
      </main>

      <Footer />
      <SocialFloatingBar />
    </div>
  );
}