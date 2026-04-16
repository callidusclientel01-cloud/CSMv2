"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { countries } from "@/utils/countries";

interface Destination {
  id: string; // the UI shows UUID
  country_name: string;
  tagline: string;
  description: string;
  image_url: string;
  key_specialists: string[];
}

export default function DestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/quote');
  };

  const [selectedCountryName, setSelectedCountryName] = useState("Nigeria");
  const [phoneCode, setPhoneCode] = useState("+234");
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedCountryName(name);
    const countryObj = countries.find(c => c.name === name);
    if (countryObj) setPhoneCode(countryObj.code);
  };

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .order("id", { ascending: true }); // Display in standard order

        let finalDestinations: Destination[] = [];
        if (error) {
          console.error("Error fetching destinations:", error);
        }
        
        if (data && data.length > 0) {
          finalDestinations = data;
        } else {
          // STATIC FALLBACK
          finalDestinations = [
            {
              id: "1",
              country_name: "India",
              tagline: "The Value Hub",
              description: "",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq0HHjE1_3c92pbLZNEzrYmmlbVxKvabg7mo5lLzkLibengEFEkYtuAVujccSvJ5gJaNVgPM0WaIMIVwDuVr_vKQSq4yzQ7fujS_gtefH-bxPDE5jSKqettn0h_X8XhN7vpn7hgyhc8aPzB0qUiV23Ze0GoxdY91otlVQdUkgbg_jqA2X2HgPCSgnvCtfb6DcPTdWDOADdpfSKJHlPc5zlxRFTsEZY1XPl5YfsFM-DHNetXc83LPdwoFsv8oksQWzJVHdH0Pg4sjQ",
              key_specialists: ["Cardiac", "Oncology", "Orthopedics"]
            },
            {
              id: "2",
              country_name: "Turkey",
              tagline: "Aesthetic Specialists",
              description: "",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKZueMGbI54FydD-Tcbmb0AyrODH71vR6TOq6TcwVY4q1kU0E6R2G0OHObQ8aZYjw0id-TS7yjSj852mk2YWnV1rrUMpY0-kbk9VKlckuEJKCDvprxEL0jcxDeI4HH6trbL_lEzsiOGQg0jMiQEDk24mEAkZagrtn3IG3FIATDfHNP41i2QcLc7PAEQQtiTuE4KY9sroKZ8T7e7ioMl_kQfULSsYoHMWCC0NqOvz-FzZzp-5yPefy9YPDN1J50iiNyZJlaWWGJbt0",
              key_specialists: ["Dental", "Eye Care", "Cosmetic"]
            },
            {
              id: "3",
              country_name: "UAE",
              tagline: "Luxury Care",
              description: "",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpB0kdV3Z9TqZWwdLRizK6sunDdMWj2b_D70hhNL0gIU6AsvFBeJgY8FafzyHqtyF2nVUrx7zZrbOLCu1BHcKJvWsxvw2PTrzuICbj75M9n8-hIIx60HXtAyVWoP5FAK1OkGLPU2PSqY7_9YeXanseng0s9bVSsAzNTZhPmHgs7PI5F5i_SM3hZ51xC3ZbT889UhcLSpbRhWg_62CJpoRgStaF9Lo2NQ4tmD2YXpbfDpNoYmJoXjNWPSEhvtscl0YJg9KbIHl4xgM",
              key_specialists: ["Genomics", "Sports Med", "VIP Care"]
            },
            {
              id: "4",
              country_name: "Thailand",
              tagline: "Wellness & Surgery",
              description: "",
              image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdKOjbPACtvdM2SV-MJWCZPaHSvRnjf_puRnHxhXXlNVwgreD4AH7MUmb7Fl5DGdgWoF3IrV0IiGhs3bqlyzuCA5GVirS8zfYMVuALYf0EZvE9fXlofT8oR3EJQZvefrfni9ed6CNFa-slmiw_RHQloCtehEI2mEu6we2wAZ5zQ73NF-SLXxWenAHTUxbmFJI4BV5FxvYzEpdm1rh9G9F97LJi4YwerlILoaLgKyPuDxY0TDqlmw6g8A521D8wxWEDZs7ndK9saNo",
              key_specialists: ["Fertility", "Wellness", "Joints"]
            }
          ];
        }
        setDestinations(finalDestinations);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-8 min-h-[400px] flex items-center bg-surface overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent z-10"></div>
          <img 
             className="w-full h-full object-cover" 
             alt="Warm portrait of African family" 
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzRtXmG33DUZf7afdSGwX1356SeuEmX35vKULFsYkr-Wv_V056A6JbqgYj1WyqbVpTS5qVRKN0YW3jtVcRLQfIWIVWETcX1_f4nCWZ8hzJWpuj6r3DP1Gf_xJBVur4M84XZg0kmcbljwOvolJWbFbmrVrtL5SFnkTkXiuW5p0hp29p4GR64Kmqc7wb7EhSnITXKsmvAlGDUcf_HVEcYUdgJv-1hvoAZywrU_XBJ5GVSfj9NrRSJMDwcQW_lzqf-B3wJv9ZYLs1ruc" 
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">public</span>
              Global Healthcare Excellence
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.1]">
              World-Class Medical <span className="text-primary">Destinations</span> Within Your Reach
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
              Bridging the gap between African patients and global medical expertise. From Lagos to Nairobi, our local support teams ensure your international treatment journey is seamless and safe.
            </p>
          </div>
          
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-2xl border border-outline-variant/20 max-w-md ml-auto w-full">
            <h3 className="text-2xl font-bold mb-6">Start Your Journey</h3>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Full Name</label>
                  <input required className="w-full bg-surface-container-highest border-none rounded-md focus:ring-2 focus:ring-primary/40 placeholder:text-outline p-3 text-sm" placeholder="John Doe" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Country</label>
                  <select 
                    value={selectedCountryName}
                    onChange={handleCountryChange}
                    className="w-full bg-surface-container-highest border-none rounded-md focus:ring-2 focus:ring-primary/40 p-3 text-sm cursor-pointer"
                  >
                     {countries.map(c => (
                       <option key={c.name} value={c.name}>{c.name}</option>
                     ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Medical Condition</label>
                <input required className="w-full bg-surface-container-highest border-none rounded-md focus:ring-2 focus:ring-primary/40 placeholder:text-outline p-3 text-sm" placeholder="e.g. Orthopedic, Cardiac" type="text" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">WhatsApp Number</label>
                <div className="flex gap-2">
                  <span className="bg-surface-container-highest flex items-center justify-center px-3 rounded-md text-on-surface-variant text-sm font-bold w-24">
                    {phoneCode}
                  </span>
                  <input required className="flex-1 bg-surface-container-highest border-none rounded-md focus:ring-2 focus:ring-primary/40 placeholder:text-outline p-3 text-sm" placeholder="800 000 0000" type="tel" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-full font-bold text-lg hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 cursor-pointer">
                Request Expert Consultation
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-2">Confidential and secure. Your data is protected.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Premier Destinations Grid */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight">Premier Medical Hubs</h2>
              <p className="text-on-surface-variant text-lg">Vetted hospitals across the most trusted medical tourism destinations.</p>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
          ) : destinations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.slice(0, visibleCount).map((dest) => (
                  <div key={dest.id} className="group bg-surface-container-low rounded-xl overflow-hidden flex flex-col shadow-sm border border-outline-variant/10 hover:shadow-xl transition-all">
                    <div className="h-56 overflow-hidden relative">
                      <img 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                         alt={dest.country_name} 
                         src={dest.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000"} 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                        {dest.tagline}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h5 className="text-2xl font-bold mb-2 text-on-surface">{dest.country_name}</h5>
                      <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
                        {dest.description}
                      </p>
                      
                      {/* Specialists tags if any */}
                      {dest.key_specialists && dest.key_specialists.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {dest.key_specialists.map((specialist, idx) => (
                            <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-surface-container-highest px-2 py-1 rounded text-on-surface-variant">
                              {specialist}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link href={`/destinations/${dest.slug || dest.id}`} className="mt-auto w-full py-3 text-center rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                        Explore Medical Hubs
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < destinations.length && (
                <div className="flex justify-center pt-12">
                  <button 
                    onClick={handleLoadMore}
                    className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-8 py-3 rounded-full font-bold transition-all border border-outline-variant/30 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    Voir Plus (See More Destinations)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
               <p className="text-on-surface-variant">No destinations found in the database.</p>
            </div>
          )}
        </div>
      </section>

      {/* The Africa Support Network */}
      <section className="py-24 px-8 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full fill-white" viewBox="0 0 100 100">
            <path d="M30 10 C 50 10, 60 40, 90 45 C 70 60, 60 90, 40 85 C 20 80, 10 40, 30 10"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-on-primary">
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">The Africa Support Network</h2>
              <p className="text-xl text-primary-fixed/80 leading-relaxed">
                  We aren't just a website; we are on the ground. Our local concierge teams in major African hubs provide in-person guidance, document collection, and post-treatment follow-ups.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Lagos, Nigeria</h4>
                    <p className="text-sm text-primary-fixed/60">Ikeja Medical Support Center & Document Hub</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Nairobi, Kenya</h4>
                    <p className="text-sm text-primary-fixed/60">Kilimani Patient Care Coordination Office</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Johannesburg, South Africa</h4>
                    <p className="text-sm text-primary-fixed/60">Sandton Regional Administrative Headquarters</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square lg:aspect-video border-8 border-white/10">
              <div className="absolute inset-0 bg-primary/20"></div>
              <img 
                 className="w-full h-full object-cover" 
                 alt="Africa Map" 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_R1luhuYq4h4pgrcYuLGquFjw2ruNNNX0Q6Y62VpdL6gxEFbZPGg1CfxbPCVfcWEJdHE4fZRiITIyhoJisuDUccV9Aggo3k8R7t043ygZxNX99PsKiPWI8t7Xxs11Y5wFpYa6ixXUIOa9wr5ww23nMh9YxpXKe7AUAb4m579wUxq38PTbdJEJqonZjSMDywEOkuA-up3oU8QgSnxKxHLs00kjmHkgUE44J8umoNLeHBBkmoXMPsnBIomOjgpH6QMQYgVyY_6kveo" 
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
