"use client";

import type { ImageItem } from "@/types/image";

export function ImageGrid({ images, onDelete }: { images: ImageItem[]; onDelete: (id: string) => void }) {
  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground">Este álbum todavía no tiene imágenes.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden rounded-lg border border-border">
          <img src={image.direct_url} alt={image.alt_text ?? ""} className="aspect-square w-full object-cover" />
          <button
            onClick={() => onDelete(image.id)}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}