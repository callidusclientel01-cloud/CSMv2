"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

interface Hospital {
  id: string;
  name: string;
  city: string;
  country: string;
  image_url: string;
  accreditations: string[];
  features: string[];
  doctor_count: string;
}

interface WhyChooseUs {
  title: string;
  description: string;
  icon: string;
}

interface Destination {
  id: string;
  country_name: string;
  tagline: string;
  description: string;
  image_url: string;
  key_specialists: string[];
  why_choose_us: WhyChooseUs[];
  success_rate_text: string;
}

const fallbackDestination: Destination = {
  id: "1",
  country_name: "India",
  tagline: "World-Class Destination",
  description: "Advanced clinical care meeting compassionate hospitality. Discover why thousands of patients trust India for complex medical journeys.",
  image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIlAlvUilvA1fRCjrHLxGOqtmamNiXSsSwa3ZQgIcaJ3oezsOccuwGahCbApDQglpr5TG9DARSmSbUiWpXhF0-yWthZv4Z9pbiwWtv74jW3reAfLj_J1yUM5p9A0S4BAd6qWytido1GTy1fZb2C5hXW79dwFQolBpD1wzU_xozZoXSJyiyfeh-Hxp2bvcyDsjbM1FvTg7OCcEHEgUwO6JJcEQeB4g6vCGU9UZfb8xYZHVImC6uN0MkrfepqCDhUEM1A46acjRq5tw",
  key_specialists: ["Cardiac Care", "Orthopedics", "Oncology", "Fertility & IVF"],
  success_rate_text: "98% Success Rate",
  why_choose_us: [
    { title: "JCI Accredited Facilities", description: "Access over 35 JCI-accredited hospitals offering Western-standard medical protocols and sterilization.", icon: "verified_user" },
    { title: "Affordable Precision", description: "Save 60-80% compared to US or UK healthcare costs without compromising on technology or outcomes.", icon: "payments" },
    { title: "Expert Specialists", description: "Consult with world-renowned surgeons, many of whom are trained and board-certified in Europe or the US.", icon: "clinical_notes" }
  ]
};

