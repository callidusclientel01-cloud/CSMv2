"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

interface Procedure {
  name: string;
  description: string;
  price: string;
  icon: string;
}

interface Treatment {
  id: string;
  slug?: string;
  name: string;
  icon_name: string;
  short_description: string;
  starting_price: string;
  hero_image_url: string;
  overview_title: string;
  overview_description: string;
  success_rate: string;
  quick_response_time: string;
  cost_saving: string;
  procedures: Procedure[];
}

const fallbackTreatment: Treatment = {
  id: "1",
  name: "Cardiology",
  icon_name: "favorite",
  short_description: "Heart valve replacement, Bypass surgery...",
  starting_price: "Ask for quote",
  hero_image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeea0EfBbDmganpqH8RHuVbEVZusOsGw9NN5St2B3x39fLu396UapPEs5FK25iuqJdnkZa5LyyBtzTtF8KSfSF8VRrlLao4g8IwvLXM7bRxucbpRZjwh7Amh0aK2WatMvjhbgTqutbAOQrc1ZAz3B46k42P5X1mxjsNF0Jn4km-LbHidY2_i-o9e4fb-IskGtFNQnWuOY0ywyizDicgAFQHj27DJfg4nxl2dwjgFyjf1ijkMeb4FYjIpn6zL_nGNAYRjgW2KU9qLQ",
  overview_title: "Specialized Heart Surgery & Global Care",
  overview_description: "CureSureMedico connects patients with world-renowned cardiology hubs in India and Turkey. Our partner hospitals consistently report success rates above 98% for complex bypass and valve surgeries.",
  success_rate: "15k+",
  quick_response_time: "24h",
  cost_saving: "80%",
  procedures: [
    {
      name: "Coronary Artery Bypass (CABG)",
      description: "Advanced open-heart or minimally invasive surgery to improve blood flow to the heart muscle.",
      price: "$5,500",
      icon: "monitor_heart"
    },
    {
      name: "Valve Replacement",
      description: "Replacement of diseased heart valves with high-grade biological or mechanical prosthetics.",
      price: "$7,200",
      icon: "settings_heart"
    },
    {
      name: "Angioplasty",
      description: "Minimally invasive procedure to open narrowed arteries using stents and balloons.",
      price: "$3,800",
      icon: "healing"
    }
  ]
};

