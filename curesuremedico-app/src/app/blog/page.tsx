"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

interface BlogPost {
  id: string; // the database is mostly using integer here, but string represents it well in JS
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string;
  category: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        let finalPosts: BlogPost[] = [];
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("id", { ascending: true }); // standard order

        if (error) {
          console.error("Error fetching blog posts:", error);
        }
        
        if (data && data.length > 0) {
          finalPosts = data;
        } else {
          // STATIC FALLBACK
          finalPosts = [
            {
              id: "1",
              slug: "navigating-precision-oncology",
              title: "Navigating Precision Oncology: New Hope for Patients in Nairobi and Beyond",
              excerpt: "How genomic testing is revolutionizing personalized cancer care and making international treatments more accessible than ever.",
              content: "",
              author: "Dr. Amara Okoro",
              category: "Featured",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbINngkspDFP3sh8jnV33cN0tC0RpN5ZmrD9-RWRjiOSMgeltBK4Qm1ogJPArcgOEsQUsqgbM8C4EZhncps9SkbDJWGMJWPbKB1YmvbEdf_sj7pJwsa-aq6YK20GHcxJRWnAoe32WFOTJfPqopP8ZFNSnEuupJDX6c-3qspQm8KZ9-4nLqfkCZyJmtIykSOQ8wFfXCIpbW20NUQ53zrQ5CKTgTha_Hz8vzsg-JbpXuOh9SXpRrhv4AxmN21pggbpjJKe1EwbjD1J0"
            },
            {
              id: "2",
              slug: "ultimate-checklist-medical-visa",
              title: "The Ultimate Checklist for Medical Visa Applications",
              excerpt: "Ensure your journey is smooth. From medical documentation to financial proof, here's everything you need for India and UAE travel.",
              content: "",
              author: "CSM Editorial",
              category: "Medical Travel Tips",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjwhBievID-Dmqe_gorOw2Iv0on9lW5gZe12o8Ua7kHxqmTIDf8ti-SNtrJj2hCA3TIUg_P5hPRxNff5qDW8dQBZId1mKsSEhu8_iUAZlEnTuSafuRLPqHz-lbKHQSVkVkmy0qCYDgXhhTGwd0HJaZ5zggbUARiFazqbb7laFNxdO5ecB8z0vpEqRkPk6s4HmiwTfwQo4RJpfwMCrz4SlWgQ45pk1RAUX04M3BcW5F-WDbDsFzYyUFodAS-MXKVfYNq9VjwSvwyY0"
            },
            {
              id: "3",
              slug: "robotic-assisted-cardiac-surgery",
              title: "Robotic-Assisted Cardiac Surgery: Minimizing Recovery Time",
              excerpt: "Discover how minimally invasive robotics are helping patients return home in half the time compared to traditional methods.",
              content: "",
              author: "CSM Editorial",
              category: "Treatment Breakthroughs",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcvHgrQaOpVb6-0W8ayeYgOXdnXXV0Rz_E9eXR04tCjOn_hK6-wAGeP3WL8fkm69fCvoyBoChqpRQIJGkeQJ3694g31h3foqakqRdAydsDDNCFjlJCullDlOz7souXaOKAI-GnkkgmNC8Dc5omNfVEiOnFfzFBZSMAh3BDlF-F430-MGwXzUjKPJlOFva4iICwOc3OyPr5RoOpimRgZ_mmebV7MhMw-oU5SODcsMygC2wEndHX7lBR0AmYeFIJZVqhFuLIB4UpPtU"
            },
            {
              id: "4",
              slug: "kofis-hip-replacement-journey",
              title: "From Lagos to Recovery: Kofi's Hip Replacement Journey",
              excerpt: "\"I can play with my grandchildren again.\" A personal look into the emotional and physical journey of medical travel.",
              content: "",
              author: "CSM Editorial",
              category: "Patient Success Stories",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwnFA8T6MsUc7bnPWGey9XrV1iTcy2rl0oa80rfiRXx4XdsV7khUqlaoHOjC4R7Vx5_n24PGHDG1kFHJxvFU8AusoxnIgonnCwoq1MuX6Lkw_Fa9c2ZyeJKoImG_AoD6-3sACj97NHo346mwcBu84j_vVOZh7JeK9iJqlMoqCBguC_L6kJOE0ac4XvMV5teeM1ku_ZToN1RzBzwsGOvLRlJgSl52Z54tMjUG4p6m0yVOKWTyKBm7pzdJHwLsanrTumY8vFOc7E0Ic"
            },
            {
              id: "5",
              slug: "clinic-royale-luxury-medical",
              title: "Clinic Royale: Luxury Meets World-Class Medical Care",
              excerpt: "A tour inside the Middle East's most technologically advanced facility, specialized in neurosurgery and rehab.",
              content: "",
              author: "CSM Editorial",
              category: "Hospital Spotlights",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC1T1blxW2lIcPBs9qi1jse-x0aazUPMpiHXoJ7QHkMGhgSpn0n8VvSlMFymjJBP61kvOwdyDgwudZSzbj1yk1h1d8Q1ckoag_7YPSAsBhkqZtv3jlNEHuNoiAA_Ww_iwxzrwg1S_E6tltqq8mHSCnCWVYcNFRBakJeQuqxFAihvpoo8yI8d9suYv4o93YuONHnQu5DBYAxb4R5tPt7RbV-ydOc90tuDXX6CErmQuqq4Yj_pVXAerukCXMZhUpOtV_z4aqtPRFTSE"
            },
            {
              id: "6",
              slug: "telemedicine-post-surgery",
              title: "Telemedicine: The Bridge to Post-Surgery Care",
              excerpt: "How CureSureMedico uses remote monitoring to ensure patient safety long after they return home from treatment.",
              content: "",
              author: "CSM Editorial",
              category: "Treatment Breakthroughs",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW8RYXOGdPgmtTZ4_ekScfzqpi1R_q4UMSOLeVEI2jvV6l37lLPWx3c00bivPkXrFlA0GWFgjYiyMs4VzxpCr5sliCM_MNXD_ysclQDrSeXhQ4fYapn4VnxGheFP_clpTBaQFH3-icX-gkIkZIn1HLUyY0EOPHqQG_AJhvhpTKqpCgjOGMLKSQUzrtswJbVl761t4e272JEilRylZlxBcqvzB_cBqRWJ8DhF7ni-J6A6CnDwvXpF20BUHOiHRjaDJIKo27knPLxTk"
            },
            {
              id: "7",
              slug: "preparing-body-long-haul-travel",
              title: "Preparing Your Body for Long-Haul Travel Post-Surgery",
              excerpt: "Nutrition and exercise tips to manage inflammation and fatigue when traveling back to Africa after your procedure.",
              content: "",
              author: "CSM Editorial",
              category: "Medical Travel Tips",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzjNMzfwMT01PQQkBQcKcJpxgiU0VPyDB3MGxN9dbJ4bWlUpbG8sjZ5i1Fe9JfFBUBbmO1nzGCpSYRF9KZCOZsBULXy6KX837yS_dGJ_pYzR6Hso_5d5qV2Sx1XLOwswwlYTlpwXo076khaieY7SJt3aL76Xpfy0dvya3GuVbmrOrwoYXnP2iLWUevc3MF4DfSenik8M9n_e4IV7qpXuGBeiGpIaBpPPL-2KlsbeSJpl9KJXKla6ktw8nnD02hZesC_h9UhGWgKvM"
            }
          ];
        }
        setPosts(finalPosts);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Extract a featured post
  const featuredPost = posts.length > 0 ? posts[0] : null;
  // The rest for the grid
  const gridPosts = posts.length > 0 ? posts.slice(1) : [];

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary mb-6 leading-tight">
            Medical Insights & <span className="text-secondary">Patient Guides</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl">
            Expert advice on global healthcare, treatment breakthroughs, and medical travel tips curated specifically for the African community.
          </p>
        </div>
      </section>

