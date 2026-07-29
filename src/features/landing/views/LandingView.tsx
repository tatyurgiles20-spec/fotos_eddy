import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { FeaturedGallery } from "@/features/landing/components/FeaturedGallery";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { ServicesSection } from "@/features/landing/components/ServicesSection";
import { PromoCarousel } from "@/features/landing/components/PromoCarousel";
import { ServicesCarousel } from "@/features/landing/components/ServicesCarousel";
import { getFeaturedImages } from "@/features/landing/api/get-featured-images";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export async function LandingView() {
  const featuredImages = await getFeaturedImages("home_destacadas");

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-primary-light/40 transition-colors duration-300">
        <PromoCarousel />
        <ServicesCarousel />

        <HeroSection />
        <ServicesSection />

        {/* ── GALERÍA DE TRABAJOS DESTACADOS ── */}
        <section className="py-20">
          <FeaturedGallery images={featuredImages} />
        </section>
      </main>

      <Footer />
      <SocialFloatingBar />
    </>
  );
}