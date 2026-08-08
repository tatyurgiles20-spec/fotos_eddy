"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  onClose: () => void;
  children: ReactNode;
  /** Clase Tailwind de ancho máximo, ej. "max-w-lg", "max-w-xl" */
  maxWidth?: string;
};

export function Modal({ onClose, children, maxWidth = "max-w-lg" }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16"
      onClick={onClose}
    >
      <div className={`relative w-full ${maxWidth}`} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-sm shadow-md hover:bg-muted"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}