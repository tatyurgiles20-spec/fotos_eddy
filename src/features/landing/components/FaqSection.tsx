const FAQS = [
  {
    question: "¿Puedo enviar mi propio diseño o imagen?",
    answer:
      "Sí. Puedes enviarnos tu foto, imagen, frase, logo o diseño, y trabajaremos para adaptarlo al producto que deseas personalizar.",
  },
  {
    question: "¿Puedo revisar el diseño antes de que sea elaborado?",
    answer:
      "Sí. Antes de realizar la personalización, podemos mostrarte una propuesta del diseño para confirmar que todo esté como deseas.",
  },
  {
    question: "¿Puedo contratar fotografía y personalización para un mismo evento?",
    answer:
      "Sí. Puedes contar con NOVA PRINT para capturar los momentos especiales de tu evento y convertir esas fotografías en recuerdos personalizados, como tazas, camisetas o llaveros.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Encabezado centrado */}
        <div className="text-center mb-12">
          <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
            Preguntas Frecuentes
          </h2>
        </div>

        {/* Lista de Preguntas Frecuentes */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card/90 to-muted/40 dark:from-card dark:via-card/80 dark:to-muted/20 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl"
            >
              {/* Degradado decorativo sutil en el borde superior */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Título de la pregunta con texto degradado */}
              <h3 className="font-bold text-lg bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {faq.question}
              </h3>

              {/* Respuesta */}
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}