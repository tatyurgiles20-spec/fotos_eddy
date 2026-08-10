"use client";

import { useState } from "react";
import Link from "next/link";
import { useAlbums } from "../hooks/useAlbums";
import { useImages } from "../hooks/useImages";
import { useSections } from "../hooks/useSections";
import { ImageUploader } from "../components/ImageUploader";
import { ImageGrid } from "../components/ImageGrid";
import { Modal } from "@/components/ui/Modal";

type Props = {
  albumId: string;
};

export function AlbumImagesView({ albumId }: Props) {
  const { albums } = useAlbums();
  const album = albums.find((a) => a.id === albumId);
  const { images, uploadImage, deleteImage } = useImages(albumId);
  const { sections } = useSections();
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/imagenes" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          ← Álbumes
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold tracking-tight">{album?.name ?? "Álbum"}</h1>
          <button
            onClick={() => setShowUploader(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            + Subir imágenes
          </button>
        </div>
      </div>

      {showUploader && (
        <Modal onClose={() => setShowUploader(false)} maxWidth="max-w-lg">
          <ImageUploader
            albumId={albumId}
            sections={sections}
            onUpload={(file, altText, sectionIds) => uploadImage(file, albumId, altText, sectionIds)}
            onAllUploaded={() => setShowUploader(false)}
          />
        </Modal>
      )}

      <ImageGrid images={images} onDelete={deleteImage} />
    </div>
  );
}