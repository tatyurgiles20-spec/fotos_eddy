"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

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
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm transition-all duration-300 ${
        isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:bg-muted hover:border-primary/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <UploadCloud className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-muted-foreground">
        {hasPhoto ? "Arrastra otra foto o haz clic para cambiarla" : "Arrastra tu foto aquí o haz clic para elegirla"}
      </p>
    </div>
  );
}