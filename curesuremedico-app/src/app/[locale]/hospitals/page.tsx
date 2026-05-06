"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

interface Hospital {
  id: string;
  slug?: string;
  name: string;
  city: string;
  country?: string;
  rating: number;
  reviews_count: number;
  accreditations: string[];
  specialties?: string[];
  description: string;
  image_url: string;
  logo_url: string;
}

function HospitalsList() {
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  // Filter States
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All Units");

  useEffect(() => {
    async function fetchHospitals() {
      try {
        const isAdmin = typeof window !== 'undefined' ? localStorage.getItem("csm_admin_auth") !== null : false;
        let query = supabase.from("hospitals").select("*").order("id", { ascending: true });
        
        if (!(isPreview && isAdmin)) {
          query = query.eq('status', 'published');
        }

        const { data, error } = await query;

        let fetchedData: Hospital[] = [];

        if (error) {
          console.error("Error fetching hospitals:", error);
        }
        
        if (data && data.length > 0) {
          fetchedData = data;
        } else {
          // STATIC FALLBACK
          fetchedData = [
            {
              id: "1",
              slug: "apollo",
              name: "Apollo Hospitals, Greams Road",
              city: "Chennai, Tamil Nadu",
              country: "India",
              rating: 4.9,
              reviews_count: 1200,
              accreditations: ["JCI", "NABH"],
              specialties: ["Cardiology", "Organ Transplant", "Robotic Surgery"],
              description: "",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhS8wv2mp2q20ScsT9B3h8Re5YosDUpM2tIXUrV7uL7Qbdf2YW3WasMawumIuMYycUQPQsaiO5b-ZD538kBkzzCSuWFcWMNcDlm6TAwxQGrqP0eaCpqfMHpDmxB9P2UxFEe-qrgGzJ5Mgvr904FTF0fGx2V05a2olQp-eYWuOTcwvx6UfYx98rjF8cUPQ7akx58ZTpz0xG3VNGnxCHUrhgs2Taodvb_ESb_TkkZt1Jc-beZ_0fPMc5d3oz41wMS6H_XNp1KGmb8_c",
              logo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM1TwXGSRsaOT7-_SAM7r6uu7aEA3l4PDMUoXtyNY_61OOoE48eXkBpOKHyNdxCFxQeyJtd1mhAA-INJXhtTfOGGzOG3b_HtuLB4KBZUoWHfulGdEe-opj7al0e_-mdIR54gF8hKAUkTD6uSiYMhRoagXZIYn796GNPZZUalhA0qI0JA1DKCr556_m5XJjNdpfQ7seLKOb8Ze5afcuCsxMgI4XKbCLIKfckZPh68zvXOyLeTunOenTkhjoXG3UcpvFXCuQlC987_8"
            },
            {
              id: "2",
              slug: "fortis",
              name: "Fortis Memorial Research Institute",
              city: "Gurgaon, Delhi NCR",
              country: "India",
              rating: 4.8,
              reviews_count: 850,
              accreditations: ["JCI", "NABH"],
              specialties: ["Oncology", "Neuroscience", "Orthopedics"],
              description: "",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRP9T0WEEMHFoN1jKmyvG2UI3BP0FZWA4B9ApTAFt7UzOU4wKMawG8LyTvngvRciqTFwluL6DnYBPBiDTs4CCyQbn3xp8N_5Lizbzuq2OeSOvJp0PQS4V8LMk3uTA_e0pqyvgxH9l4QRQCtGNDAMKPhcSE8I-x82kz8H6bsYsENk9B66lruJq2N3vT0uDwGYNBosV5ZDVTbp2kQ_32vvBpUXe5hYvK1FYgh812dY6055Kt5JNmVd6rOKdTmaJzxj_jo8rELV9Jlmk",
              logo_url: ""
            },
            {
              id: "3",
              slug: "medanta",
              name: "Medanta - The Medicity",
              city: "Gurugram, Haryana",
              country: "India",
              rating: 4.7,
              reviews_count: 920,
              accreditations: ["NABH"],
              specialties: ["Cardiology", "Transplants", "Gastroenterology"],
              description: "",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFWOdU9YR-5Qy2OQgu66Tfkz9PKOKFDsh0b5i0KPjAx0HDYQBEP0285Va_aYwjVVtMbTYwkMZjWwgLx6riRm08BU06CxVQTpKHVfonH99rydaX7JqHaZ8SXvpbb8wK0TXe1Q0h1_At_4qgTFh5Bg7GCyHW1hrdoI2vGTAD9DH1sTmt-dcfRDRLBSwIobc1XaomevEgp9enDT331oe8JZJg_FwT6iDMO3dzUq4G3Ldoqq0hljZAMcvjVDp1KIZ-xBzJ9HZ5LX1yQ7I",
              logo_url: ""
            }
          ]
        }
        setAllHospitals(fetchedData);
      } finally {
        setLoading(false);
      }
    }
    fetchHospitals();
  }, [isPreview]);

  useEffect(() => {
    let filtered = allHospitals;
    
    // URL Query
    const q = searchParams.get("q")?.toLowerCase();
    const dest = searchParams.get("dest")?.toLowerCase();

    if (q) {
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(q) || 
        (h.description && h.description.toLowerCase().includes(q))
      );
    }

    // Destination / Country Match (from URL)
    if (dest) {
        filtered = filtered.filter(h => 
          (h.country && h.country.toLowerCase().includes(dest)) || 
          h.city.toLowerCase().includes(dest)
        );
    }

    // Country Filter (Sidebar)
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(h => 
        h.country && selectedCountries.some(country => h.country!.toLowerCase().includes(country.toLowerCase()))
      );
    }

    // City Filter
    if (selectedCities.length > 0) {
      filtered = filtered.filter(h => 
        selectedCities.some(city => h.city.toLowerCase().includes(city.toLowerCase()))
      );
    }

    // Specialty Filter
    if (selectedSpecialty !== "All Units") {
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(selectedSpecialty.toLowerCase()) || 
        (h.description && h.description.toLowerCase().includes(selectedSpecialty.toLowerCase())) ||
        (h.specialties && h.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) ||
        (h.accreditations && h.accreditations.some(a => a.toLowerCase().includes(selectedSpecialty.toLowerCase())))
      );
    }

    setHospitals(filtered);
  }, [allHospitals, searchParams, selectedCities, selectedSpecialty, selectedCountries]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  // Only take the text before a comma for the city filter
  const availableCities = Array.from(new Set(allHospitals.map(h => {
    const parts = h.city.split(',');
    return parts[0].trim();
  }))).filter(Boolean).sort();
  
  const availableCountries = Array.from(new Set(allHospitals.map(h => h.country))).filter(Boolean).sort() as string[];
  const availableSpecialties = Array.from(new Set(allHospitals.flatMap(h => h.specialties || []))).filter(Boolean).sort();

  return (
    <main className="max-w-7xl mx-auto px-8 pt-36 pb-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
      {/* Sidebar Filters */}
      <aside className="space-y-8">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-6">Filter by Country</h4>
          <div className="space-y-3">
            {availableCountries.map((country, idx) => {
              const isSelected = selectedCountries.includes(country);
              return (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isSelected}
                    onChange={() => toggleCountry(country)}
                  />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-outline-variant group-hover:border-primary'}`}>
                    <div className={`w-3 h-3 bg-primary rounded-sm transition-transform duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`}></div>
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>{country}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-6">Filter by City</h4>
          <div className="space-y-3">
            {availableCities.map((city, idx) => {
              const isSelected = selectedCities.includes(city);
              return (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isSelected}
                    onChange={() => toggleCity(city)}
                  />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-outline-variant group-hover:border-primary'}`}>
                    <div className={`w-3 h-3 bg-primary rounded-sm transition-transform duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`}></div>
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>{city}</span>
                </label>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-6">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {['All Units', ...availableSpecialties].map((spec, idx) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <span 
                  key={idx}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/10'}`}
                >
                  {spec}
                </span>
              );
            })}
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl">
          <h5 className="font-bold text-on-surface mb-2">Need Help?</h5>
          <p className="text-sm text-on-surface-variant mb-4">Our medical advisors are available 24/7 to guide you.</p>
          <button className="w-full flex items-center justify-center gap-2 bg-white border border-outline-variant text-on-surface py-3 rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-primary">call</span>
            Talk to an Advisor
          </button>
        </div>
      </aside>

      {/* Hospital List */}
      <section className="lg:col-span-3 space-y-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Top Accredited Hospitals</h2>
            <p className="text-on-surface-variant">Showing verifying medical centers</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-outline">
            <span>Sort by:</span>
            <select className="bg-transparent border-none focus:ring-0 text-primary font-bold cursor-pointer">
              <option>Top Rated</option>
              <option>Recommended</option>
              <option>Most Experience</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hospitals.length > 0 ? (
          <>
            <div className="space-y-8">
              {hospitals.slice(0, visibleCount).map((hospital) => (
                <div key={hospital.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row border border-outline-variant/20">
                  <div className="md:w-72 h-64 md:h-auto overflow-hidden relative">
                    <img 
                      alt={hospital.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={hospital.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000"} 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {hospital.accreditations && hospital.accreditations.length > 0 && (
                        <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {hospital.accreditations[0]} Accredited
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-sm font-bold text-on-surface">{hospital.rating}</span>
                          <span className="text-xs text-on-surface-variant">({hospital.reviews_count}+ Reviews)</span>
                        </div>
                        <h3 className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">{hospital.name}</h3>
                        <p className="text-sm text-on-surface-variant font-medium">{hospital.city}</p>
                      </div>
                      {hospital.logo_url && (
                        <div className="h-12 w-24 bg-white rounded flex items-center justify-center p-1 border object-contain">
                           <img 
                              alt="Logo" 
                              className="h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                              src={hospital.logo_url} 
                            />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(hospital.specialties || []).map((spec, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-md border border-outline-variant/30">{spec}</span>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pt-6 border-t border-outline-variant/20">
                      <div className="flex gap-2 shrink-0 flex-wrap">
                        {hospital.accreditations && hospital.accreditations.map((acc, index) => (
                           <div key={index} className={`px-2 py-1 rounded border shadow-sm text-[10px] font-bold tracking-wider ${
                             acc === 'JCI' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                             acc === 'NABH' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                             'bg-blue-100 text-primary border-blue-200'
                           }`}>
                             {acc}
                           </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full xl:w-auto mt-2 xl:mt-0 items-center justify-between xl:justify-end">
                        <Link href={`/hospitals/${hospital.slug || hospital.id}`} className="text-sm flex items-center gap-1 font-bold text-primary hover:underline whitespace-nowrap">
                          View details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                        <Link href="/quote" className="bg-primary text-center w-full sm:w-auto text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:opacity-90 whitespace-nowrap">
                          Book Consultation
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < hospitals.length && (
              <div className="flex justify-center pt-10">
                <button 
                  onClick={handleLoadMore}
                  className="bg-surface-container-high hover:bg-surface-dim text-on-surface px-8 py-3 rounded-full font-bold transition-all border border-outline-variant/50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  Voir Plus (See More)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
             <p className="text-on-surface-variant">No hospitals found in the database.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="pt-36 text-center">Loading Hospitals...</div>}>
      <HospitalsList />
    </Suspense>
  );
}
