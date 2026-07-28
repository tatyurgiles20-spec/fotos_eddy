import { AlbumView } from "@/features/gallery/views/AlbumView";

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AlbumView slug={slug} />;
}