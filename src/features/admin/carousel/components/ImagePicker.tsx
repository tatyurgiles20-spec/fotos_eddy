"use client";

import { useState } from "react";
import { useAlbums } from "@/features/admin/images/hooks/useAlbums";
import { useImages } from "@/features/admin/images/hooks/useImages";

type Props = {
  selectedImageId: string | null;
  onSelect: (imageId: string, directUrl: string) => void;
};

export function ImagePicker({ selectedImageId, onSelect }: Props) {
  const { albums, createAlbum } = useAlbums();
  const [albumId, setAlbumId] = useState<string | null>(null);
  const { images, loading, uploadImage } = useImages(albumId);

  const [newAlbumName, setNewAlbumName] = useState("");
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    setCreatingAlbum(true);
    try {
      await createAlbum(newAlbumName);
      // useAlbums.refresh() ya actualizó la lista; buscamos el recién creado por nombre
      const res = await fetch("/api/albums");
      const updated = await res.json();
      const created = updated.find((a: { name: string }) => a.name === newAlbumName);
      if (created) setAlbumId(created.id);
      setNewAlbumName("");
    } finally {
      setCreatingAlbum(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadingFile || !albumId) return;
    setUploading(true);
    try {
      await uploadImage(uploadingFile, albumId, "", []);
      setUploadingFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-2 text-sm font-medium text-muted-foreground">Elegir imagen del repositorio</p>

      <div className="mb-3 flex gap-2">
        <select
          value={albumId ?? ""}
          onChange={(e) => setAlbumId(e.target.value || null)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Selecciona un álbum...</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex gap-2">
        <input
          type="text"
          placeholder="Nuevo álbum"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={handleCreateAlbum}
          disabled={!newAlbumName.trim() || creatingAlbum}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
        >
          {creatingAlbum ? "Creando..." : "+ Crear"}
        </button>
      </div>

      {albumId && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-dashed border-border p-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadingFile(e.target.files?.[0] ?? null)}
            className="flex-1 text-xs"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={!uploadingFile || uploading}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            {uploading ? "Subiendo..." : "Subir"}
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground">Cargando imágenes...</p>}

      {!loading && albumId && images.length === 0 && (
        <p className="text-sm text-muted-foreground">Este álbum no tiene imágenes todavía.</p>
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