import Link from "next/link";
import { Images } from "lucide-react";
import type { AlbumWithCover } from "@/features/gallery/api/get-albums";

export function AlbumCard({ album }: { album: AlbumWithCover }) {
  return (
    <Link
      href={`/galeria/${album.slug}`}
      className="card-hover group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-shadow duration-300 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {album.cover && (
          <img
            src={album.cover.direct_url}
            alt={album.cover.alt_text ?? album.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[10px] font-medium text-foreground opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
          <Images className="h-3 w-3" />
          Ver álbum
        </span>
      </div>
      <div className="p-4">
        <p className="section-subtitle !font-semibold line-clamp-1">{album.name}</p>
      </div>
    </Link>
  );
}