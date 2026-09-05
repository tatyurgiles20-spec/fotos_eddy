"use client";

import type { Frame } from "@/types/frame";

type Props = {
  frames: Frame[];
  selectedId: string | null;
  onSelect: (frame: Frame) => void;
};

export function FrameThumbnailStrip({ frames, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {frames.map((frame) => (
        <button
          key={frame.id}
          type="button"
          onClick={() => onSelect(frame)}
          className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
            selectedId === frame.id
              ? "border-primary shadow-colored"
              : "border-transparent hover:border-border-strong"
          }`}
        >
          <img src={frame.directUrl} alt={frame.name} className="h-16 w-16 bg-muted object-contain" />
        </button>
      ))}
    </div>
  );
}