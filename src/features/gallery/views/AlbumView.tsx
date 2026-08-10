import { notFound } from "next/navigation";
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
      <main className="mx-auto max-w-6xl px-6 py-16">
        <a href="/galeria" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Todos los álbumes
        </a>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">{album.name}</h1>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.direct_url}
              alt={image.alt_text ?? ""}
              loading="lazy"
              className="aspect-square w-full rounded-lg object-cover"
            />
          ))}
        </div>
      </main> 
    </>
  );
}