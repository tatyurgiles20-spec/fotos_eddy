"use client";

import { useState } from "react";
import type { Frame } from "@/types/frame";
import { FrameGallery } from "../components/FrameGallery";
import { FrameThumbnailStrip } from "../components/FrameThumbnailStrip";
import { PhotoDropzone } from "../components/PhotoDropzone";
import { PhotoCanvas } from "../components/PhotoCanvas";
import { Modal } from "@/components/ui/Modal";

type Props = {
  frames: Frame[];
};

export function MarcosView({ frames }: Props) {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handlePhotoChange = (file: File | null) => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(file ? URL.createObjectURL(file) : null);
  };

  if (frames.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Todavía no hay marcos disponibles. Vuelve pronto.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="font-display text-2xl font-bold sm:text-3xl">Prueba tu foto con un marco</p>
      <p className="mt-1 text-sm text-muted-foreground">Elige un marco para probarlo con tu foto.</p>

      <div className="mt-6">
        <FrameGallery frames={frames} onSelect={setSelectedFrame} />
      </div>

      {selectedFrame && (
        <Modal onClose={() => setSelectedFrame(null)} maxWidth="max-w-lg">
          <div className="space-y-4">
            <p className="font-display text-lg font-bold">{selectedFrame.name}</p>

            {frames.length > 1 && (
              <FrameThumbnailStrip frames={frames} selectedId={selectedFrame.id} onSelect={setSelectedFrame} />
            )}

            <PhotoDropzone onFileSelected={handlePhotoChange} hasPhoto={Boolean(photoUrl)} />

            <PhotoCanvas frame={selectedFrame} photoUrl={photoUrl} />
          </div>
        </Modal>
      )}
    </div>
  );
}