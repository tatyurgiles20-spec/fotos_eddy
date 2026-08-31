import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteImageFromDrive } from "@/lib/google/drive";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// PUT /api/albums/:id — renombra el álbum
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const { name } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("albums")
    .update({ name, slug: slugify(name) })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/albums/:id — rechaza si alguna imagen del álbum está en uso
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("id, drive_file_id")
    .eq("album_id", id);

  if (imagesError) return NextResponse.json({ error: imagesError.message }, { status: 500 });

  const imageIds = (images ?? []).map((img) => img.id);

  if (imageIds.length > 0) {
    const [carouselMain, carouselOverlay, productImages, categoryHighlights] = await Promise.all([
      supabase.from("carousel_slides").select("id", { count: "exact", head: true }).in("image_id", imageIds),
      supabase.from("carousel_slides").select("id", { count: "exact", head: true }).in("overlay_image_id", imageIds),
      supabase.from("product_images").select("product_id", { count: "exact", head: true }).in("image_id", imageIds),
      supabase.from("category_highlights").select("id", { count: "exact", head: true }).in("image_id", imageIds),
    ]);

    const usages: string[] = [];
    if ((carouselMain.count ?? 0) > 0) usages.push(`${carouselMain.count} en el carrusel`);
    if ((carouselOverlay.count ?? 0) > 0) usages.push(`${carouselOverlay.count} como logo/overlay del carrusel`);
    if ((productImages.count ?? 0) > 0) usages.push(`${productImages.count} en productos`);
    if ((categoryHighlights.count ?? 0) > 0) usages.push(`${categoryHighlights.count} en categorías destacadas`);

    if (usages.length > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar: hay imágenes de este álbum en uso (${usages.join(", ")}). Quítalas de ahí primero.`,
        },
        { status: 409 }
      );
    }
  }

  // Ninguna imagen está en uso — se puede borrar todo en cascada
  for (const image of images ?? []) {
    await deleteImageFromDrive(image.drive_file_id);
  }

  if (imageIds.length > 0) {
    const { error: deleteImagesError } = await supabase.from("images").delete().in("id", imageIds);
    if (deleteImagesError) return NextResponse.json({ error: deleteImagesError.message }, { status: 500 });
  }

  const { error: deleteAlbumError } = await supabase.from("albums").delete().eq("id", id);
  if (deleteAlbumError) return NextResponse.json({ error: deleteAlbumError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}