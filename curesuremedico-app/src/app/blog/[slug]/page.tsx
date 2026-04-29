"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string;
  category: string;
  published_date?: string;
  youtube_video_id?: string;
}

const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    slug: "navigating-precision-oncology",
    title: "Navigating Precision Oncology: New Hope for Patients in Nairobi and Beyond",
    excerpt: "How genomic testing is revolutionizing personalized cancer care and making international treatments more accessible than ever.",
    content: "The landscape of cancer treatment in East Africa is undergoing a profound transformation. As we move away from 'one-size-fits-all' therapies, precision oncology is emerging as a beacon of hope for patients in Nairobi, providing tailored treatments based on genetic profiles.\n\nFor decades, oncology focused on the location of the tumor—breast, lung, or colon. Today, we look at the molecular signature of the cancer itself. At CureSureMedico, we are seeing how precision medicine bridges the gap between global innovations and local patient care, ensuring that every individual receives the most effective therapy with the fewest side effects.\n\nBreakthroughs in Genetic Mapping\nRecent partnerships with labs in Europe and the US have enabled us to perform advanced genomic sequencing right here in Nairobi. This process involves analyzing the DNA of a patient's tumor to identify specific mutations that are driving the cancer's growth.\n\nOnce identified, we can often match these mutations with \"targeted therapies\"—drugs specifically designed to attack those vulnerabilities. This approach has drastically improved survival rates for late-stage patients who previously had limited options.\n\nA Nairobi Success Story\nTake the case of Samuel, a 54-year-old architect who was diagnosed with advanced lung cancer last year. Standard chemotherapy was proving taxing with little progress. Through genomic testing, we discovered a rare ALK mutation. By switching to a targeted tablet therapy, Samuel's tumors shrank by 60% in three months, and he remains active in his firm today.",
    author: "Dr. Amara Okoro",
    category: "Featured",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbINngkspDFP3sh8jnV33cN0tC0RpN5ZmrD9-RWRjiOSMgeltBK4Qm1ogJPArcgOEsQUsqgbM8C4EZhncps9SkbDJWGMJWPbKB1YmvbEdf_sj7pJwsa-aq6YK20GHcxJRWnAoe32WFOTJfPqopP8ZFNSnEuupJDX6c-3qspQm8KZ9-4nLqfkCZyJmtIykSOQ8wFfXCIpbW20NUQ53zrQ5CKTgTha_Hz8vzsg-JbpXuOh9SXpRrhv4AxmN21pggbpjJKe1EwbjD1J0",
    published_date: "October 24, 2023"
  }
];

