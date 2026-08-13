import { Sparkles, Truck, Clock, ShieldCheck } from "lucide-react";

const PROPS = [
  {
    icon: Sparkles,
    title: "Impresión HD & Alta Durabilidad",
    description: "Colores vivos en tazas, camisetas y cuadros que perduran.",
  },
  {
    icon: Truck,
    title: "Envíos Seguros",
    description: "Empaque especial anti-impactos para cerámica y cristales.",
  },
  {
    icon: Clock,
    title: "Entrega a Tiempo",
    description: "Producción ágil para que tus regalos lleguen a tiempo.",
  },
  {
    icon: ShieldCheck,
    title: "Revisión de Diseño",
    description: "Verificamos la calidad de tus imágenes antes de imprimir.",
  },
];

export function ValuePropsSection() {
  return (
   <section className="py-16 bg-background border-y border-border/40">
      <div className="container mx-auto px-4">
        {/* Encabezado centrado con tipografía manuscrita */}
        <div className="mx-auto max-w-2xl text-center mb-12">
         {/* <span className="tag-handwritten !text-2xl sm:!text-3xl text-muted-foreground block mb-1">
            Nuestra Garantía
          </span> */}
          <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Nos aseguramos de que cada recuerdo impreso supere tus expectativas.
          </p>
        </div>

        {/* Tarjetas de beneficios */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROPS.map((prop, idx) => {
            const Icon = prop.icon;
            return (
              <div
                key={idx}
                className="card-hover flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-soft transition-all duration-300 hover:border-border"
              >
                <div className="rounded-lg bg-primary-light p-3 text-primary shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground text-sm sm:text-base">
                    {prop.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {prop.description}
                  </p>
                </div>
              </div>
              
            );
          })}
        </div>
      </div>
    </section>
  );
}