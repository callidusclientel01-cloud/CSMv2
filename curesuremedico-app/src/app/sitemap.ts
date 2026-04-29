import { MetadataRoute } from 'next'
import { supabase } from '@/utils/supabaseClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Define your base URL. Ensure you set this environment variable in production (e.g. Vercel)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curesuremedico.com';

  try {
    // Fetch dynamic data to include in sitemap
    const { data: treatments } = await supabase.from('treatments').select('id, slug');
    const { data: destinations } = await supabase.from('destinations').select('id, slug');
    const { data: hospitals } = await supabase.from('hospitals').select('id, slug');

    // Default static routes
    const routes = [
      '',
      '/treatments',
      '/destinations',
      '/hospitals',
      '/quote',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes mapping
    const treatmentRoutes = (treatments || []).map((t) => ({
      url: `${baseUrl}/treatments/${t.slug || t.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    const destinationRoutes = (destinations || []).map((d) => ({
      url: `${baseUrl}/destinations/${d.slug || d.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    const hospitalRoutes = (hospitals || []).map((h) => ({
      url: `${baseUrl}/hospitals/${h.slug || h.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...routes, ...treatmentRoutes, ...destinationRoutes, ...hospitalRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback to static routes if database fails
    return [
      '',
      '/treatments',
      '/destinations',
      '/hospitals',
      '/quote',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }));
  }
}
