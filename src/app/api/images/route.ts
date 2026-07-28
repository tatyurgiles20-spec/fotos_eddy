import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadImageToDrive } from "@/lib/google/drive";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const albumId = searchParams.get("albumId");

  const supabase = createAdminClient();
  let query = supabase.from("images").select("*, image_sections(section_id)").order("sort_order");
  if (albumId) query = query.eq("album_id", albumId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const albumId = formData.get("albumId") as string | null;
  const altText = (formData.get("altText") as string | null) ?? "";
  const sectionIds = formData.getAll("sectionIds") as string[];

  if (!file || !albumId) {
    return NextResponse.json({ error: "Falta el archivo o el álbum" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("drive_folder_id")
    .eq("id", albumId)
    .single();

  if (albumError || !album) {
    return NextResponse.json({ error: "Álbum no encontrado" }, { status: 404 });
  }

  const { fileId, directUrl } = await uploadImageToDrive(file, file.name, album.drive_folder_id);

  const { data: image, error: imageError } = await supabase
    .from("images")
    .insert({ drive_file_id: fileId, album_id: albumId, direct_url: directUrl, alt_text: altText })
    .select()
    .single();

  if (imageError) return NextResponse.json({ error: imageError.message }, { status: 500 });

  if (sectionIds.length > 0) {
    await supabase
      .from("image_sections")
      .insert(sectionIds.map((sectionId) => ({ image_id: image.id, section_id: sectionId })));
  }

  return NextResponse.json(image);
}