export default function TreatmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const treatmentId = params?.id;
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTreatment() {
      if (!treatmentId) return;
      try {
        const isAdmin = typeof window !== 'undefined' ? localStorage.getItem("csm_admin_auth") !== null : false;
        let query = supabase.from("treatments").select("*").eq("slug", treatmentId);
        
        if (!(isPreview && isAdmin)) {
          query = query.eq('status', 'published');
        }

        const { data } = await query.maybeSingle();

        if (data) {
          // ensure JSONB procedures is parsed if needed
          const parsedData = { ...data };
          if (typeof parsedData.procedures === 'string') {
             try { parsedData.procedures = JSON.parse(parsedData.procedures) } catch(e){}
          }
          setTreatment(parsedData);
          return;
        }
        setTreatment(fallbackTreatment);
      } finally {
        setLoading(false);
      }
    }

    loadTreatment();
  }, [treatmentId, isPreview]);

  if (loading) {
    return <main className="pt-36 px-8 text-center min-h-screen">Loading specialty...</main>;
  }

  if (!treatment) {
    return (
      <main className="pt-36 px-8 text-center space-y-4 min-h-screen">
        <p className="text-on-surface-variant">Specialty not found.</p>
        <Link href="/treatments" className="text-primary font-bold hover:underline">
          Back to treatments
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Back link */}
      <div className="absolute z-20 top-24 left-8">
        <Link href="/treatments" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold hover:bg-white/30 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to treatments
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover object-center" 
            alt={treatment.name} 
            src={treatment.hero_image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCeea0EfBbDmganpqH8RHuVbEVZusOsGw9NN5St2B3x39fLu396UapPEs5FK25iuqJdnkZa5LyyBtzTtF8KSfSF8VRrlLao4g8IwvLXM7bRxucbpRZjwh7Amh0aK2WatMvjhbgTqutbAOQrc1ZAz3B46k42P5X1mxjsNF0Jn4km-LbHidY2_i-o9e4fb-IskGtFNQnWuOY0ywyizDicgAFQHj27DJfg4nxl2dwjgFyjf1ijkMeb4FYjIpn6zL_nGNAYRjgW2KU9qLQ"} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-sm font-semibold tracking-wide uppercase">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                {treatment.icon_name || 'medical_services'}
              </span>
              Excellence in {treatment.name} Care
            </div>
            <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tighter text-primary leading-[1.1]">
              Advanced {treatment.name}
            </h1>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">
              {treatment.overview_title || "Specialized Surgery & Global Care"}
            </h2>
            <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              {treatment.short_description || "Access world-class specialists and JCI-accredited centers with significant cost savings. Comprehensive care from diagnosis to recovery."}
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <span className="material-symbols-outlined">verified</span>
                JCI Accredited Centers
              </div>
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <span className="material-symbols-outlined">payments</span>
                Transparent Pricing
              </div>
              <Link href="/quote" className="bg-[#005da7] text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 active:scale-95 duration-200 transition-all shadow-lg">
                Get Your Treatment Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-tertiary/10 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500"></div>
              <img 
                className="relative rounded-xl shadow-lg w-full h-[400px] object-cover" 
                alt="Medical Atrium" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI4VmFnzcTPMVQ4xBRIoAI51QVIJ3CkBQYcorl4x7x9fwh-DkcjyV-0SDia_udOSl_yV5wx5W2p9YYFKLMCGh2vu9aDQ-ZlGXfEq7JZqq5FJN1VAoWQ3ovAb-yoHkesCCTSI1QXK1GH_dd4gZRULDmLmQe1_iDsDe4W0tFlGCumwQlai-qsnP0HTBMpNG2AezeffZj5N-EitVgj6DNScy5kSxVpypyy3Sj96lLo6p3Nzd3kRQ2tZvt5wZugCB_OclkciWzJu_FVH4" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight text-on-surface">Global Excellence in Destination {treatment.name}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                {treatment.overview_description || fallbackTreatment.overview_description}
              </p>
              
              <div className="flex gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{treatment.success_rate || "15k+"}</div>
                  <div className="text-sm text-on-surface-variant">Successful Surgeries</div>
                </div>
                <div className="text-center border-x border-outline-variant/30 px-8">
                  <div className="text-3xl font-bold text-primary">{treatment.quick_response_time || "24h"}</div>
                  <div className="text-sm text-on-surface-variant">Quick Response</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{treatment.cost_saving || "80%"}</div>
                  <div className="text-sm text-on-surface-variant">Cost Saving</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Procedures Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-4">Precision Procedures</h2>
              <p className="text-on-surface-variant max-w-xl">Advanced interventions delivered with surgical precision and compassionate care.</p>
            </div>
            <Link href="/treatments" className="text-primary font-bold flex items-center gap-2 group">
              View All Procedures 
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {treatment.procedures && treatment.procedures.length > 0 ? (
              treatment.procedures.map((proc, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-8 rounded-xl hover:shadow-xl transition-all group border border-transparent hover:border-primary/10 flex flex-col items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined">{proc.icon || 'medical_services'}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-on-surface">{proc.name}</h3>
                  <p className="text-on-surface-variant mb-6 text-sm leading-relaxed flex-1">{proc.description}</p>
                  <Link href="/quote" className="w-full mb-6 bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    Get a Quote <span className="material-symbols-outlined text-sm">request_quote</span>
                  </Link>
                  <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center w-full">
                    <span className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">Starting from</span>
                    <span className="text-2xl font-black text-secondary">{proc.price}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center p-8 bg-white rounded-xl border border-outline-variant/20">
                <p className="text-on-surface-variant">No specific procedures listed for this specialty yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
