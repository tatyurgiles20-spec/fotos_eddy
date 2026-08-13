const FAQS = [
  {
    question: "¿Qué calidad debe tener la foto que envíe?",
    answer:
      "Recomendamos fotos claras tomadas con luz natural. Si la imagen requiere mejoras de resolución o encuadre, nuestro equipo la optimizará antes de imprimir.",
  },
  {
    question: "¿Cuánto tarda la entrega de un producto personalizado?",
    answer:
      "El tiempo estimado de elaboración es de 24 a 48 horas tras aprobar el diseño digital, más el tiempo de envío según la localidad.",
  },
  {
    question: "¿Cómo agendar una sesión de fotografía?",
    answer:
      "Puedes seleccionar el servicio de fotografía directamente en el catálogo y agendar el día y la hora desde nuestro sistema en línea o vía WhatsApp.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
         {/*  <span className="tag-handwritten text-2xl">Resolvemos tus dudas</span> */}
          <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-semibold text-card-foreground text-lg">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}