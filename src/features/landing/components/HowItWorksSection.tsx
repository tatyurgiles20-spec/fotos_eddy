const STEPS = [
  {
    step: "01",
    title: "Cuéntanos tu idea",
    description: "Selecciona una taza, camiseta, cuadro o sesión de fotografía.",
  },
  {
    step: "02",
    title: "Revisa y confirma",
    description: "Sube tu fotografía, frase o idea para plasmar en el producto.",
  },
  {
    step: "03",
    title: "Elaboramos tu pedido",
    description: "Te enviamos una previsualización para asegurar la máxima calidad.",
  },
  {
    step: "04",
    title: "Disfruta tu producto",
    description: "Lo imprimimos con acabado profesional y te lo entregamos.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
            ¿Cómo pedir tu personalizado?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Transformar tus recuerdos en detalles únicos es muy fácil.
          </p>
        </div>

        {/* Grid de Pasos */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card/90 to-muted/40 dark:from-card dark:via-card/80 dark:to-muted/20 p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50 overflow-hidden"
            >
              {/* Degradado decorativo sutil en la parte superior de cada tarjeta */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Número con texto degradado (Gradient Text) */}
              <span className="mb-4 text-5xl font-black bg-gradient-to-br from-primary via-primary/80 to-primary/40 dark:from-primary dark:via-primary/70 dark:to-primary/30 bg-clip-text text-transparent drop-shadow-sm select-none">
                {item.step}
              </span>

              {/* Título de la tarjeta */}
              <h3 className="text-lg font-bold text-card-foreground capitalize tracking-wide">
                {item.title}
              </h3>

              {/* Descripción */}
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}