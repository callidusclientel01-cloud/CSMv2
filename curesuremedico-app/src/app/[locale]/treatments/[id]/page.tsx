import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { getLocalizedField } from "@/utils/i18nHelper";
import { getValidIcon } from "@/utils/iconMapper";
import { Metadata, ResolvingMetadata } from "next";

interface Procedure {
  name: string;
  description: string;
  price: string;
  icon: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CostComparison {
  destination: string;
  flag: string;
  cost: string;
  quality: string;
  wait_time: string;
  highlight?: boolean;
  strikethrough?: boolean;
}

interface FeaturedDoctor {
  name: string;
  specialty: string;
  experience: string;
  languages: string[];
  image: string;
}

interface Hospital {
  id: number;
  name: string;
  slug: string;
  city: string;
  country: string;
  image_url: string;
  accreditations: string[] | string;
  specialties?: string | string[];
}

interface Treatment {
  id: string;
  slug?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  icon_name: string;
  short_description: string;
  short_description_fr?: string;
  short_description_ar?: string;
  starting_price: string;
  hero_image_url: string;
  overview_title: string;
  overview_title_fr?: string;
  overview_title_ar?: string;
  overview_description: string;
  overview_description_fr?: string;
  overview_description_ar?: string;
  success_rate: string;
  quick_response_time: string;
  cost_saving: string;
  procedures: Procedure[];
  procedures_fr?: Procedure[];
  procedures_ar?: Procedure[];
  faqs?: FAQ[];
  faqs_fr?: FAQ[];
  faqs_ar?: FAQ[];
  cost_comparison?: CostComparison[];
  featured_doctors?: FeaturedDoctor[];
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

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getTreatment(id: string, isPreview: boolean): Promise<Treatment | null> {
  let query = supabase.from("treatments").select("*").eq("slug", id);
  if (!isPreview) {
    query = query.eq('status', 'published');
  }
  const { data } = await query.maybeSingle();

  if (data) {
    const parsedData = { ...data };
    if (typeof parsedData.procedures === 'string') {
        try { parsedData.procedures = JSON.parse(parsedData.procedures) } catch(e){}
    }
    if (typeof parsedData.procedures_fr === 'string') {
        try { parsedData.procedures_fr = JSON.parse(parsedData.procedures_fr) } catch(e){}
    }
    if (typeof parsedData.procedures_ar === 'string') {
        try { parsedData.procedures_ar = JSON.parse(parsedData.procedures_ar) } catch(e){}
    }
    if (typeof parsedData.faqs === 'string') {
        try { parsedData.faqs = JSON.parse(parsedData.faqs) } catch(e){}
    }
    if (typeof parsedData.faqs_fr === 'string') {
        try { parsedData.faqs_fr = JSON.parse(parsedData.faqs_fr) } catch(e){}
    }
    if (typeof parsedData.faqs_ar === 'string') {
        try { parsedData.faqs_ar = JSON.parse(parsedData.faqs_ar) } catch(e){}
    }
    if (typeof parsedData.cost_comparison === 'string') {
        try { parsedData.cost_comparison = JSON.parse(parsedData.cost_comparison) } catch(e){}
    }
    if (typeof parsedData.featured_doctors === 'string') {
        try { parsedData.featured_doctors = JSON.parse(parsedData.featured_doctors) } catch(e){}
    }
    return parsedData;
  }
  return fallbackTreatment;
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isPreview = searchParams.preview === 'true';
  const treatment = await getTreatment(params.id, isPreview);

  if (!treatment) {
    return { title: 'Treatment Not Found | CureSureMedico' };
  }

  const name = getLocalizedField(treatment, 'name', params.locale);
  const title = `Advanced ${name} Treatment in India | Cost & Top Hospitals | CureSureMedico`;
  const description = getLocalizedField(treatment, 'short_description', params.locale) || `World-class ${name} at JCI-accredited centers in India. Save up to 80% on medical costs with CureSureMedico. Get a free consultation today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [treatment.hero_image_url || 'https://www.curesuremedico.com/hero-bg.png'],
    },
    alternates: {
      canonical: `https://www.curesuremedico.com/${params.locale}/treatments/${params.id}`,
    }
  };
}

