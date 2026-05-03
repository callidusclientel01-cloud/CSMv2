import { Metadata } from "next";
import { supabase } from "@/utils/supabaseClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const { data } = await supabase.from('treatments').select('name, short_description').eq('slug', unwrappedParams.id).single();

  if (!data) {
    return {
      title: "Treatment Not Found | CureSureMedico",
    };
  }

  const plainTextDescription = data.short_description ? data.short_description.replace(/<[^>]+>/g, '').substring(0, 160) + '...' : `Explore ${data.name} treatments with CureSureMedico.`;

  return {
    title: `${data.name} Treatments | CureSureMedico`,
    description: plainTextDescription,
    openGraph: {
      title: `${data.name} Treatments | CureSureMedico`,
      description: plainTextDescription,
    },
  };
}

export default function TreatmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
