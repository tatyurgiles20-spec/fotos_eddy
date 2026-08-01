"use client";

import { useState } from "react";
import { useAlbums } from "@/features/admin/images/hooks/useAlbums";
import { useImages } from "@/features/admin/images/hooks/useImages";

type Props = {
  selectedImageId: string | null;
  onSelect: (imageId: string, directUrl: string) => void;
};

export function ImagePicker({ selectedImageId, onSelect }: Props) {
  const { albums } = useAlbums();
  const [albumId, setAlbumId] = useState<string | null>(null);
  const { images, loading } = useImages(albumId);

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-2 text-sm font-medium text-muted-foreground">Elegir imagen del repositorio</p>

      <select
        value={albumId ?? ""}
        onChange={(e) => setAlbumId(e.target.value || null)}
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">Selecciona un álbum...</option>
        {albums.map((album) => (
          <option key={album.id} value={album.id}>
            {album.name}
          </option>
        ))}
      </select>

      {loading && <p className="text-sm text-muted-foreground">Cargando imágenes...</p>}

      {!loading && albumId && images.length === 0 && (
        <p className="text-sm text-muted-foreground">Este álbum no tiene imágenes.</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onSelect(image.id, image.direct_url)}
              className={`relative overflow-hidden rounded-lg border-2 transition-colors ${
                selectedImageId === image.id ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={image.direct_url} alt={image.alt_text ?? ""} className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}