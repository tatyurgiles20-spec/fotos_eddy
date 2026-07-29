import Link from "next/link";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";

export function LoginView() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6">
      {/* Luz de fondo ambiental, consistente con el Hero de la landing */}
      <div className="pointer-events-none absolute -top-20 -right-20 -z-10 h-[350px] w-[350px] rounded-full bg-primary/15 blur-[120px] md:h-[500px] md:w-[500px]" />

      {/* Botón regresar */}
      <Link
        href="/"
        className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al inicio
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-elevated">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Panel de Eddy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acceso solo para el administrador del sitio
          </p>
        </div>

        <GoogleSignInButton />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿No eres administrador?{" "}
          <Link href="/" className="font-medium text-primary transition-colors hover:text-primary-hover">
            Regresa al sitio
          </Link>
        </p>
      </div>
    </main>
  );
}