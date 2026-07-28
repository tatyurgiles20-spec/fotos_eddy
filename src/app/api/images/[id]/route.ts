import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteImageFromDrive } from "@/lib/google/drive";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: image, error: fetchError } = await supabase
    .from("images")
    .select("drive_file_id")
    .eq("id", id)
    .single();

  if (fetchError || !image) {
    return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
  }

  await deleteImageFromDrive(image.drive_file_id);

  const { error: deleteError } = await supabase.from("images").delete().eq("id", id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}