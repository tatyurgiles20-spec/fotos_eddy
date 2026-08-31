"use client";

import { useState } from "react";
import type { Album } from "@/types/image";

type Props = {
  albums: Album[];
  onOpen: (album: Album) => void;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function AlbumList({ albums, onOpen, onRename, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (albums.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay álbumes.</p>;
  }

  const startEditing = (album: Album) => {
    setError(null);
    setEditingId(album.id);
    setEditingName(album.name);
  };

  const handleSaveRename = async (id: string) => {
    if (!editingName.trim()) return;
    setSavingId(id);
    setError(null);
    try {
      await onRename(id, editingName.trim());
      setEditingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al renombrar el álbum");
    } finally {
      setSavingId(null);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await onDelete(id);
      setConfirmingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar el álbum");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-[1fr_140px_140px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <span>Álbum</span>
          <span>Imágenes</span>
          <span className="text-right">Acciones</span>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {albums.map((album) => (
            <div
              key={album.id}
              className="flex flex-col gap-2 px-3 py-3 sm:grid sm:grid-cols-[1fr_140px_140px] sm:items-center sm:gap-3"
            >
              {editingId === album.id ? (
                <div className="flex items-center gap-2 sm:contents">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="rounded-md border border-border bg-background px-2 py-1 text-sm sm:col-span-1"
                  />
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {album.image_count} {album.image_count === 1 ? "imagen" : "imágenes"}
                  </span>
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Guardar */}
                    <button
                      onClick={() => handleSaveRename(album.id)}
                      disabled={savingId === album.id}
                      title="Guardar"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-green-600 transition-all hover:bg-green-500/10 hover:scale-110 disabled:opacity-50"
                    >
                      {savingId === album.id ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    {/* Cancelar */}
                    <button
                      onClick={() => setEditingId(null)}
                      title="Cancelar"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:scale-110"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onOpen(album)}
                    className="min-w-0 truncate text-left text-sm font-semibold hover:text-primary"
                  >
                    {album.name}
                  </button>

                  <span className="text-sm text-muted-foreground">
                    {album.image_count} {album.image_count === 1 ? "imagen" : "imágenes"}
                  </span>

                  {confirmingId === album.id ? (
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <span className="mr-1 text-xs text-muted-foreground">¿Eliminar?</span>
                      {/* Confirmar eliminar */}
                      <button
                        onClick={() => handleConfirmDelete(album.id)}
                        disabled={deletingId === album.id}
                        title="Sí, eliminar"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-all hover:scale-110 hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === album.id ? (
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      {/* Cancelar eliminación */}
                      <button
                        onClick={() => setConfirmingId(null)}
                        title="Cancelar"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:scale-110"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      {/* Ver / Abrir */}
                      <button
                        onClick={() => onOpen(album)}
                        title="Abrir álbum"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-all hover:bg-primary/10 hover:scale-110"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => startEditing(album)}
                        title="Editar nombre"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => {
                          setError(null);
                          setConfirmingId(album.id);
                        }}
                        title="Eliminar álbum"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 transition-all hover:bg-red-500/10 hover:scale-110"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9.5 7V4.5A1.5 1.5 0 0111 3h2a1.5 1.5 0 011.5 1.5V7M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}