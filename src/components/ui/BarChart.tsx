"use client";

type Point = { label: string; value: number };

type Props = {
  data: Point[];
  /** Clase Tailwind de color de texto — las barras usan currentColor, ej. "text-primary" */
  colorClassName?: string;
};

export function BarChart({ data, colorClassName = "text-primary" }: Props) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return <p className="text-sm text-muted-foreground">Sin datos todavía en este período.</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const barSlot = 100 / n;
  const gap = 0.3;
  const labelStep = Math.max(1, Math.ceil(n / 8));

  return (
    <div className={colorClassName}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 w-full sm:h-40">
        {data.map((d, i) => {
          const barHeight = (d.value / max) * 88;
          const x = i * barSlot + (barSlot * gap) / 2;
          const width = barSlot * (1 - gap);
          const y = 90 - barHeight;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={d.value > 0 ? Math.max(barHeight, 1) : 0}
              rx={0.6}
              fill="currentColor"
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
          );
        })}
        <line x1={0} y1={90} x2={100} y2={90} className="stroke-border" strokeWidth={0.4} />
      </svg>
      <div className="mt-1 flex text-[10px] text-muted-foreground">
        {data.map((d, i) => (
          <span key={i} style={{ width: `${barSlot}%` }} className="shrink-0 truncate text-center">
            {i % labelStep === 0 ? d.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}