export default function BlogArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      try {
        const { data } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (data) {
          setPost(data);
          return;
        }
        
        // Use ID for fallback since slug is sometimes used loosely
        setPost(fallbackPosts.find((p) => p.slug === slug || p.id === slug) ?? null);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return <main className="pt-36 px-8 text-center">Loading article...</main>;
  }

  if (!post) {
    return (
      <main className="pt-36 px-8 text-center space-y-4">
        <p className="text-on-surface-variant">Article not found.</p>
        <Link href="/blog" className="text-primary font-bold hover:underline">
          Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 bg-surface text-on-surface">
      {/* Article Header */}
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden mb-12 h-[500px] group">
          <img 
            alt={post.title} 
            className="w-full h-full object-cover" 
            src={post.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000"} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 text-white w-full">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-bold tracking-wide mb-4">
              {post.category || "General"}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed">person</span>
                <span className="font-medium text-lg">{post.author}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed">calendar_today</span>
                <span className="font-medium text-lg">{post.published_date || "Recently updated"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout with Sticky Sidebar */}
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Social Sharing (Sticky) */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-32 flex flex-col items-center gap-6">
            <span className="text-[10px] uppercase tracking-widest font-bold text-outline">Share</span>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-highest text-primary hover:bg-primary hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined">chat</span>
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-highest text-primary hover:bg-primary hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined">work</span>
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-highest text-primary hover:bg-primary hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined">public</span>
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-highest text-primary hover:bg-primary hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined">alternate_email</span>
            </button>
          </div>
        </aside>

        {/* Middle: Article Body */}
        <article className="lg:col-span-8 article-content text-lg leading-relaxed text-on-surface-variant font-medium">
          
          {post.youtube_video_id && (
            <div className="mb-10 w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-outline-variant/10">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${post.youtube_video_id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {post.content ? (
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <>
              <p className="text-xl font-medium text-primary mb-8 leading-relaxed">
                The landscape of cancer treatment in East Africa is undergoing a profound transformation. As we move away from 'one-size-fits-all' therapies, precision oncology is emerging as a beacon of hope for patients in Nairobi, providing tailored treatments based on genetic profiles.
              </p>
              <p className="mb-6">
                For decades, oncology focused on the location of the tumor—breast, lung, or colon. Today, we look at the molecular signature of the cancer itself. At CureSureMedico, we are seeing how precision medicine bridges the gap between global innovations and local patient care, ensuring that every individual receives the most effective therapy with the fewest side effects.
              </p>

              <div className="my-12 p-8 bg-surface-container-low rounded-xl border-l-4 border-secondary relative">
                <span className="material-symbols-outlined absolute top-4 left-4 text-secondary/20 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <blockquote className="text-2xl italic font-medium text-on-surface leading-snug relative z-10 pl-6">
                  "Precision medicine is not just about the science; it's about giving a father his strength back to play with his children, and a teacher the clarity to return to her classroom."
                </blockquote>
                <p className="mt-4 text-secondary font-bold text-right">— Dr. Amara Okoro, Lead Oncologist</p>
              </div>

              <h2 className="text-3xl font-bold text-blue-800 mt-10 mb-6">Breakthroughs in Genetic Mapping</h2>
              <p className="mb-6">
                Recent partnerships with labs in Europe and the US have enabled us to perform advanced genomic sequencing right here in Nairobi. This process involves analyzing the DNA of a patient's tumor to identify specific mutations that are driving the cancer's growth.
              </p>

              <div className="grid grid-cols-2 gap-4 my-10">
                <div className="rounded-xl overflow-hidden h-64">
                  <img alt="Laboratory Research" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTj5UO77sVknla96B9LJ-OorRzG9UmHunAuOOdhVh6VKGtnr36NYz8v_Ggg0tdcLrvq9BXBIyIb4EDoi2g15EfA_6z4VU23uQk_zbsDY7_4s_s-IMrvorhGJW0sfQLD_V3HsXXywdYefVPVIskhOibC3D7gFZSnaYDm8uqZJeuLxGYr7n_efnKfw7py_MjLrdBDTReuJ_rGDUsielG1NfJpWKGrse68qc2ASqjfIGIdyTCPPFiB58ojdvyTNuEaZwFmIXgbsSxYGE" />
                </div>
                <div className="rounded-xl overflow-hidden h-64">
                  <img alt="Medical Technology" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIJ8YPbS_hzSkKNR5f_is4jklWW6O_9syKMMLd0K9tW6eNhGUWJQcyQth7pD6JRkWmkyHQYBC_Pkr-a8Ps--1GF54LdSWFPh62wHKzFADAewYpL7FAdE2Yqz94nfnSaB028UWk-S2JJgcbksE7WsMF0ERNtyNB3W2bMQu_gU3njuytxQ6T396e2_HWs2Zv_NoiHOMkVemA8mN0WPsjmsm_6tFfzC4z3vzZm2Uyjlo5BAf3yBodNJwPgkeoL3nEf_lIyHvr2-T9RA0" />
                </div>
              </div>

              <p className="mb-6">
                Once identified, we can often match these mutations with &quot;targeted therapies&quot;—drugs specifically designed to attack those vulnerabilities. This approach has drastically improved survival rates for late-stage patients who previously had limited options.
              </p>

              <h2 className="text-3xl font-bold text-blue-800 mt-10 mb-6">A Nairobi Success Story</h2>
              <p className="mb-6">
                Take the case of Samuel, a 54-year-old architect who was diagnosed with advanced lung cancer last year. Standard chemotherapy was proving taxing with little progress. Through genomic testing, we discovered a rare ALK mutation. By switching to a targeted tablet therapy, Samuel's tumors shrank by 60% in three months, and he remains active in his firm today.
              </p>
            </>
          )}

          {/* Comments Section */}
          <section className="mt-20 pt-12 border-t border-outline-variant">
            <h3 className="text-3xl font-bold tracking-tight text-primary mb-8">Join the Conversation</h3>
            
            <div className="space-y-8 mb-12">
              <div className="flex gap-4 p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                  <span className="text-on-primary-fixed font-bold">MK</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-on-surface">Musa Kamau</span>
                    <span className="text-xs text-outline">2 days ago</span>
                  </div>
                  <p className="text-on-surface-variant font-normal text-base">
                    Incredible to see this level of technology available in Kenya. How can one find out if their specific case is eligible for this type of mapping?
                  </p>
                  <button className="mt-2 text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-sm">reply</span> Reply
                  </button>
                </div>
              </div>
            </div>

            <form className="bg-surface-container-low p-8 rounded-2xl">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">Name</label>
                  <input className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-primary/40 py-3 px-4 shadow-sm" placeholder="Your Name" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">Email</label>
                  <input className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-primary/40 py-3 px-4 shadow-sm" placeholder="your@email.com" type="email" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Comment</label>
                <textarea className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-primary/40 py-3 px-4 shadow-sm" placeholder="Share your thoughts..." rows={4}></textarea>
              </div>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/20">
                Post Comment
              </button>
            </form>
          </section>
        </article>

        {/* Right: Related Articles */}
        <aside className="lg:col-span-3">
          <div className="sticky top-32">
            <h4 className="text-sm uppercase tracking-widest font-bold text-primary mb-6">Further Reading</h4>
            <div className="space-y-6">
              <Link href="#" className="group block">
                <div className="rounded-xl overflow-hidden mb-3 h-32">
                  <img alt="Preventative Health" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJfZAKm05nX_liN1OJtWvL5X3vhEOJEX65QJ4vXrrdyZ597u03wkF2TMQmd2WytYxRARMwfjPK_SAfFK5RCjTceCse2ZuT6bUtSm55VWeub0yFYiSOyIlXkoGSL3_Y0w5ke6hsnDXSBPCbSdKNUcM25MIoBszlNmRh57GsVQ7t4Nd1j8kfCGcyZ6s_T-Bn0Cic282Jklr2GL7iyWrzBC9tct47yHgy2FyOnpPUzqS4OYNXKSCZQauX6OTtijqsZV_UFK_C9kx6u0I" />
                </div>
                <h5 className="font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">5 Ways to Support Immunity During Treatment</h5>
                <span className="text-xs text-outline mt-2 block">Nov 12, 2023 • 4 min read</span>
              </Link>
              <Link href="#" className="group block">
                <div className="rounded-xl overflow-hidden mb-3 h-32">
                  <img alt="Hospital Technology" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtJ6Z_h58BA4mnSu-fkqN2DaeMzAnKrkSJnIAv6ccA7DmNbvoUrJl8_PbBK-d7tM_3x7DP_WJoFqENMPcDQlc-QOIy1jTULEHb0PXz8N4I1Y1pHS-tCd0x6mihKc3aMQ-t6KURZZpJvISHjOaiu3JEnnyuUhh7AKPzOgmB3V58WynU0X76XVjaQ3JC8Ta0PqlWA5wnYlfed5t_3QmUZKkj_Pw4ncgu0Zimm5qQSuaSMXAJUMJUPddb-1PTZNGOCuXMh0j259obeis" />
                </div>
                <h5 className="font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">New Imaging Center Opens in Westlands</h5>
                <span className="text-xs text-outline mt-2 block">Oct 30, 2023 • 3 min read</span>
              </Link>
            </div>
            
            <div className="mt-12 p-6 bg-tertiary-container text-on-tertiary-container rounded-2xl">
              <h5 className="font-bold mb-2">Need a consultation?</h5>
              <p className="text-sm opacity-90 mb-4">Our oncology team is ready to discuss precision mapping for your journey.</p>
              <button className="w-full py-2 bg-white text-tertiary font-bold rounded-lg hover:bg-surface-container-low transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