export default function DestinationDetailsPage() {
  const params = useParams<{ id: string }>();
  const destinationId = params?.id;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!destinationId) return;
      try {
        // Fetch Destination
        const { data: destData } = await supabase
          .from("destinations")
          .select("*")
          .eq("slug", destinationId)
          .maybeSingle();

        let finalDest = fallbackDestination;
        if (destData) {
          const parsedData = { ...destData };
          if (typeof parsedData.key_specialists === 'string') {
             try { parsedData.key_specialists = JSON.parse(parsedData.key_specialists) } catch(e){}
          }
          if (typeof parsedData.why_choose_us === 'string') {
             try { parsedData.why_choose_us = JSON.parse(parsedData.why_choose_us) } catch(e){}
          }
          finalDest = parsedData;
        }
        
        setDestination(finalDest);

        // Fetch Hospitals in this country
        if (finalDest && finalDest.country_name) {
          const { data: hospData } = await supabase
            .from("hospitals")
            .select("*")
            .eq("country", finalDest.country_name);
            
          if (hospData && hospData.length > 0) {
             const parsedHospitals = hospData.map(h => {
               const parsed = { ...h };
               if (typeof parsed.accreditations === 'string') {
                 try { parsed.accreditations = JSON.parse(parsed.accreditations); } catch(e) {}
               }
               if (typeof parsed.features === 'string') {
                 try { parsed.features = JSON.parse(parsed.features); } catch(e) {}
               }
               return parsed;
             });
             setHospitals(parsedHospitals);
          } else {
             // Fallback hospitals matched with this country to replicate the /hospitals page behavior
             const fallbackHospitals = [
                {
                  id: "1",
                  slug: "apollo-health-city",
                  name: "Apollo Health City",
                  city: "Hyderabad, Telangana",
                  country: "India",
                  rating: 4.9,
                  reviews_count: 1200,
                  accreditations: ["JCI", "NABH"],
                  specialties: ["Cardiology", "Organ Transplant", "Robotic Surgery"],
                  description: "",
                  image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhS8wv2mp2q20ScsT9B3h8Re5YosDUpM2tIXUrV7uL7Qbdf2YW3WasMawumIuMYycUQPQsaiO5b-ZD538kBkzzCSuWFcWMNcDlm6TAwxQGrqP0eaCpqfMHpDmxB9P2UxFEe-qrgGzJ5Mgvr904FTF0fGx2V05a2olQp-eYWuOTcwvx6UfYx98rjF8cUPQ7akx58ZTpz0xG3VNGnxCHUrhgs2Taodvb_ESb_TkkZt1Jc-beZ_0fPMc5d3oz41wMS6H_XNp1KGmb8_c",
                  logo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM1TwXGSRsaOT7-_SAM7r6uu7aEA3l4PDMUoXtyNY_61OOoE48eXkBpOKHyNdxCFxQeyJtd1mhAA-INJXhtTfOGGzOG3b_HtuLB4KBZUoWHfulGdEe-opj7al0e_-mdIR54gF8hKAUkTD6uSiYMhRoagXZIYn796GNPZZUalhA0qI0JA1DKCr556_m5XJjNdpfQ7seLKOb8Ze5afcuCsxMgI4XKbCLIKfckZPh68zvXOyLeTunOenTkhjoXG3UcpvFXCuQlC987_8",
                  features: ["International Patient Wing", "24/7 Virtual Support"],
                  doctor_count: "200+ Specialists"
                },
                {
                  id: "2",
                  slug: "fortis-memorial-research-institute",
                  name: "Fortis Memorial Research Institute",
                  city: "Gurgaon, Delhi NCR",
                  country: "India",
                  rating: 4.8,
                  reviews_count: 850,
                  accreditations: ["JCI", "NABH"],
                  specialties: ["Oncology", "Neuroscience", "Orthopedics"],
                  description: "",
                  image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRP9T0WEEMHFoN1jKmyvG2UI3BP0FZWA4B9ApTAFt7UzOU4wKMawG8LyTvngvRciqTFwluL6DnYBPBiDTs4CCyQbn3xp8N_5Lizbzuq2OeSOvJp0PQS4V8LMk3uTA_e0pqyvgxH9l4QRQCtGNDAMKPhcSE8I-x82kz8H6bsYsENk9B66lruJq2N3vT0uDwGYNBosV5ZDVTbp2kQ_32vvBpUXe5hYvK1FYgh812dY6055Kt5JNmVd6rOKdTmaJzxj_jo8rELV9Jlmk",
                  logo_url: "",
                  features: ["Advanced Robotic Center", "Concierge Travel Desk"],
                  doctor_count: "150+ Specialists"
                },
                {
                  id: "3",
                  slug: "medanta-the-medicity",
                  name: "Medanta - The Medicity",
                  city: "Gurugram, Haryana",
                  country: "India",
                  rating: 4.7,
                  reviews_count: 920,
                  accreditations: ["NABH"],
                  specialties: ["Cardiology", "Transplants", "Gastroenterology"],
                  description: "",
                  image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFWOdU9YR-5Qy2OQgu66Tfkz9PKOKFDsh0b5i0KPjAx0HDYQBEP0285Va_aYwjVVtMbTYwkMZjWwgLx6riRm08BU06CxVQTpKHVfonH99rydaX7JqHaZ8SXvpbb8wK0TXe1Q0h1_At_4qgTFh5Bg7GCyHW1hrdoI2vGTAD9DH1sTmt-dcfRDRLBSwIobc1XaomevEgp9enDT331oe8JZJg_FwT6iDMO3dzUq4G3Ldoqq0hljZAMcvjVDp1KIZ-xBzJ9HZ5LX1yQ7I",
                  logo_url: "",
                  features: ["Integrated Wellness Suites", "Multilingual Translation Support"],
                  doctor_count: "300+ Specialists"
                }
             ];
             
             setHospitals(fallbackHospitals.filter(h => h.country === finalDest?.country_name));
          }
        }
        
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [destinationId]);

  if (loading) {
    return <main className="pt-36 px-8 text-center min-h-screen">Loading destination...</main>;
  }

  if (!destination) {
    return (
      <main className="pt-36 px-8 text-center space-y-4 min-h-screen">
        <p className="text-on-surface-variant">Destination not found.</p>
        <Link href="/destinations" className="text-primary font-bold hover:underline">
          Back to destinations
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-surface text-on-surface">
      {/* Back link */}
      <div className="absolute z-20 top-24 left-8">
        <Link href="/destinations" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold hover:bg-white/30 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to destinations
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[716px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt={destination.country_name} 
            src={destination.image_url || fallbackDestination.image_url} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl mt-12">
            <span className="inline-block py-1 px-4 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest mb-6">
              {destination.tagline || 'World-Class Destination'}
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-[1.1]">
              Medical Excellence in {destination.country_name}
            </h1>
            <p className="text-xl text-white/90 font-medium max-w-lg leading-relaxed">
              {destination.description || fallbackDestination.description}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/quote" className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-50 transition-all inline-block text-center">
                Book Consultation
              </Link>
              <Link href="/treatments" className="text-white border border-white/40 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all inline-block text-center">
                Explore Treatments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Hospitals Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-12">Top Partner Hospitals</h2>
          
          {hospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hospitals.map(hosp => (
                <div key={hosp.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-outline-variant/10 flex flex-col">
                  <div className="h-56 relative overflow-hidden">
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={hosp.name} src={hosp.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000'} />
                    {hosp.accreditations?.includes('JCI') && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                        JCI ACCREDITED
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{hosp.name}</h3>
                    <p className="text-sm text-on-surface-variant mb-6">{hosp.city}, {hosp.country}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex -space-x-2">
                         <div className="w-8 h-8 rounded-full border-2 border-white bg-primary/20 overflow-hidden flex items-center justify-center text-primary text-xs">Dr.</div>
                         <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary/20 overflow-hidden flex items-center justify-center text-secondary text-xs">Dr.</div>
                      </div>
                      <span className="text-xs font-medium text-on-surface-variant">{hosp.doctor_count || '150+ Specialists'}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {hosp.features ? hosp.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                          {feature}
                        </li>
                      )) : (
                        <>
                          <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-secondary text-lg">check_circle</span> International Patient Wing
                          </li>
                          <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                             <span className="material-symbols-outlined text-secondary text-lg">check_circle</span> 24/7 Virtual Support
                          </li>
                        </>
                      )}
                    </ul>
                    <Link href={`/hospitals/${hosp.slug || hosp.id}`} className="mt-auto w-full py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors text-center inline-block">
                      Request Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-outline-variant/30 rounded-xl">
               <p className="text-on-surface-variant text-lg">No designated hospitals found for this region yet.</p>
               <Link href="/hospitals" className="mt-4 inline-block text-primary font-bold hover:underline">View all hospitals</Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-8">Why Choose {destination.country_name} for Care?</h2>
              <div className="space-y-10">
                {destination.why_choose_us && destination.why_choose_us.length > 0 ? (
                  destination.why_choose_us.map((reason, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-primary/10 text-primary' : (idx === 1 ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary')}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{reason.icon || 'verified'}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{reason.title}</h3>
                        <p className="text-on-surface-variant leading-relaxed">{reason.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant">Top-tier destination for specialized medical care.</p>
                )}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-xl overflow-hidden shadow-sm">
                  <img className="w-full h-full object-cover" alt="Doctor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcSniQ4_L1U7wb7vF9vVObtiT_JE88WZJpvbvd8nO_BbTNwuh0YTFhp1fUQ933ggGiDVErh6J0xXNRxagoJtJg1qxS6RpLP3P8NkOG0V2gDkCOgwv4ETwpvsVY14l-QbWAIBJFrd_rYXZWUR5EnLNZfj0bE3K9jTLb-_qPMW9YVXmluADS7GncYMPjX2NKH50BR9Sj0rEChHYjEfXB8t5tCDWbdYNFq69CBv39uuXbxzbfHqgHUsKvEGr7IqqiSmvu0BHmnLkhtfU" />
                </div>
                <div className="h-80 rounded-xl overflow-hidden shadow-sm bg-primary p-8 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold text-white mb-2">{destination.success_rate_text || "High Success Rates"}</h4>
                  <p className="text-white/80 text-sm">Across complex procedures performed every year.</p>
                </div>
              </div>
              <div className="pt-12 space-y-4">
                <div className="h-80 rounded-xl overflow-hidden shadow-sm">
                  <img className="w-full h-full object-cover" alt="Facility" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAv3mv-eSDYTnEgsyG8GBdlRIB93tVpLb_15KAR91bZR78alVBsDut5Js_fBD2o7_Rr4MgN3wZFtZr_K2pGJOj5TODDzDE2hajO_MDDlv-mhXYYdubLx7xdEpFuM8_SuoXsRZoPVOYLfQDbVLHW05BMziFYpPKpvxbQ4W3hV5Fdi4Fm7moXXdAJmzJZHXZajURRbzedH9EzaW_DY79ihJ1acDyfZatmJm_vLasTTvgtP13cLi6hfPbCbreWcCf9LBkyAwrVnobKrU" />
                </div>
                <div className="h-64 rounded-xl overflow-hidden shadow-sm">
                  <img className="w-full h-full object-cover" alt="Recovery Room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlUGsU9VWGR0i76TfLE2s5f0BGlPk8mO50lm-Qajw20HjT8qI_4iKQwAIjV51RPk0KuNgHlECv7E59ayhur5h1Fk7z9yvtnjce8qk4iprFWyCrKua8GA2y-ArH44NNndCkeHsQayIVeNVOmcHLe71NNyrblX_59jAzmbXL3cxlL5aXcdJ6C8rDTN9gGvAvyVm4lX4PuiISNg8FTmj_aF-d7Dp4WUy_Jd7oD0Rq1ja2Y8Uh3mG3Cm7eDV2CZ9whG6t_EGwcj95QbDc" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Treatments */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-on-surface">Popular Treatments</h2>
              <p className="text-on-surface-variant mt-2">Specialized procedures with the highest clinical outcomes.</p>
            </div>
            <Link href="/treatments" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 group relative h-80 rounded-xl overflow-hidden bg-white shadow-sm border border-transparent hover:border-primary/20 transition-all">
              <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Specialty" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrEQAWNYoekTul1I7-NqfTMoES82VCnDNUA2MSvxqKVSoKc0G8ATmk3KEFspPum1_syOAJYfZvLzMlrLY7BV3uYi9Bwam7P6qSAZI9hEAdpQTdt-yjuEZiiGKmixn7hBfNcFDTFfmSqjFnjyaO7lYQ7jS9bELBuu5f2Y-xBazckPC-wX__uQPCmNjxbIOuBJOTJqE97KcY7uit_0f-6DIni4MsuFdCNi_Onb3piEBIHIHN4-zZtbscZKJ7jxwOOOLTaq5qdcLNl0o" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">{destination.key_specialists?.[0] || "Cardiac Care"}</h3>
                <p className="text-white/80 max-w-md">Advanced surgeries and precision procedures tailored for complex conditions.</p>
              </div>
            </div>
            
            <div className="group relative h-80 rounded-xl overflow-hidden bg-white shadow-sm">
              <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Specialty" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUvT_4p18e_boJNic5f0Yr0xsqDa8LTBoyzkLjRVDkSXtZ49xBQ_JIQuNMZ12EdgWLkXKBqU35NWLIbeiJEP2Kv43K3EpQM_g1ZGO6aUmHO39Fic9AOgITg3xu8FNk__ZTNUcHLxasUQsVpwbekBH9npth2DCxpnluPxOd-F8ApEZtaB-3AlcY52Yc5WW6ruIS5jFsGezBfiXai7OD4wSllip6wWvGAbqyd2ubsm6ve3KK1vWNpM1FoxKok2NYgvW4YyyVyK3pPeE" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">{destination.key_specialists?.[1] || "Orthopedics"}</h3>
                <p className="text-white/80">Expert replacements using world-class implants.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
