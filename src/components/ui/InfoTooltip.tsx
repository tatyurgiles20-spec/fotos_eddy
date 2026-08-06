// src/components/ui/InfoTooltip.tsx
'use client';

import { useState } from 'react';

interface InfoTooltipProps {
  text: string;
}

/* Componente de ayuda/tooltip para formularios */
function InfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label="Más información"
        className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {isOpen && (
        <div className="tooltip-solid absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[9999] w-56 p-2.5 text-xs rounded-lg pointer-events-none">
          {text}
          <div className="tooltip-solid-arrow absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" />
        </div>
      )}
    </div>
  );
}