"use client";

import { useState } from "react";

type Props = {
  onCreate: (file: File, name: string) => Promise<void>;
};

export function FrameForm({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async () => {
    if (!file || !name.trim()) return;
    setSaving(true);
    try {
      await onCreate(file, name.trim());
      setName("");
      handleFile(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-display text-lg font-bold">Agregar marco</p>

      {preview && (
        <img src={preview} alt="Vista previa" className="mb-4 max-h-48 w-full rounded-lg object-contain bg-muted" />
      )}

      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Nombre del marco</label>
        <input
          type="text"
          placeholder="Ej: Marco Navidad Dorado"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Imagen del marco (PNG con fondo transparente recomendado)</label>
        <input
          type="file"
          accept="image/png,image/webp"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file || !name.trim() || saving}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {saving ? "Subiendo..." : "Agregar marco"}
      </button>
    </div>
  );
}