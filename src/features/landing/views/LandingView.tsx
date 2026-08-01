import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { FeaturedGallery } from "@/features/landing/components/FeaturedGallery";
import { ServicesSection } from "@/features/landing/components/ServicesSection";
import { PromoCarousel } from "@/features/landing/components/PromoCarousel";
import { ServicesCarousel } from "@/features/landing/components/ServicesCarousel";
import { NosotrosSection } from "@/features/landing/components/NosotrosSection";
import { getFeaturedImages } from "@/features/landing/api/get-featured-images";
import { getCarouselSlides } from "@/features/landing/api/get-carousel-slides";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export async function LandingView() {
  const [featuredImages, promoSlides] = await Promise.all([
    getFeaturedImages("home_destacadas"),
    getCarouselSlides("promo"),
  ]);

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-primary-light/40 transition-colors duration-300">
        {/* 1. HERO CARRUSEL PRINCIPAL (Reemplaza a HeroSection) */}
        {promoSlides.length > 0 && <PromoCarousel slides={promoSlides} />}

        {/* 2. SERVICIOS Y PRODUCTOS DESTACADOS */}
        <ServicesSection />
        <ServicesCarousel />

        {/* 3. SOBRE NOSOTROS */}
        <NosotrosSection />

        {/* 4. GALERÍA / PORTAFOLIO DE TRABAJOS REALIZADOS */}
        <section id="galeria" className="scroll-mt-20 py-20">
          <FeaturedGallery images={featuredImages} />
        </section>
      </main>

      <Footer />
      <SocialFloatingBar />
    </>
  );
}