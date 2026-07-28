"use client";

import { useCallback, useEffect, useState } from "react";
import type { ImageItem } from "@/types/image";

export function useImages(albumId: string | null) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!albumId) return setImages([]);
    setLoading(true);
    const res = await fetch(`/api/images?albumId=${albumId}`);
    setImages(await res.json());
    setLoading(false);
  }, [albumId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadImage = async (file: File, albumId: string, altText: string, sectionIds: string[]) => {
    const form = new FormData();
    form.append("file", file);
    form.append("albumId", albumId);
    form.append("altText", altText);
    sectionIds.forEach((id) => form.append("sectionIds", id));

    const res = await fetch("/api/images", { method: "POST", body: form });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  const deleteImage = async (id: string) => {
    const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await refresh();
  };

  return { images, loading, uploadImage, deleteImage, refresh };
}