import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Bypassa RLS — SOLO usar en server-side (route handlers), nunca en cliente.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}