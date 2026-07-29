"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignIn = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-soft transition-all duration-200 hover:border-primary/40 hover:bg-primary-light hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {isLoading ? (
        <svg className="h-5 w-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="#4285F4" d="M23.04 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.19a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.17-2 3.43-4.94 3.43-8.49Z" />
          <path fill="#34A853" d="M12 24c3.1 0 5.7-1.03 7.6-2.79l-3.72-2.9c-1.03.7-2.35 1.1-3.88 1.1-2.98 0-5.5-2.01-6.4-4.72H1.76v2.98A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.6 14.69a7.2 7.2 0 0 1 0-4.62V7.09H1.76a12 12 0 0 0 0 9.82l3.84-2.22Z" />
          <path fill="#EA4335" d="M12 4.77c1.68 0 3.19.58 4.38 1.72l3.29-3.29C17.7 1.19 15.1 0 12 0A12 12 0 0 0 1.76 7.09l3.84 2.98c.9-2.71 3.42-4.72 6.4-4.72Z" />
        </svg>
      )}
      {isLoading ? "Conectando..." : "Continuar con Google"}
    </button>
  );
}