"use client";

import type { Album } from "@/types/image";

type Props = {
  albums: Album[];
  onOpen: (album: Album) => void;
};

export function AlbumList({ albums, onOpen }: Props) {
  if (albums.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay álbumes.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden grid-cols-[1fr_140px_100px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
        <span>Álbum</span>
        <span>Imágenes</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => onOpen(album)}
            className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40 sm:grid-cols-[1fr_140px_100px]"
          >
            <p className="truncate text-sm font-semibold">{album.name}</p>
            <span className="text-sm text-muted-foreground">
              {album.image_count} {album.image_count === 1 ? "imagen" : "imágenes"}
            </span>
            <span className="hidden text-right text-xs font-medium text-primary sm:block">Abrir →</span>
          </button>
        ))}
      </div>
    </div>
  );
}