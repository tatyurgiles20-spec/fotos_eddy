import Link from "next/link";
import type { Frame } from "@/types/frame";

type Props = {
  frame: Frame | null;
};

export function FrameTeaserSection({ frame }: Props) {
  if (!frame) return null;

  return (
    <section id="marcos" className="scroll-mt-20 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center md:flex-row md:text-left">
        <div className="w-40 shrink-0 sm:w-52">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted shadow-soft">
            <img src={frame.directUrl} alt={frame.name} className="h-full w-full object-contain" />
          </div>
        </div>

        <div>
          <p className="font-display text-2xl font-bold sm:text-3xl">Prueba tus fotos con un marco</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Sube tu foto, elige uno de nuestros marcos y ajústala como quieras. Es gratis y toma un minuto.
          </p>
          <Link
            href="/marcos"
            className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Probar marcos
          </Link>
        </div>
      </div>
    </section>
  );
}