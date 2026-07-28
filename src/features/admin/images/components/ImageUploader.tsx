"use client";

import { useState } from "react";
import type { Section } from "@/types/image";

type Props = {
  albumId: string;
  sections: Section[];
  onUpload: (file: File, altText: string, sectionIds: string[]) => Promise<void>;
};

export function ImageUploader({ albumId, sections, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const toggleSection = (id: string) =>
    setSelectedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file, altText, selectedSections);
      setFile(null);
      setAltText("");
      setSelectedSections([]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-display text-lg font-bold">Subir imagen</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-3 block w-full text-sm"
      />
      <input
        type="text"
        placeholder="Texto alternativo (descripción)"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

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

      <button
        onClick={handleSubmit}
        disabled={!file || !albumId || uploading}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {uploading ? "Subiendo..." : "Subir a este álbum"}
      </button>
    </div>
  );
}