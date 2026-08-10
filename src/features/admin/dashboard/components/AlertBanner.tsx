"use client";

import Link from "next/link";

type Props = {
  message: string;
  href: string;
  tone?: "warning" | "danger";
};

export function AlertBanner({ message, href, tone = "warning" }: Props) {
  const toneClass =
    tone === "danger"
      ? "border-destructive/40 bg-destructive/5 text-destructive"
      : "border-amber-500/40 bg-amber-500/5 text-amber-600";

  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:opacity-80 ${toneClass}`}
    >
      <span>⚠ {message}</span>
      <span className="text-xs underline">Ver →</span>
    </Link>
  );
}