import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const refreshToken = data.session?.provider_refresh_token;

      if (refreshToken) {
        const adminClient = createAdminClient();
        const { error: saveError } = await adminClient
          .from("drive_credentials")
          .upsert({ id: 1, refresh_token: refreshToken, updated_at: new Date().toISOString() });

        if (saveError) {
          console.error("Error guardando refresh_token de Drive:", saveError);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}