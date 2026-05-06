import { Metadata } from "next";
import { supabase } from "@/utils/supabaseClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const { data } = await supabase.from('hospitals').select('name, short_location, description, image_url').eq('slug', unwrappedParams.id).single();

  if (!data) {
    return {
      title: "Hospital Not Found | CureSureMedico",
    };
  }

  // Strip HTML from description for meta tag
  const plainTextDescription = data.description ? data.description.replace(/<[^>]+>/g, '').substring(0, 160) + '...' : `Get world-class treatment at ${data.name}.`;

  return {
    title: `${data.name} - ${data.short_location || 'Medical Center'} | CureSureMedico`,
    description: plainTextDescription,
    openGraph: {
      title: `${data.name} | CureSureMedico`,
      description: plainTextDescription,
      images: data.image_url ? [data.image_url] : [],
    },
  };
}

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