      {/* Featured Article Bento Grid (Show only if there's a featured post) */}
      {featuredPost && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-[400px] md:h-[500px]">
              <img 
                 alt={featuredPost.title} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                 src={featuredPost.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000"} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 p-8 md:p-12 text-white">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
                   Featured Article
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl leading-tight">{featuredPost.title}</h2>
                <p className="text-white/90 text-lg mb-6 max-w-xl hidden md:block">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-white overflow-hidden">
                    <img 
                       alt="Author" 
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFhFa8nvePBdVukk-9mtqC1HODM0ZDIHY2hP9z5oln0dZS0l-gtIDCyQTpS6yJuW7m_nBhYpbTQ-N4CYSYxQmWy0hA8c_0RZBDUbVHwkaWuV8FRUYjP71WFr03W6sS3UYnSNDw5NgHLgEE_xP9l65Q3EM0aFU151Jm6tQvCjQ3GfOmx08OvwNj6OiA-ZnbBcwgIPCeN6SezzNZcQ_ReqqEvXH0DOYqc0YJ284B99Fg7cSY8RxdDQ5dqYGd0T0OP32TfX0I5QPFnIU" 
                    />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">{featuredPost.author}</p>
                    <p className="text-white/70">Medical Expert</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Newsletter & Categories */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl mb-4 text-secondary-fixed">mail</span>
                <h3 className="text-2xl font-bold mb-2">Stay Informed</h3>
                <p className="text-primary-fixed text-sm mb-6 leading-relaxed">Join 15,000+ patients receiving monthly updates on healthcare breakthroughs and travel safety.</p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none" placeholder="Email address" type="email" />
                  <button className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 rounded-full hover:brightness-105 transition-all" type="submit">Subscribe Now</button>
                </form>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                Top Categories
              </h3>
              <div className="space-y-3">
                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-colors group">
                  <span className="text-on-surface-variant font-medium group-hover:text-primary">Treatment Breakthroughs</span>
                  <span className="bg-surface-container-high px-2 py-0.5 rounded text-xs font-bold text-on-surface-variant">24</span>
                </Link>
                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-colors group">
                  <span className="text-on-surface-variant font-medium group-hover:text-primary">Medical Travel Tips</span>
                  <span className="bg-surface-container-high px-2 py-0.5 rounded text-xs font-bold text-on-surface-variant">31</span>
                </Link>
                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-colors group">
                  <span className="text-on-surface-variant font-medium group-hover:text-primary">Hospital Spotlights</span>
                  <span className="bg-surface-container-high px-2 py-0.5 rounded text-xs font-bold text-on-surface-variant">12</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Grid */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Latest Perspectives</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : gridPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {gridPosts.slice(0, visibleCount).map((post) => (
                <article key={post.id} className="relative flex flex-col h-full bg-surface-container-lowest rounded-xl overflow-hidden group shadow-sm hover:shadow-xl border border-outline-variant/10 transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                       alt={post.title} 
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                       src={post.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000"} 
                    />
                    <div className="absolute top-4 left-4 z-20">
                      {post.category && (
                        <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-on-surface-variant text-xs font-medium mb-3">Published • 5 min read</div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                    <p className="text-on-surface-variant text-sm line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-xs mt-auto opacity-70 mb-3">
                       <span>By {post.author}</span>
                    </div>
                    <Link href={`/blog/${post.slug || post.id}`} className="inline-flex items-center text-primary font-bold text-sm group/link before:absolute before:inset-0 before:z-10">
                      Read More 
                      <span className="material-symbols-outlined ml-1 text-lg transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button instead of Pagination */}
            {visibleCount < gridPosts.length && (
              <div className="flex justify-center pt-8">
                <button 
                  onClick={handleLoadMore}
                  className="bg-surface-container-high hover:bg-surface-dim text-on-surface px-8 py-3 rounded-full font-bold transition-all border border-outline-variant/30 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  Voir Plus (Load Older Posts)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
             <p className="text-on-surface-variant">No latest perspectives available at the moment.</p>
          </div>
        )}
      </section>
    </main>
  );
}
