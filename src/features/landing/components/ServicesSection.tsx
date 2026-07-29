export function ServicesSection() {
  return (
    <section id="servicios" className="border-t border-border bg-surface/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Lo que hacemos por ti
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Fotografía profesional & Artículos personalizados
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Inmortaliza tus mejores recuerdos o convierte tus ideas en productos físicos de alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Tarjeta 1: Fotografía */}
          <div className="card-hover flex flex-col justify-between rounded-xl border border-border bg-card p-8 shadow-soft">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l0.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l0.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold">Estudio & Sesiones</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Sesiones fotográficas personales, familiares, corporativas o de producto con acabado y edición profesional.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <span className="tag-handwritten">Captura el momento</span>
            </div>
          </div>

          {/* Tarjeta 2: Tazas y Recuerdos */}
          <div className="card-hover flex flex-col justify-between rounded-xl border border-border bg-card p-8 shadow-soft">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13C10.832 21 2 20 2 12V8h20v4c0 8-8.832 9-10 9z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold">Tazas & Regalos</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Tazas mágicas, cerámicas, termos y detalles personalizados con tus fotos o frase favorita para regalar.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <span className="tag-handwritten">Regalos inolvidables</span>
            </div>
          </div>

          {/* Tarjeta 3: Ropa y Textil */}
          <div className="card-hover flex flex-col justify-between rounded-xl border border-border bg-card p-8 shadow-soft">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold">Ropa & Estampados</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Camisetas, hoodies y prendas personalizadas con impresión duradera de alta definición y fidelidad de color.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <span className="tag-handwritten">Tu estilo, tu diseño</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}