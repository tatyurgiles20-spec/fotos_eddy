import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";

type LoginViewProps = {
  debugParams?: { [key: string]: string | string[] | undefined };
};

export function LoginView({ debugParams }: LoginViewProps) {
  const debugEntries = Object.entries(debugParams ?? {}).filter(([key]) =>
    key.startsWith("debug_")
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Panel de Eddy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acceso solo para el administrador del sitio
          </p>
        </div>

        <GoogleSignInButton />

        {/* TEMPORAL — solo para depurar, quitar después */}
        {debugEntries.length > 0 && (
          <div className="mt-6 rounded-lg border border-border bg-card p-4 text-left text-xs">
            <p className="mb-2 font-semibold text-foreground">Debug:</p>
            {debugEntries.map(([key, value]) => (
              <p key={key} className="break-all text-muted-foreground">
                <span className="text-foreground">{key}:</span> {value}
              </p>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}