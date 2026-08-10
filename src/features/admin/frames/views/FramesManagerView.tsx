"use client";

import { useState } from "react";
import type { Frame } from "@/types/frame";
import { useFrames } from "../hooks/useFrames";
import { FrameForm } from "../components/FrameForm";
import { FrameList } from "../components/FrameList";
import { Modal } from "@/components/ui/Modal";

export function FramesManagerView() {
  const {
    frames, totalItems, loading, page, pageSize, search, status,
    setPage, setPageSize, setSearch, setStatus,
    createFrame, updateFrame, deleteFrame, moveFrame,
  } = useFrames();

  const [showForm, setShowForm] = useState(false);
  const [renaming, setRenaming] = useState<Frame | null>(null);
  const [newName, setNewName] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">Marcos</p>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          + Agregar marco
        </button>
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} maxWidth="max-w-md">
          <FrameForm
            onCreate={async (file, name) => {
              await createFrame(file, name);
              setShowForm(false);
            }}
          />
        </Modal>
      )}

      {renaming && (
        <Modal onClose={() => setRenaming(null)} maxWidth="max-w-sm">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="mb-3 font-display text-lg font-bold">Editar marco</p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={async () => {
                await updateFrame(renaming.id, { name: newName });
                setRenaming(null);
              }}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Guardar
            </button>
          </div>
        </Modal>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <FrameList
          frames={frames}
          totalItems={totalItems}
          page={page}
          pageSize={pageSize}
          search={search}
          status={status}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onMove={moveFrame}
          onToggleActive={(frame) => updateFrame(frame.id, { isActive: !frame.isActive })}
          onRename={(frame) => {
            setRenaming(frame);
            setNewName(frame.name);
          }}
          onDelete={deleteFrame}
        />
      )}
    </div>
  );
}