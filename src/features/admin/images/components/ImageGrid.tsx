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
  aria-label="Eliminar imagen"
  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg ring-2 ring-white/80 transition-all hover:scale-110 hover:bg-red-700 hover:shadow-red-500/40"
>
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9.5 7V4.5A1.5 1.5 0 0111 3h2a1.5 1.5 0 011.5 1.5V7M4 7h16"
    />
  </svg>
</button>
        </div>
      ))}
    </div>
  );
}