"use client";

import { useEffect, useRef, useState } from "react";
import type { Section } from "@/types/image";
import { optimizeImageToWebP, formatBytes } from "@/lib/image/optimize-image";

type QueuedImage = {
  id: string;
  original: File;
  optimized: File | null;
  optimizing: boolean;
  previewUrl: string;
  altText: string;
};

type Props = {
  albumId: string;
  sections: Section[];
  onUpload: (file: File, altText: string, sectionIds: string[]) => Promise<void>;
  /** Se llama cuando toda la cola terminó de subir sin errores — útil para cerrar el modal. */
  onAllUploaded?: () => void;
};

const altTextFromFileName = (name: string) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

export function ImageUploader({ albumId, sections, onUpload, onAllUploaded }: Props) {
  const [queue, setQueue] = useState<QueuedImage[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpieza de los object URLs de vista previa al desmontar el componente
  const queueRef = useRef(queue);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const toggleSection = (id: string) =>
    setSelectedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const addFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    const newItems: QueuedImage[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      original: file,
      optimized: null,
      optimizing: true,
      previewUrl: URL.createObjectURL(file),
      altText: altTextFromFileName(file.name),
    }));

    setQueue((prev) => [...prev, ...newItems]);

    // Optimizamos cada imagen en paralelo; cada una se actualiza sola cuando termina
    newItems.forEach(async (item) => {
      const optimized = await optimizeImageToWebP(item.original);
      setQueue((prev) =>
        prev.map((q) => {
          if (q.id !== item.id) return q;
          URL.revokeObjectURL(q.previewUrl);
          return {
            ...q,
            optimized,
            optimizing: false,
            previewUrl: URL.createObjectURL(optimized),
          };
        })
      );
    });
  };

  const removeFromQueue = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((q) => q.id !== id);
    });
  };

  const updateAltText = (id: string, altText: string) =>
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, altText } : q)));

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUploadAll = async () => {
    if (queue.length === 0 || !albumId) return;
    setUploading(true);
    setError(null);

    const failed: string[] = [];
    for (const item of queue) {
      try {
        await onUpload(item.optimized ?? item.original, item.altText, selectedSections);
        URL.revokeObjectURL(item.previewUrl);
        setQueue((prev) => prev.filter((q) => q.id !== item.id));
      } catch {
        failed.push(item.original.name);
      }
    }

    setUploading(false);

    if (failed.length > 0) {
      setError(`No se pudieron subir: ${failed.join(", ")}`);
    } else {
      setSelectedSections([]);
      onAllUploaded?.();
    }
  };

  const anyOptimizing = queue.some((q) => q.optimizing);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-display text-lg font-bold">Subir imágenes</p>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
        }`}
      >
        <p className="text-sm font-medium">Arrastra imágenes aquí</p>
        <p className="mt-1 text-xs text-muted-foreground">o haz click para elegir (puedes seleccionar varias)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = ""; // permite volver a elegir el mismo archivo si lo quitó de la cola
          }}
          className="hidden"
        />
      </div>

      {/* Cola de imágenes pendientes */}
      {queue.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {queue.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border p-2">
              <img src={item.previewUrl} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />

              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={item.altText}
                  onChange={(e) => updateAltText(item.id, e.target.value)}
                  placeholder="Texto alternativo (alt)"
                  className="mb-1 w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  {item.optimizing ? (
                    "Optimizando..."
                  ) : item.optimized ? (
                    <>
                      {formatBytes(item.original.size)} → {formatBytes(item.optimized.size)}
                      {item.optimized.size < item.original.size && (
                        <span className="text-primary">
                          {" "}
                          (-{Math.round((1 - item.optimized.size / item.original.size) * 100)}%)
                        </span>
                      )}
                    </>
                  ) : (
                    formatBytes(item.original.size)
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeFromQueue(item.id)}
                aria-label="Quitar"
                className="shrink-0 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-destructive"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {sections.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">Mostrar también en:</p>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedSections.includes(section.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      <button
        onClick={handleUploadAll}
        disabled={queue.length === 0 || !albumId || uploading || anyOptimizing}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {uploading
          ? "Subiendo..."
          : anyOptimizing
            ? "Optimizando..."
            : queue.length > 1
              ? `Subir ${queue.length} imágenes`
              : "Subir a este álbum"}
      </button>
    </div>
  );
}