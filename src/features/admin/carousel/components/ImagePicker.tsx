"use client";

import { useState } from "react";
import { useAlbums } from "@/features/admin/images/hooks/useAlbums";
import { useImages } from "@/features/admin/images/hooks/useImages";

type Props = {
  selectedImageId: string | null;
  onSelect: (imageId: string, directUrl: string) => void;
  /** Texto de ayuda sobre proporción/formato recomendado para este uso específico */
  recommendationText?: string;
};

export function ImagePicker({ selectedImageId, onSelect, recommendationText }: Props) {
  const { albums, createAlbum } = useAlbums();
  const [albumId, setAlbumId] = useState<string | null>(null);
  const { images, loading, uploadImage } = useImages(albumId);

  const [newAlbumName, setNewAlbumName] = useState("");
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    setCreatingAlbum(true);
    try {
      await createAlbum(newAlbumName);
      const res = await fetch("/api/albums");
      const updated = await res.json();
      const created = updated.find((a: { name: string }) => a.name === newAlbumName);
      if (created) setAlbumId(created.id);
      setNewAlbumName("");
    } finally {
      setCreatingAlbum(false);
    }
  };

  const handleUpload = async (file?: File) => {
    const target = file ?? uploadingFile;
    if (!target || !albumId) return;
    setUploading(true);
    try {
      await uploadImage(target, albumId, "", []);
      setUploadingFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!albumId) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!albumId) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    setUploadingFile(file);
    // Subimos directo al soltar, sin esperar un segundo clic en "Subir"
    handleUpload(file);
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-2 text-sm font-medium text-muted-foreground">Elegir imagen del repositorio</p>

      {recommendationText && (
        <p className="mb-3 rounded-md bg-primary/5 px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground">
          💡 {recommendationText}
        </p>
      )}

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
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-3 flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <svg
            className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3"
            />
          </svg>

          <p className="text-xs text-muted-foreground">
            {isDragging ? "Suelta la imagen aquí" : "Arrastra una imagen aquí, o"}
          </p>

          <label className="cursor-pointer rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
            Elegir archivo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setUploadingFile(file);
                if (file) handleUpload(file);
              }}
              className="hidden"
            />
          </label>

          {uploading && <p className="text-xs text-primary">Subiendo...</p>}
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