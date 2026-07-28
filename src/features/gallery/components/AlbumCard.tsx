import Link from "next/link";
import type { AlbumWithCover } from "@/features/gallery/api/get-albums";

export function AlbumCard({ album }: { album: AlbumWithCover }) {
  return (
    <Link
      href={`/galeria/${album.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {album.cover && (
          <img
            src={album.cover.direct_url}
            alt={album.cover.alt_text ?? album.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <p className="font-display font-bold">{album.name}</p>
      </div>
    </Link>
  );
}