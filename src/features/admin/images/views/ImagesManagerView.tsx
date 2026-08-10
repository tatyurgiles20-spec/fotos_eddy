"use client";

import { useState } from "react";
import { useAlbums } from "@/features/admin/images/hooks/useAlbums";
import { useImages } from "@/features/admin/images/hooks/useImages";
import { useSections } from "@/features/admin/images/hooks/useSections";
import { ImageUploader } from "@/features/admin/images/components/ImageUploader";
import { ImageGrid } from "@/features/admin/images/components/ImageGrid";
import { Modal } from "@/components/ui/Modal";

export function ImagesManagerView() {
  const { albums, createAlbum } = useAlbums();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const { images, uploadImage, deleteImage } = useImages(selectedAlbumId);
  const { sections } = useSections();
  const [newAlbumName, setNewAlbumName] = useState("");
  const [showUploader, setShowUploader] = useState(false);

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    await createAlbum(newAlbumName);
    setNewAlbumName("");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">Imágenes</h1>
        <button
          onClick={() => setShowUploader(true)}
          disabled={!selectedAlbumId}
          title={!selectedAlbumId ? "Selecciona un álbum primero" : undefined}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          + Subir imágenes
        </button>
      </div>

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

      {showUploader && selectedAlbumId && (
        <Modal onClose={() => setShowUploader(false)} maxWidth="max-w-lg">
          <ImageUploader
            albumId={selectedAlbumId}
            sections={sections}
            onUpload={(file, altText, sectionIds) => uploadImage(file, selectedAlbumId, altText, sectionIds)}
            onAllUploaded={() => setShowUploader(false)}
          />
        </Modal>
      )}

      {selectedAlbumId ? (
        <div className="mt-8">
          <ImageGrid images={images} onDelete={deleteImage} />
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">Selecciona o crea un álbum para empezar a subir imágenes.</p>
      )}
    </div>
  );
}