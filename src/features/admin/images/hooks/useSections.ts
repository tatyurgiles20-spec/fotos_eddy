"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/types/image";

export function useSections() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch("/api/sections").then((res) => res.json()).then(setSections);
  }, []);

  return { sections };
}
