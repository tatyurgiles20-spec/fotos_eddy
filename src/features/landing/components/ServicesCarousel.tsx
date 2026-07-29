"use client";

import { useRef } from "react";
import Image from "next/image";

type ServiceSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

const DEFAULT_SERVICES: ServiceSlide[] = [
  {
    id: "1",
    title: "Sesiones fotográficas",
    description: "Estudio, retrato y producto",
    imageUrl: "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Tazas & Regalos",
    description: "Personalizados con tu foto",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop](https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Ropa & Estampados",
    description: "Impresión de alta definición",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Cuadros & Decoración",
    description: "Convierte tus fotos en arte",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
  },
];

interface ServicesCarouselProps {
  services?: ServiceSlide[];
  title?: string;
}

export function ServicesCarousel({
  services = DEFAULT_SERVICES,
  title = "Carrusel con los servicios que ofrecemos",
}: ServicesCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 300) + 24;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service) => (
          <div
            key={service.id}
            data-card
            className="card-hover relative aspect-square w-[75%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-card shadow-soft sm:w-[45%] lg:w-[31%]"
          >
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 31vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h4 className="font-display text-lg font-bold text-white">{service.title}</h4>
              <p className="mt-1 text-sm text-white/80">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}