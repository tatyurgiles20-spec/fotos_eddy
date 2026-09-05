"use client";

import { useState } from "react";
import { Frame as FrameIcon } from "lucide-react";
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
    <div className="section-spacing relative mx-auto max-w-5xl px-4 overflow-hidden">
      {/* Blobs decorativos de fondo, mismo patrón que el resto de la landing */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <span className="section-subtitle inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary">
          <FrameIcon className="h-4 w-4" />
          Vista previa gratis
        </span>
        <p className="section-title mt-1 !text-3xl sm:!text-4xl text-foreground">
          Prueba tu foto con un marco
        </p>
        <div className="mt-3 h-1 w-14 rounded-full bg-primary/70" />
        <p className="mt-3 text-sm text-muted-foreground">Elige un marco para probarlo con tu foto.</p>

        <div className="mt-8">
          <FrameGallery frames={frames} onSelect={setSelectedFrame} />
        </div>

        {selectedFrame && (
          <Modal onClose={() => setSelectedFrame(null)} maxWidth="max-w-lg">
            <div className="space-y-4">
              <p className="section-subtitle text-lg !font-semibold">{selectedFrame.name}</p>

              {frames.length > 1 && (
                <FrameThumbnailStrip frames={frames} selectedId={selectedFrame.id} onSelect={setSelectedFrame} />
              )}

              <PhotoDropzone onFileSelected={handlePhotoChange} hasPhoto={Boolean(photoUrl)} />

              <PhotoCanvas frame={selectedFrame} photoUrl={photoUrl} />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}