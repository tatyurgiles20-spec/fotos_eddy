export function AdminDashboardView() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        Bienvenido de vuelta. Desde aquí vas a poder gestionar el contenido de la landing.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Imágenes</p>
          <p className="mt-1 font-display text-3xl font-bold">—</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Última actualización</p>
          <p className="mt-1 font-display text-3xl font-bold">—</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Espacio en Drive</p>
          <p className="mt-1 font-display text-3xl font-bold">—</p>
        </div>
      </div>
    </div>
  );
}