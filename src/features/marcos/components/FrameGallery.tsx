"use client";

import { ImageIcon } from "lucide-react";
import type { Frame } from "@/types/frame";

type Props = {
  frames: Frame[];
  onSelect: (frame: Frame) => void;
};

export function FrameGallery({ frames, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {frames.map((frame) => (
        <button
          key={frame.id}
          type="button"
          onClick={() => onSelect(frame)}
          className="card-hover group overflow-hidden rounded-xl border border-border bg-card p-3 text-left shadow-soft transition-all duration-300 hover:shadow-elevated hover:border-primary/40"
        >
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={frame.directUrl}
              alt={frame.name}
              className="h-full w-full object-contain transition-transform group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft">
                <ImageIcon className="h-4 w-4" />
              </span>
            </div>
          </div>
          <p className="section-subtitle mt-2 truncate text-sm !font-medium">{frame.name}</p>
        </button>
      ))}
    </div>
  );
}