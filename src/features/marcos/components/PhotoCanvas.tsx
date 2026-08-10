"use client";

import { useRef, useState } from "react";
import type { Frame } from "@/types/frame";

type Props = {
  frame: Frame;
  photoUrl: string | null;
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export function PhotoCanvas({ frame, photoUrl }: Props) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  // Usamos el tamaño real del PNG del marco para que el recuadro tenga su misma proporción
  const handleFrameLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) setAspectRatio(naturalWidth / naturalHeight);
  };

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!photoUrl) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({ x: dragState.current.originX + dx, y: dragState.current.originY + dy });
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!photoUrl) return;
    e.preventDefault();
    setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s - e.deltaY * 0.001)));
  };

  return (
    <div className="space-y-3">
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        style={{ aspectRatio }}
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg border border-border bg-muted"
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Tu foto"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              cursor: "grab",
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
            Sube tu foto para probarla con este marco
          </div>
        )}

        <img
          src={frame.directUrl}
          alt={frame.name}
          onLoad={handleFrameLoad}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
        />
      </div>

      {photoUrl && (
        <div className="mx-auto flex max-w-md items-center gap-3">
          <span className="text-xs text-muted-foreground">Zoom</span>
          <input
            type="range"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.05}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="flex-1"
          />
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:bg-muted"
          >
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
}