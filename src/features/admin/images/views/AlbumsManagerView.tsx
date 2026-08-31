"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlbums } from "../hooks/useAlbums";
import { AlbumList } from "../components/AlbumList";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";

export function AlbumsManagerView() {
  const router = useRouter();
  const { albums, createAlbum, updateAlbum, deleteAlbum } = useAlbums();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return albums;
    return albums.filter((a) => a.name.toLowerCase().includes(term));
  }, [albums, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (page > totalPages) {
    setPage(1);
  }
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleCreate = async () => {
    if (!newAlbumName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createAlbum(newAlbumName);
      setNewAlbumName("");
      setShowCreate(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear el álbum");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Imágenes</p>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Crear álbum
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar álbum..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} maxWidth="max-w-sm">
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <p className="font-display text-lg font-bold">Nuevo álbum</p>
            <input
              type="text"
              placeholder="Nombre del álbum"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newAlbumName.trim() || saving}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {saving ? "Creando..." : "Crear"}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      <AlbumList
        albums={paginated}
        onOpen={(album) => router.push(`/admin/imagenes/${album.id}`)}
        onRename={updateAlbum}
        onDelete={deleteAlbum}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}