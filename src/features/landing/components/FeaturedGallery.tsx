import type { ImageItem } from "@/types/image";

export function FeaturedGallery({ images }: { images: ImageItem[] }) {
  if (images.length === 0) return null;

  return (
    <section id="galeria" className="mx-auto max-w-6xl px-6 py-20">
     <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Div vacío para balancear el grid en pantallas grandes */}
      <div className="hidden sm:block sm:w-1/4" />

       {/* Título y barra centrados */}
       <div className="text-center sm:w-1/2">
       <span className="mb-3 block h-1 w-10 rounded-full bg-primary mx-auto" />
       <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
        Galería
       </h2>
      </div>

        {/* Enlace alineado a la derecha */}
        <div className="text-center sm:text-right sm:w-1/4">
         <a href="/galeria" className="text-sm font-medium text-primary hover:underline">
          Ver todos los álbumes →
         </a>
        </div>
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
        )
        )
        }
      </div>
    </section>
  );
}