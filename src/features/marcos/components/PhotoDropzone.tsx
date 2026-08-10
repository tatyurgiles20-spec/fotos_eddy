"use client";

import { useRef, useState } from "react";

type Props = {
  onFileSelected: (file: File | null) => void;
  hasPhoto: boolean;
};

export function PhotoDropzone({ onFileSelected, hasPhoto }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onFileSelected(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="text-muted-foreground">
        {hasPhoto ? "Arrastra otra foto o haz clic para cambiarla" : "Arrastra tu foto aquí o haz clic para elegirla"}
      </p>
    </div>
  );
}