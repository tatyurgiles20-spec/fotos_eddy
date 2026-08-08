import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { FeaturedGallery } from "@/features/landing/components/FeaturedGallery";
import { ServicesSection } from "@/features/landing/components/ServicesSection";
import { PromoCarousel } from "@/features/landing/components/PromoCarousel";
import { ServicesCarousel } from "@/features/landing/components/ServicesCarousel";
import { NosotrosSection } from "@/features/landing/components/NosotrosSection";
import { RankingSection } from "@/features/landing/components/RankingSection";
import { getFeaturedImages } from "@/features/landing/api/get-featured-images";
import { getCarouselSlides } from "@/features/landing/api/get-carousel-slides";
import { getRankedItems } from "@/features/landing/api/get-ranked-items";
import { getCategoryHighlights } from "@/features/landing/api/get-category-highlights";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export async function LandingView() {
  const [featuredImages, promoSlides, topProducts, topServices, categoryHighlights] = await Promise.all([
    getFeaturedImages("home_destacadas"),
    getCarouselSlides("promo"),
    getRankedItems("product", 4),
    getRankedItems("service", 4),
    getCategoryHighlights(),
  ]);

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-primary-light/40 transition-colors duration-300">
        {promoSlides.length > 0 && <PromoCarousel slides={promoSlides} />}

        <ServicesSection />
        <ServicesCarousel highlights={categoryHighlights} />

        <RankingSection title="Los más vendidos" items={topProducts} viewAllHref="/productos" />
        <RankingSection title="Servicios más solicitados" items={topServices} viewAllHref="/servicios" />

        <NosotrosSection />

        <section id="galeria" className="scroll-mt-20 py-20">
          <FeaturedGallery images={featuredImages} />
        </section>
      </main>

      <Footer />
      <SocialFloatingBar />
    </>
  );
}