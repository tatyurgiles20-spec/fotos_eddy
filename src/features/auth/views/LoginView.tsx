import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";

export function LoginView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Panel de Eddy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acceso solo para el administrador del sitioa
          </p>
        </div>

        <GoogleSignInButton />
      </div>
    </main>
  );
}