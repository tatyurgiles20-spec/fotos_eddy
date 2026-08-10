import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteImageFromDrive } from "@/lib/google/drive";

// PATCH /api/frames/:id   Body: subconjunto de { name, is_active, sort_order }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("frames")
    .update({
      name: body.name,
      is_active: body.is_active,
      sort_order: body.sort_order,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ data });
}

// DELETE /api/frames/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: frame } = await supabase
    .from("frames")
    .select("drive_file_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("frames").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (frame?.drive_file_id) {
    await deleteImageFromDrive(frame.drive_file_id).catch(() => {
      // si falla el borrado en Drive no bloqueamos la respuesta; queda huérfano el archivo
    });
  }

  revalidatePath("/");

  return NextResponse.json({ success: true });
}