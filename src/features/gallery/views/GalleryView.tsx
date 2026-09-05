import { Sparkles } from "lucide-react";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { getAlbumsWithCover } from "@/features/gallery/api/get-albums";
import { AlbumCard } from "@/features/gallery/components/AlbumCard";

export async function GalleryView() {
  const albums = await getAlbumsWithCover();

  return (
    <>
      <main className="section-spacing relative mx-auto max-w-6xl px-6 overflow-hidden">
        {/* Blobs decorativos de fondo, mismo patrón que el resto de la landing */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative text-center">
          <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-2">
            <Sparkles className="h-4 w-4" />
            Nuestro trabajo
          </span>
          <h1 className="section-title !text-4xl sm:!text-5xl text-foreground">Álbumes</h1>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-primary/70" />

          <div className="mt-8 grid gap-6 text-left sm:grid-cols-2 md:grid-cols-3">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}