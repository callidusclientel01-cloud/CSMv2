import { Metadata } from "next";
import { supabase } from "@/utils/supabaseClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const { data } = await supabase.from('blog_posts').select('title, excerpt, image_url, author').eq('slug', unwrappedParams.slug).single();

  if (!data) {
    return {
      title: "Article Not Found | CureSureMedico Blog",
    };
  }

  const plainTextDescription = data.excerpt ? data.excerpt.replace(/<[^>]+>/g, '').substring(0, 160) + '...' : `Read this article by ${data.author} on CureSureMedico.`;

  return {
    title: `${data.title} | CureSureMedico Blog`,
    description: plainTextDescription,
    openGraph: {
      title: `${data.title} | CureSureMedico Blog`,
      description: plainTextDescription,
      images: data.image_url ? [data.image_url] : [],
      type: 'article',
      authors: [data.author],
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
