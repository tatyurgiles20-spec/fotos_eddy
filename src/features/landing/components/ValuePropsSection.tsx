import Image from "next/image";

export function ValuePropsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Nos aseguramos de que cada recuerdo impreso supere tus expectativas.
          </p>
        </div>

        {/* Layout en 2 columnas: items-stretch asegura misma altura */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Columna 1: Imagen Destacada */}
          <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl border border-border/80 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.65)] dark:shadow-[0_0_50px_rgba(255,255,255,0.35)] transition-shadow duration-300">
            <Image
              src="/personalizados.png"
              alt="Productos personalizados de alta calidad"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>

          {/* Columna 2: Texto Descriptivo Principal */}
          <div className="lg:col-span-7 flex">
            <div className="bg-card rounded-2xl border border-border/80 p-6 sm:p-8 md:p-10 w-full h-full flex flex-col justify-center shadow-[0_30px_60px_-10px_rgba(0,0,0,0.65)] dark:shadow-[0_0_50px_rgba(255,255,255,0.35)] transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-4">
                Pasión y detalle en cada producto
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Porque transformamos tus ideas y momentos especiales en recuerdos únicos. 
                Trabajamos con dedicación y responsabilidad, brindando un servicio personalizado, 
                creativo y de calidad en cada proyecto, cuidando cada detalle para superar las 
                expectativas de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}