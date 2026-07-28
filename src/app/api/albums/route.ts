import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createDriveFolder } from "@/lib/google/drive";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { authorized } = await requireAdmin();
    if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const slug = slugify(name);
    const driveFolderId = await createDriveFolder(name, process.env.DRIVE_FOLDER_ID);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("albums")
      .insert({ name, slug, drive_folder_id: driveFolderId })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error creando álbum:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}