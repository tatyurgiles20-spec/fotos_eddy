const STEPS = [
  {
    step: "01",
    title: "Elige tu Base",
    description: "Selecciona una taza, camiseta, cuadro o sesión de fotografía.",
  },
  {
    step: "02",
    title: "Personaliza",
    description: "Sube tu fotografía, frase o idea para plasmar en el producto.",
  },
  {
    step: "03",
    title: "Validamos el Boceto",
    description: "Te enviamos una previsualización para asegurar la máxima calidad.",
  },
  {
    step: "04",
    title: "¡Listo para Regalar!",
    description: "Lo imprimimos con acabado profesional y te lo entregamos.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
         {/* <span className="tag-handwritten text-2xl">Paso a paso</span> */}
          <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
            ¿Cómo pedir tu personalizado?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Transformar tus recuerdos en detalles únicos es muy fácil.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item, index) => (
            <div
              key={index}
              className="card-hover relative flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
            >
              <span className="mb-3 text-4xl font-extrabold text-primary opacity-80">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
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