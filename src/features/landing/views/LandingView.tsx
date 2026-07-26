import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SocialFloatingBar } from "@/components/layout/SocialFloatingBar";

export function LandingView() {
  return (
    <>
      <Header />

      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-24 md:py-32">
          <span className="h-1 w-12 rounded-full bg-primary" />
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Imágenes que cuentan
            <br />
            la historia de tu marca
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Eddy gestiona y presenta tu contenido visual con un flujo simple:
            organizado, siempre disponible, siempre actualizado.
          </p>
        </section>
      </main>

      <Footer />
      <SocialFloatingBar />
    </>
  );
}