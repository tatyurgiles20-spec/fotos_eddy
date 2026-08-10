import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrCreateDriveFolder, uploadImageToDrive } from "@/lib/google/drive";
import { mapFrameRow, type FrameRow } from "@/types/frame";

// GET /api/frames?page=1&pageSize=20&search=&status=all|active|inactive
export async function GET(request: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const pageSize = Math.max(1, Number(params.get("pageSize") ?? 20));
  const search = params.get("search")?.trim() ?? "";
  const status = params.get("status") ?? "all"; // all | active | inactive

  const supabase = createAdminClient();

  let query = supabase
    .from("frames")
    .select(
      "id, name, drive_file_id, direct_url, width, height, is_active, sort_order, created_at, updated_at",
      { count: "exact" }
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (search) query = query.ilike("name", `%${search}%`);
  if (status === "active") query = query.eq("is_active", true);
  if (status === "inactive") query = query.eq("is_active", false);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = ((data ?? []) as FrameRow[]).map(mapFrameRow);

  return NextResponse.json({ data: mapped, count: count ?? 0 });
}

// POST /api/frames  (multipart/form-data: file, name)
export async function POST(request: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const name = (formData.get("name") as string | null)?.trim();

  if (!file || !name) {
    return NextResponse.json({ error: "name y file son obligatorios" }, { status: 400 });
  }

  const folderId = await getOrCreateDriveFolder("frames", "Marcos");
  const { fileId, directUrl } = await uploadImageToDrive(file, `${name}-${Date.now()}`, folderId);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("frames")
    .insert({
      name,
      drive_file_id: fileId,
      direct_url: directUrl,
      is_active: true,
      sort_order: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ data }, { status: 201 });
}