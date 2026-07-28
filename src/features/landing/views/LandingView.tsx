import Image from "next/image";
import Link from "next/link";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";
import { FeaturedGallery } from "@/features/landing/components/FeaturedGallery";
import { getFeaturedImages } from "@/features/landing/api/get-featured-images";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export async function LandingView() {
  const featuredImages = await getFeaturedImages("home_destacadas");

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-primary-light/40 transition-colors duration-300">
        {/* ── HERO SECTION ── */}
        <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Luz de fondo ambiental adaptada al color base (Primary) */}
          <div 
            className="pointer-events-none absolute -top-20 -right-20 -z-10 h-[350px] w-[350px] rounded-full bg-primary/15 blur-[120px] md:h-[500px] md:w-[500px]" 
          />

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Texto principal del Hero */}
            <div className="flex flex-col items-start gap-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estudio Fotográfico & Personalizados
                </span>
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
                Capturamos tus recuerdos y los{" "}
                <span className="relative inline-block text-primary">
                  transformamos
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-primary/30"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10C50 3 150 3 198 10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                en arte único.
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Desde sesiones fotográficas profesionales hasta impresiones personalizadas en tazas, prendas y recuerdos especiales. Dale vida y color a cada detalle con Nova Print.
              </p>

              {/* Botones de Acción (CTA) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/galeria"
                  className="group relative inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-colored transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explorar Portafolio
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a
                  href="#servicios"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-surface hover:border-border-strong hover:-translate-y-0.5"
                >
                  Ver Personalizados
                </a>
              </div>

              {/* Detalle tipo sello hecho a mano */}
              <div className="mt-2 flex items-center gap-3 text-muted-foreground">
                <span className="tag-handwritten">¡Calidad de impresión HD!</span>
                <span className="text-xs">• Tazas, Ropa, Cuadros y más</span>
              </div>
            </div>

            {/* Composición de Imagen del Hero */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Marco de fondo decorativo dinámico */}
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-primary/30 to-primary/5 blur-lg" />

                <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-transform duration-500 hover:scale-[1.01]">
                  <Image
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop"
                    alt="Servicios de fotografía y productos personalizados"
                    width={600}
                    height={700}
                    className="h-[420px] w-full object-cover object-center sm:h-[480px]"
                    priority
                  />
                  
                  {/* Badge flotante de producto sobre la foto */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/60 bg-background/90 p-4 backdrop-blur-md shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Producto Destacado
                        </p>
                        <p className="font-display font-bold text-foreground">
                          Tazas y Camisetas con Tu Fotografía
                        </p>
                      </div>
                      <span className="tag-handwritten font-bold text-lg text-primary">
                        Estilo Único
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN HÍBRIDA DE SERVICIOS (Custom Print + Photo) ── */}
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

        {/* ── GALERÍA DE TRABAJOS DESTACADOS ── */}
        <section className="py-20">
          <FeaturedGallery images={featuredImages} />
        </section>
      </main>

      <Footer />
      <SocialFloatingBar />
    </>
  );
}