export default async function TreatmentDetailsPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params.locale;
  const treatmentId = params.id;
  const isPreview = searchParams.preview === 'true';

  const treatment = await getTreatment(treatmentId, isPreview);

  if (!treatment) {
    return (
      <main className="pt-36 px-8 text-center space-y-4 min-h-screen">
        <p className="text-on-surface-variant">Specialty not found.</p>
        <Link href={`/${locale}/treatments`} className="text-primary font-bold hover:underline">
          Back to treatments
        </Link>
      </main>
    );
  }

  const activeProcedures = () => {
    if (locale === 'fr' && treatment.procedures_fr && treatment.procedures_fr.length > 0) return treatment.procedures_fr;
    if (locale === 'ar' && treatment.procedures_ar && treatment.procedures_ar.length > 0) return treatment.procedures_ar;
    return treatment.procedures;
  };
  const proceduresToRender = activeProcedures() || [];

  const activeFaqs = () => {
    if (locale === 'fr' && treatment.faqs_fr && treatment.faqs_fr.length > 0) return treatment.faqs_fr;
    if (locale === 'ar' && treatment.faqs_ar && treatment.faqs_ar.length > 0) return treatment.faqs_ar;
    return treatment.faqs;
  };
  const faqsToRender = activeFaqs() || [];

  const name = getLocalizedField(treatment, 'name', locale);

  // Fetch Hospitals related to this treatment
  let featuredHospitals: Hospital[] = [];
  const { data: hospitalsData } = await supabase.from('hospitals').select('id, name, slug, city, country, image_url, accreditations, specialties');
  if (hospitalsData) {
    featuredHospitals = hospitalsData.filter(h => {
      // Basic check if hospital specialties string/array contains the treatment name
      return JSON.stringify(h.specialties || '').toLowerCase().includes(treatment.name.toLowerCase());
    }).slice(0, 3);
  }

  // JSON-LD Schemas
  const medicalProcedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": name,
    "description": getLocalizedField(treatment, 'short_description', locale),
    "image": treatment.hero_image_url || "https://www.curesuremedico.com/hero-bg.png",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "CureSureMedico",
      "url": "https://www.curesuremedico.com"
    }
  };

  const faqJsonLd = faqsToRender.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsToRender.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const hospitalJsonLd = featuredHospitals.map(h => ({
    "@context": "https://schema.org",
    "@type": "Hospital",
    "name": h.name,
    "image": h.image_url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": h.city,
      "addressCountry": h.country
    }
  }));

  const physicianJsonLd = (treatment.featured_doctors || []).map(doc => ({
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": doc.name,
    "medicalSpecialty": doc.specialty,
    "image": doc.image
  }));

  return (
    <main className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Inject SEO JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedureJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      {hospitalJsonLd.map((h, i) => (
        <script key={`h-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(h) }} />
      ))}
      {physicianJsonLd.map((d, i) => (
        <script key={`d-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[800px] flex items-center overflow-hidden pt-36 pb-16">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover object-center" 
            alt={treatment.name} 
            src={treatment.hero_image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCeea0EfBbDmganpqH8RHuVbEVZusOsGw9NN5St2B3x39fLu396UapPEs5FK25iuqJdnkZa5LyyBtzTtF8KSfSF8VRrlLao4g8IwvLXM7bRxucbpRZjwh7Amh0aK2WatMvjhbgTqutbAOQrc1ZAz3B46k42P5X1mxjsNF0Jn4km-LbHidY2_i-o9e4fb-IskGtFNQnWuOY0ywyizDicgAFQHj27DJfg4nxl2dwjgFyjf1ijkMeb4FYjIpn6zL_nGNAYRjgW2KU9qLQ"} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-4xl space-y-6 md:space-y-8">
            {/* Back link */}
            <div className="mb-4 md:mb-8">
              <Link href={`/${locale}/treatments`} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-on-surface font-bold hover:bg-white/30 transition-colors shadow-sm border border-outline-variant/20">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to treatments
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs md:text-sm font-semibold tracking-wide uppercase">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                {getValidIcon(treatment.icon_name)}
              </span>
              Excellence in {name} Care
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tighter text-primary leading-[1.1]">
              Advanced {name}
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">
              {getLocalizedField(treatment, 'overview_title', locale) || "Specialized Surgery & Global Care"}
            </h2>
            <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              {getLocalizedField(treatment, 'short_description', locale) || "Access world-class specialists and JCI-accredited centers with significant cost savings. Comprehensive care from diagnosis to recovery."}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-4">
              <div className="flex items-center gap-2 text-secondary font-semibold text-sm sm:text-base">
                <span className="material-symbols-outlined">verified</span>
                JCI & NABH Accredited
              </div>
              <div className="flex items-center gap-2 text-secondary font-semibold text-sm sm:text-base">
                <span className="material-symbols-outlined">payments</span>
                Transparent Pricing in USD
              </div>
              <Link href={`/${locale}/quote`} className="w-full sm:w-auto text-center bg-[#005da7] text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 active:scale-95 duration-200 transition-all shadow-lg mt-2 sm:mt-0">
                Get Your Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & E-E-A-T Banner */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10 py-6">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">health_and_safety</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-bold uppercase">Medically Reviewed</p>
              <p className="text-sm font-semibold">CureSureMedico Medical Board</p>
            </div>
          </div>
          <div className="flex items-center gap-6 opacity-60 grayscale flex-wrap">
             <div className="text-sm font-bold border-l-2 border-primary pl-2">JCI Approved Facilities</div>
             <div className="text-sm font-bold border-l-2 border-primary pl-2">NABH Certified</div>
             <div className="text-sm font-bold border-l-2 border-primary pl-2">ISO 9001:2015</div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Global Excellence in Destination {name}</h2>
              <div className="text-lg text-on-surface-variant leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: getLocalizedField(treatment, 'overview_description', locale) || fallbackTreatment.overview_description }} />
              
              <div className="grid grid-cols-3 gap-2 md:gap-8 pt-4">
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-primary">{treatment.success_rate || "15k+"}</div>
                  <div className="text-xs md:text-sm text-on-surface-variant">Successful Surgeries</div>
                </div>
                <div className="text-center border-x border-outline-variant/30 px-2 md:px-8">
                  <div className="text-xl md:text-3xl font-bold text-primary">{treatment.quick_response_time || "24h"}</div>
                  <div className="text-xs md:text-sm text-on-surface-variant">Quick Response</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-primary">{treatment.cost_saving || "80%"}</div>
                  <div className="text-xs md:text-sm text-on-surface-variant">Cost Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Estimation Table (SEO Focused) */}
      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-on-surface mb-4">Cost Comparison: {name} in India vs Global</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">See why thousands of patients travel from Africa and the West to receive premium medical care at a fraction of the cost.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-primary text-on-primary">
                  <th className="py-5 px-6 font-bold border-b border-primary-container">Destination</th>
                  <th className="py-5 px-6 font-bold border-b border-primary-container">Estimated Cost (USD)</th>
                  <th className="py-5 px-6 font-bold border-b border-primary-container">Hospital Quality</th>
                  <th className="py-5 px-6 font-bold border-b border-primary-container">Wait Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {treatment.cost_comparison && treatment.cost_comparison.length > 0 ? (
                  treatment.cost_comparison.map((cost, idx) => (
                    <tr key={idx} className={`hover:bg-surface-container-high/50 transition-colors ${cost.strikethrough ? 'opacity-70' : ''}`}>
                      <td className="py-5 px-6 font-semibold flex items-center gap-2">
                        <span className="text-2xl">{cost.flag}</span> {cost.destination}
                      </td>
                      <td className={`py-5 px-6 ${cost.highlight ? 'font-bold text-primary' : 'font-medium text-on-surface-variant'} ${cost.strikethrough ? 'text-error line-through' : ''}`}>
                        {cost.cost}
                      </td>
                      <td className="py-5 px-6">{cost.quality}</td>
                      <td className={`py-5 px-6 font-medium ${cost.strikethrough ? 'text-error' : 'text-green-600'}`}>{cost.wait_time}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="py-5 px-6 font-semibold flex items-center gap-2"><span className="text-2xl">🇮🇳</span> India (CureSureMedico)</td>
                      <td className="py-5 px-6 font-bold text-primary">$3,500 - $6,500</td>
                      <td className="py-5 px-6">JCI / NABH Accredited</td>
                      <td className="py-5 px-6 text-green-600 font-medium">Zero Wait Time</td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="py-5 px-6 font-semibold flex items-center gap-2"><span className="text-2xl">🇹🇷</span> Turkey</td>
                      <td className="py-5 px-6 font-medium text-on-surface-variant">$6,000 - $9,500</td>
                      <td className="py-5 px-6">JCI Accredited</td>
                      <td className="py-5 px-6 text-green-600 font-medium">Zero Wait Time</td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/50 transition-colors opacity-70">
                      <td className="py-5 px-6 font-semibold flex items-center gap-2"><span className="text-2xl">🇺🇸</span> USA / UK</td>
                      <td className="py-5 px-6 font-medium text-error line-through">$25,000 - $45,000+</td>
                      <td className="py-5 px-6">JCI / Local</td>
                      <td className="py-5 px-6 text-error">3-6 Months</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <div className="p-4 bg-surface-container-high/30 text-xs text-on-surface-variant text-center">
              *Costs are estimates in USD and vary based on hospital choice, doctor expertise, and exact medical condition. Contact us for a personalized quote.
            </div>
          </div>
        </div>
      </section>

      {/* Key Procedures Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-4">Precision Procedures for {name}</h2>
              <p className="text-on-surface-variant max-w-xl">Advanced interventions delivered with surgical precision and compassionate care.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {proceduresToRender.length > 0 ? (
              proceduresToRender.map((proc, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-8 rounded-xl hover:shadow-xl transition-all group border border-transparent hover:border-primary/10 flex flex-col items-start shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined">{getValidIcon(proc.icon)}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-on-surface">{proc.name}</h3>
                  <p className="text-on-surface-variant mb-6 text-sm leading-relaxed flex-1">{proc.description}</p>
                  <Link href={`/${locale}/quote`} className="w-full mb-6 bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    Get a Quote <span className="material-symbols-outlined text-sm">request_quote</span>
                  </Link>
                  <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center w-full">
                    <span className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">Starting from</span>
                    <span className="text-2xl font-black text-secondary">{proc.price}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                <p className="text-on-surface-variant">No specific procedures listed for this specialty yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Hospitals & Doctors (SEO internal linking) */}
      <section className="py-16 md:py-24 bg-surface-container-lowest">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             {/* Hospitals */}
             <div>
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                   <span className="material-symbols-outlined">local_hospital</span> Top Hospitals for {name}
                </h3>
                <div className="space-y-4">
                  {featuredHospitals.length > 0 ? featuredHospitals.map((h, idx) => {
                    let accreditations = h.accreditations;
                    if (typeof accreditations === 'string') {
                      try { accreditations = JSON.parse(accreditations); } catch(e){}
                    }
                    const accString = Array.isArray(accreditations) ? accreditations.join(' • ') : 'JCI Accredited';
                    return (
                    <div key={idx} className="flex gap-4 p-4 border border-outline-variant/20 rounded-xl hover:border-primary/40 transition-colors bg-surface">
                       <div className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden shrink-0">
                         <img src={h.image_url || `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=200&q=80`} alt={h.name} className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <h4 className="font-bold text-on-surface">{h.name}</h4>
                         <p className="text-xs text-on-surface-variant mb-2">{h.city}, {h.country} • {accString}</p>
                         <Link href={`/${locale}/hospitals/${h.slug}`} className="text-sm text-secondary font-bold hover:underline">View Hospital Profile</Link>
                       </div>
                    </div>
                  )}) : (
                    <p className="text-sm text-on-surface-variant p-4 border border-outline-variant/20 rounded-xl">No specific hospitals listed for this specialty yet.</p>
                  )}
                </div>
             </div>

             {/* Doctors */}
             <div>
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                   <span className="material-symbols-outlined">stethoscope</span> Leading Specialists
                </h3>
                <div className="space-y-4">
                  {treatment.featured_doctors && treatment.featured_doctors.length > 0 ? treatment.featured_doctors.map((doc, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border border-outline-variant/20 rounded-xl hover:border-primary/40 transition-colors bg-surface">
                       <div className="w-20 h-20 bg-surface-container rounded-full overflow-hidden shrink-0">
                         <img src={doc.image || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80`} alt={doc.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 flex flex-col justify-center">
                         <h4 className="font-bold text-on-surface">{doc.name}</h4>
                         <p className="text-xs text-on-surface-variant mb-2">{doc.specialty} • {doc.experience}</p>
                         {doc.languages && doc.languages.length > 0 && (
                           <span className="text-xs font-semibold bg-primary/10 text-primary w-fit px-2 py-1 rounded">{doc.languages.join(', ')}</span>
                         )}
                       </div>
                    </div>
                  )) : (
                    <p className="text-sm text-on-surface-variant p-4 border border-outline-variant/20 rounded-xl">No specific specialists listed yet.</p>
                  )}
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {faqsToRender.length > 0 && (
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-screen-md mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-4">Frequently Asked Questions</h2>
              <p className="text-on-surface-variant">Common questions about {name} treatments in India.</p>
            </div>
            <div className="space-y-4">
              {faqsToRender.map((faq, idx) => (
                <details key={idx} className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg select-none">
                    {faq.question}
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:-rotate-180 text-primary">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Patient Testimonials - African Market Focus */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 text-center">
           <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">Success Stories from Our Patients</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                 <div className="flex text-yellow-400 mb-4 text-xl">★★★★★</div>
                 <p className="italic text-lg mb-6 leading-relaxed">"The level of care I received for my {name.toLowerCase()} procedure in India was outstanding. CureSureMedico arranged my medical visa from Abidjan and coordinated everything flawlessly."</p>
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">A</div>
                   <div>
                     <p className="font-bold">Amina D.</p>
                     <p className="text-xs opacity-80">Abidjan, Côte d'Ivoire</p>
                   </div>
                 </div>
              </div>
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                 <div className="flex text-yellow-400 mb-4 text-xl">★★★★★</div>
                 <p className="italic text-lg mb-6 leading-relaxed">"We saved over 70% compared to quotes we got in Europe. The hospital facilities were world-class and the doctors were extremely knowledgeable and caring."</p>
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">O</div>
                   <div>
                     <p className="font-bold">Oluwaseun M.</p>
                     <p className="text-xs opacity-80">Lagos, Nigeria</p>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
