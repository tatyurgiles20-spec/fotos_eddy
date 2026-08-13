import Link from "next/link";
import type { Frame } from "@/types/frame";

type Props = {
  frame: Frame | null;
};

export function FrameTeaserSection({ frame }: Props) {
  if (!frame) return null;

  return (
   <section id="marcos" className="scroll-mt-20 py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-2xl text-center mb-10">
         {/* <span className="tag-handwritten !text-2xl sm:!text-3xl text-muted-foreground block mb-1">
            Simulador Digital
          </span> */}
          <h2 className="tag-handwritten !text-5xl sm:!text-6xl md:!text-7xl font-bold tracking-wide text-foreground">
            Marcos y Cuadros
          </h2>
        </div>

        {/* Contenido de la sección */}
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-soft">
          <div className="w-40 shrink-0 sm:w-52">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted shadow-soft">
              <img src={frame.directUrl} alt={frame.name} className="h-full w-full object-contain" />
            </div>
          </div>

          <div>
            <p className="font-display text-2xl font-bold sm:text-3xl text-card-foreground">
              Prueba tus fotos con un marco
            </p>
            <p className="mt-2 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
              Sube tu foto, elige uno de nuestros marcos y ajústala como quieras. Es gratis y toma un minuto.
            </p>
            <Link
              href="/marcos"
              className="mt-5 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Probar marcos ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}