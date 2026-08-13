export function NosotrosSection() {
  return (
    <section id="nosotros" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h3 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
          Nosotros
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          La historia detrás de Nova Print
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-hover rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h4 className="font-display text-lg font-bold text-foreground">
            Quienes somos
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Somos una empresa apacionadapor la personalozacion.
            Convertimos tus ideas en productis unicos que cuentan historias,
            transmite emociones y dejan huella.
          </p>
        </div>

        <div className="card-hover rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h4 className="font-display text-lg font-bold text-foreground">
            Que hacemos
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Ofrecemos soluciones creativas de imprecion y personalizacion 
            con la mejor calidad, mnateriales premium ytecnologia moderna,
            para emprendedores, empresas y particulares.
          </p>
        </div>

        <div className="card-hover rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h4 className="font-display text-lg font-bold text-foreground">
            Misión y visión
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Misión:</span>{" "}
            describe qué haces por tus clientes hoy.
            <br />
            <span className="mt-2 inline-block font-semibold text-foreground">
              Visión:
            </span>{" "}
            describe hacia dónde quieres llevar a Nova Print.
          </p>
        </div>
      </div>
    </section>
  );
}