"use client";

import { useState } from "react";
import { useAlbums } from "@/features/admin/images/hooks/useAlbums";
import { useImages } from "@/features/admin/images/hooks/useImages";
import { useSections } from "@/features/admin/images/hooks/useSections";
import { ImageUploader } from "@/features/admin/images/components/ImageUploader";
import { ImageGrid } from "@/features/admin/images/components/ImageGrid";

export function ImagesManagerView() {
  const { albums, createAlbum } = useAlbums();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const { images, uploadImage, deleteImage } = useImages(selectedAlbumId);
  const { sections } = useSections();
  const [newAlbumName, setNewAlbumName] = useState("");

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    await createAlbum(newAlbumName);
    setNewAlbumName("");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">Imágenes</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setSelectedAlbumId(album.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedAlbumId === album.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {album.name}
          </button>
        ))}

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nuevo álbum"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
          />
          <button
            onClick={handleCreateAlbum}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            + Crear
          </button>
        </div>
      </div>

      {selectedAlbumId ? (
        <div className="mt-8 grid gap-6 md:grid-cols-[300px_1fr]">
          <ImageUploader
            albumId={selectedAlbumId}
            sections={sections}
            onUpload={(file, altText, sectionIds) => uploadImage(file, selectedAlbumId, altText, sectionIds)}
          />
          <ImageGrid images={images} onDelete={deleteImage} />
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">Selecciona o crea un álbum para empezar a subir imágenes.</p>
      )}
    </div>
  );
}