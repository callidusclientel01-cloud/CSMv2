import { Metadata } from "next";
import { supabase } from "@/utils/supabaseClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const { data } = await supabase.from('destinations').select('country_name, tagline, description, image_url').eq('slug', unwrappedParams.id).single();

  if (!data) {
    return {
      title: "Destination Not Found | CureSureMedico",
    };
  }

  const plainTextDescription = data.description ? data.description.replace(/<[^>]+>/g, '').substring(0, 160) + '...' : `Medical treatments in ${data.country_name}.`;

  return {
    title: `Medical Treatments in ${data.country_name} | CureSureMedico`,
    description: plainTextDescription,
    openGraph: {
      title: `Medical Treatments in ${data.country_name} | CureSureMedico`,
      description: plainTextDescription,
      images: data.image_url ? [data.image_url] : [],
    },
  };
}

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
