import { AlbumImagesView } from "@/features/admin/images/views/AlbumImagesView";

// Nota: si tus otras rutas [slug]/page.tsx (productos, servicios, galeria) usan
// `{ params }: { params: { slug: string } }` en vez de una Promise (Next 14 vs 15),
// ajusta la firma de esta función igual para mantener consistencia.

export default async function AlbumImagesPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  return <AlbumImagesView albumId={albumId} />;
}