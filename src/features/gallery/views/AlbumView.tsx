import { notFound } from "next/navigation";
import { ChevronLeft, Images } from "lucide-react";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { getAlbumWithImages } from "@/features/gallery/api/get-album-with-images";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export async function AlbumView({ slug }: { slug: string }) {
  const result = await getAlbumWithImages(slug);
  if (!result) notFound();

  const { album, images } = result;

  return (
    <>
      <main className="section-spacing relative mx-auto max-w-6xl px-6 overflow-hidden">
        {/* Blobs decorativos de fondo, mismo patrón que el resto de la landing */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <a
            href="/galeria"
            className="btn inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Todos los álbumes
          </a>

          <span className="section-subtitle mt-6 inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary">
            <Images className="h-4 w-4" />
            Álbum
          </span>
          <h1 className="section-title mt-1 !text-4xl sm:!text-5xl text-foreground">
            {album.name}
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-primary/70" />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square w-full overflow-hidden rounded-lg shadow-soft transition-shadow duration-300 hover:shadow-elevated"
              >
                <img
                  src={image.direct_url}
                  alt={image.alt_text ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}