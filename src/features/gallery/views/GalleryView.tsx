import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { getAlbumsWithCover } from "@/features/gallery/api/get-albums";
import { AlbumCard } from "@/features/gallery/components/AlbumCard";

export async function GalleryView() {
  const albums = await getAlbumsWithCover();

  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <span className="mb-3 block h-1 w-10 rounded-full bg-primary" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Álbumes</h1>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </main> 
    </>
  );
}