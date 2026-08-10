"use client";

import Link from "next/link";

type Trend = { direction: "up" | "down" | "flat"; text: string };

type Props = {
  label: string;
  value: string;
  trend?: Trend;
  href?: string;
};

export function StatCard({ label, value, trend, href }: Props) {
  const content = (
    <div className="h-full rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
      {trend && (
        <p
          className={`mt-1 text-xs font-medium ${
            trend.direction === "up"
              ? "text-primary"
              : trend.direction === "down"
                ? "text-destructive"
                : "text-muted-foreground"
          }`}
        >
          {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.text}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-80">
        {content}
      </Link>
    );
  }
  return content;
}