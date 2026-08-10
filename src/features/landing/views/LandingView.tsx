import { FeaturedGallery } from "@/features/landing/components/FeaturedGallery";
import { PromoCarousel } from "@/features/landing/components/PromoCarousel";
import { ServicesCarousel } from "@/features/landing/components/ServicesCarousel";
import { NosotrosSection } from "@/features/landing/components/NosotrosSection";
import { RankingSection } from "@/features/landing/components/RankingSection";
import { FrameTeaserSection } from "@/features/landing/components/FrameTeaserSection";
import { getFeaturedImages } from "@/features/landing/api/get-featured-images";
import { getCarouselSlides } from "@/features/landing/api/get-carousel-slides";
import { getRankedItems } from "@/features/landing/api/get-ranked-items";
import { getCategoryHighlights } from "@/features/landing/api/get-category-highlights";
import { getRandomFrame } from "@/features/marcos/api/get-frames";

export async function LandingView() {
  const [featuredImages, promoSlides, topProducts, topServices, categoryHighlights, randomFrame] =
    await Promise.all([
      getFeaturedImages("home_destacadas"),
      getCarouselSlides("promo"),
      getRankedItems("product", 4),
      getRankedItems("service", 4),
      getCategoryHighlights(),
      getRandomFrame(),
    ]);

  return (
    <>
      <main className="overflow-hidden bg-primary-light/40 transition-colors duration-300">
        {promoSlides.length > 0 && <PromoCarousel slides={promoSlides} />}
        <ServicesCarousel highlights={categoryHighlights} />

        <RankingSection title="Los más vendidos" items={topProducts} viewAllHref="/productos" />
        <RankingSection title="Servicios más solicitados" items={topServices} viewAllHref="/servicios" />

        <FrameTeaserSection frame={randomFrame} />

        <NosotrosSection />

        <section id="galeria" className="scroll-mt-20 py-20">
          <FeaturedGallery images={featuredImages} />
        </section>
      </main>
    </>
  );
}