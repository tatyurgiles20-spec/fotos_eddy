import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fotografía de Eventos en Ecuador | Cobertura Nacional',
  description: 'Servicio profesional de fotografía para bodas, cumpleaños, eventos corporativos y sociales. Cobertura en Azogues, Cuenca, Quito, Guayaquil y todo Ecuador.',
  alternates: {
    canonical: 'https://tusitio.com/fotografia-de-eventos',
  },
};

export default function FotografiaEventosPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Fotografía Profesional para Eventos en Ecuador
      </h1>
      <p className="text-lg text-gray-700">
        Capturamos los mejores momentos de tus eventos sociales y corporativos con cobertura a nivel nacional.
      </p>
    </main>
  );
}