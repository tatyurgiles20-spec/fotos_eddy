"use client";

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
          className="group overflow-hidden rounded-xl border border-border bg-card p-3 text-left transition-shadow hover:shadow-soft"
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={frame.directUrl}
              alt={frame.name}
              className="h-full w-full object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <p className="mt-2 truncate text-sm font-medium">{frame.name}</p>
        </button>
      ))}
    </div>
  );
}