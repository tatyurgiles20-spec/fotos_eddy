import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js'; // O usa la instancia del cliente Supabase que tengas en tu proyecto

// Instancia rápida de Supabase usando tus variables de entorno
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://novaprintecu.com';

  // 1. Obtener slugs dinámicos desde Supabase
  const [{ data: galerias }, { data: productos }, { data: servicios }] = await Promise.all([
    supabase.from('albums').select('slug, updated_at'),     // Ajusta 'albums' si tu tabla de galería se llama diferente
    supabase.from('products').select('slug, updated_at'),   // Ajusta 'products' si corresponde
    supabase.from('services').select('slug, updated_at'),   // Ajusta 'services' si corresponde
  ]);

  // 2. Mapear URLs dinámicas de Galería
  const galeriaUrls: MetadataRoute.Sitemap = (galerias || []).map((item) => ({
    url: `${baseUrl}/galeria/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Mapear URLs dinámicas de Productos
  const productosUrls: MetadataRoute.Sitemap = (productos || []).map((item) => ({
    url: `${baseUrl}/productos/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 4. Mapear URLs dinámicas de Servicios
  const serviciosUrls: MetadataRoute.Sitemap = (servicios || []).map((item) => ({
    url: `${baseUrl}/servicios/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 5. Rutas estáticas principales
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/fotografia-de-eventos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/marcos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Retornar todas las URLs combinadas
  return [
    ...staticUrls,
    ...galeriaUrls,
    ...productosUrls,
    ...serviciosUrls,
  ];
}