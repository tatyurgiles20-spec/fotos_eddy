"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "../hooks/useDashboard";
import { StatCard } from "../components/StatCard";
import { AlertBanner } from "../components/AlertBanner";
import { TopProductsList } from "../components/TopProductsList";
import { RecentSalesFeed } from "../components/RecentSalesFeed";
import { BarChart } from "@/components/ui/BarChart";

const CHART_TABS = [
  { key: "daily" as const, label: "Diario" },
  { key: "weekly" as const, label: "Semanal" },
  { key: "monthly" as const, label: "Anual" },
];

function formatMoney(n: number) {
  return `$${n.toLocaleString("es-EC", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function trendFrom(current: number, previous: number): { direction: "up" | "down" | "flat"; text: string } {
  if (previous === 0 && current === 0) return { direction: "flat", text: "sin cambios" };
  if (previous === 0) return { direction: "up", text: "nuevo este mes" };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 1) return { direction: "flat", text: "similar al mes pasado" };
  return {
    direction: change > 0 ? "up" : "down",
    text: `${change > 0 ? "+" : ""}${change.toFixed(0)}% vs. mes pasado`,
  };
}

export function AdminDashboardView() {
  const { data, loading, error } = useDashboard();
  const [chartTab, setChartTab] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Un vistazo rápido al estado del negocio.</p>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {data && (
        <>
          {(data.stockAlerts.outOfStock > 0 ||
            data.stockAlerts.lowStock > 0 ||
            data.contentAlerts.visibleHighlights === 0 ||
            data.contentAlerts.activeSlides === 0 ||
            data.salesAlerts.pendingPayments > 0) && (
            <div className="flex flex-col gap-2">
              {data.stockAlerts.outOfStock > 0 && (
                <AlertBanner
                  tone="danger"
                  message={`${data.stockAlerts.outOfStock} producto(s) sin stock`}
                  href="/admin/productos"
                />
              )}
              {data.stockAlerts.lowStock > 0 && (
                <AlertBanner
                  tone="warning"
                  message={`${data.stockAlerts.lowStock} producto(s) con stock bajo (5 o menos)`}
                  href="/admin/productos"
                />
              )}
              {data.salesAlerts.pendingPayments > 0 && (
                <AlertBanner
                  tone="warning"
                  message={`${data.salesAlerts.pendingPayments} venta(s) a crédito con pago pendiente`}
                  href="/admin/ventas"
                />
              )}
              {data.contentAlerts.visibleHighlights === 0 && (
                <AlertBanner
                  tone="warning"
                  message="No hay categorías destacadas visibles en la landing"
                  href="/admin/categorias-destacadas"
                />
              )}
              {data.contentAlerts.activeSlides === 0 && (
                <AlertBanner
                  tone="warning"
                  message="El carrusel promocional no tiene slides activos"
                  href="/admin/carrusel"
                />
              )}
            </div>
          )}

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
  <StatCard
    label="Ventas este mes (unidades)"
    value={data.sales.unitsThisMonth.toString()}
    trend={trendFrom(data.sales.unitsThisMonth, data.sales.unitsLastMonth)}
    href="/admin/ventas"
  />
  <StatCard
    label="Ventas este mes ($)"
    value={formatMoney(data.sales.revenueThisMonth)}
    trend={trendFrom(data.sales.revenueThisMonth, data.sales.revenueLastMonth)}
    href="/admin/ventas"
  />
  <StatCard
    label="Descuentos otorgados"
    value={formatMoney(data.discounts.thisMonth)}
    href="/admin/ventas"
  />
  <StatCard label="Valor de inventario" value={formatMoney(data.inventoryValue.total)} />
  <StatCard
    label="Publicados / Ocultos"
    value={`${data.catalog.published} / ${data.catalog.hidden}`}
    href="/admin/productos"
  />
</div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-bold">Ventas (unidades)</p>
              <div className="flex gap-1 rounded-lg border border-border p-0.5">
                {CHART_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setChartTab(tab.key)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      chartTab === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <BarChart data={data.charts[chartTab]} />
          </div>

<div className="grid gap-4 lg:grid-cols-3">
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="mb-4 font-display text-lg font-bold">Productos más vendidos</p>
    <TopProductsList items={data.topProducts} />
  </div>

  <div className="rounded-xl border border-border bg-card p-5">
    <p className="mb-4 font-display text-lg font-bold">Ingresos por método de pago</p>
    {data.paymentMethods.length === 0 ? (
      <p className="text-sm text-muted-foreground">Todavía no hay ventas este mes.</p>
    ) : (
      <div className="flex flex-col gap-3">
        {data.paymentMethods.map((pm) => {
          const max = Math.max(...data.paymentMethods.map((x) => x.total));
          return (
            <div key={pm.method} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-sm text-muted-foreground">{pm.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(pm.total / max) * 100}%` }} />
              </div>
              <span className="w-16 shrink-0 text-right text-sm font-semibold">{formatMoney(pm.total)}</span>
            </div>
          );
        })}
      </div>
    )}
  </div>

  <div className="rounded-xl border border-border bg-card p-5">
    <div className="mb-4 flex items-center justify-between">
      <p className="font-display text-lg font-bold">Últimas ventas</p>
      <Link href="/admin/ventas" className="text-xs font-medium text-primary hover:underline">
        Ver todas →
      </Link>
    </div>
    <RecentSalesFeed sales={data.recentSales} />
  </div>
</div>

          {data.inventoryValue.missingCostCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {data.inventoryValue.missingCostCount} producto(s) con stock no tienen precio de compra registrado —
              el valor de inventario mostrado no los incluye.{" "}
              <Link href="/admin/productos" className="underline">
                Revisar
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}