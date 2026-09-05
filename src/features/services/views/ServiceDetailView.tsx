import Image from "next/image";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "../api/get-service-by-slug";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function ServiceDetailView({ slug }: { slug: string }) {
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const sortedImages = [...(service.product_images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return (
    <>
      <main className="section-spacing relative mx-auto max-w-5xl px-6 overflow-hidden">
        {/* Blobs decorativos de fondo, mismo patrón que el resto de la landing */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid gap-10 md:grid-cols-2">
          <div className="grid gap-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted shadow-soft">
              {sortedImages[0]?.images && (
                <Image
                  src={sortedImages[0].images.direct_url}
                  alt={sortedImages[0].images.alt_text ?? service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {sortedImages.slice(1).map(
                  (img) =>
                    img.images && (
                      <div
                        key={img.image_id}
                        className="relative aspect-square overflow-hidden rounded-lg border border-border transition-shadow duration-300 hover:shadow-soft hover:border-primary/50"
                      >
                        <Image src={img.images.direct_url} alt={img.images.alt_text ?? ""} fill className="object-cover" />
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          <div>
            <span className="section-subtitle text-xs sm:text-sm uppercase tracking-[0.2em] text-primary">
              Servicio
            </span>
            <h1 className="section-title mt-1 !text-4xl sm:!text-5xl text-foreground">{service.name}</h1>
            <div className="mt-3 h-1 w-14 rounded-full bg-primary/70" />
            <p className="btn mt-4 text-2xl !font-bold text-primary">${service.sale_price.toFixed(2)}</p>
            {service.description && (
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}