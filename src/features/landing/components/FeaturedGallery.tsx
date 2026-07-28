import type { ImageItem } from "@/types/image";

export function FeaturedGallery({ images }: { images: ImageItem[] }) {
  if (images.length === 0) return null;

  return (
    <section id="galeria" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="mb-3 block h-1 w-10 rounded-full bg-primary" />
          <h2 className="font-display text-3xl font-bold tracking-tight">Galería</h2>
        </div>
        <a href="/galeria" className="text-sm font-medium text-primary hover:underline">
          Ver todos los álbumes →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
    </section>
  );
}