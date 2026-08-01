import { CarouselManagerView } from "@/features/admin/carousel/views/CarouselManagerView";

export default function AdminCarruselPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 font-display text-2xl font-bold">Carrusel de la landing</h1>
      <CarouselManagerView />
    </div>
  );
}