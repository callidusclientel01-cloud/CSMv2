"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { countries } from "@/utils/countries";
import { supabase } from "@/utils/supabaseClient";

// Mock data (This will later come from Supabase)
const PACKAGES = [
  {
    id: 1,
    title: "Full Executive Check-up",
    badge: "Limited Time",
    description: "Comprehensive head-to-toe screening including cardiac, renal, and advanced imaging for international patients.",
    price: "$850",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZX0dhQiKJbTeKabBthrd87utqo-oFW8MR4bwbe-3Kl_4qZLauHS2NiZ9-5in5jE70lsFQwYcfCzXBEIoZUG-vYzaqoWu-wRCqBjy9CvURYwdj8nOvKP4ZgC8wsbKmFZ7-yODlxCtovxDDH8roPP40fxhORONYuA7Sn_TFqnwsbNpfODxHUVKo6Au8-0QxneoMYc_lVWWnTkBoUjBmgBs26BK5N2VKdhtIBkyansHEm13ejAfePom8FLA4UjLwVXd0FL7eFOfY188"
  },
  {
    id: 2,
    title: "Cardiac Excellence Suite",
    badge: "Special Offer",
    description: "Premium screening by top cardiologists, including Angiography and detailed cardiac consultations.",
    price: "$1,200",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLH1TsXo777siMCGhqY88b_R8RWsAMexGU5tTezMcsPCOqBz0wRLwydKNFhU_crbeH9m0OLv-QqAzbBHEUn8izYLO-0T1CxdFXqJeHKiT_zW-yvd-gC2TxmHx0n5-NaBmWxT0HKS5tyehDr1N3TcEp_gNJio13HqphblIGv4FMEBqVVLGG0zLYdXnQ07qL_wOwYoSDqZQV0_rQwsj-a6kfXhMxIMKT9u9h3i7-1fAAbo8xP5pQKBWO18FYOFUrhfbkTXxa8ZF9CrY"
  },
  {
    id: 3,
    title: "IVF Foundation Package",
    badge: "Special Offer",
    description: "Start your journey with expert fertility guidance. Includes initial tests, consultation, and accommodation support.",
    price: "$3,900",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCazZPlsryPdTGpIYuXl0RSiJOuL-M1oExo4KHRCzn9AfTwqgM0ciDiOvT-MV4vXPybHro4tQbjfLE1cimFq6iNeU9YZVr0CubHFIQcZLQ8HtGBFEcHQwHFDkLREjZf9vQI8X_EMufQzDwkqakCJl_wPinUDiLpNj_DFPtu1VHJ5HQmd3L-j9i0ULR8wyNxLeYBUudKnjNUv9t7RCZgNkxUeIM8LwnyKERM-PhaXvvSx3GbOHQheG95KDJhWFjP39u4ribsWC6ImAE"
  }
];

// Fallback data for Patient Stories (Videos) if Supabase is empty
const STATIC_STORIES = [
  {
    id: 1,
    title: "Nigeria | Cardiac Surgery",
    country: "Nigeria",
    youtube_id: "zpOULjyy-n8",
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLH1TsXo777siMCGhqY88b_R8RWsAMexGU5tTezMcsPCOqBz0wRLwydKNFhU_crbeH9m0OLv-QqAzbBHEUn8izYLO-0T1CxdFXqJeHKiT_zW-yvd-gC2TxmHx0n5-NaBmWxT0HKS5tyehDr1N3TcEp_gNJio13HqphblIGv4FMEBqVVLGG0zLYdXnQ07qL_wOwYoSDqZQV0_rQwsj-a6kfXhMxIMKT9u9h3i7-1fAAbo8xP5pQKBWO18FYOFUrhfbkTXxa8ZF9CrY"
  },
  {
    id: 2,
    title: "Virtual Facility Tour",
    country: "Global",
    youtube_id: "M_v3aO7gJ_U",
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBebJ8wQ_zCwYl8zd_DZW9MVoLnE1xAA36MOERssA2I6BYa2ggzStbScync7_P7A5KJYbSeko8sVxAOyQA53rYsm0ig_uaC3R0akvNKgSxnM0l763r20bZ-A-YqZZlSBwFmgdu3J6e96BlAw4iD4_Ykbg-dPa2kWNA7B-sVdko2NiqR5D-yfgciBBpynbCm_GMeE2TWxLvcv1svm6LLmd1fl2x3nNRkx80rfDguY2c2SBXbzvplv0x0cqRr1w4VfHFYLw0MVLTRJl0"
  },
  {
    id: 3,
    title: "Kenya | Orthopedics",
    country: "Kenya",
    youtube_id: "bYy2vI2eGkQ",
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQZaDpfpFFF3DOO2smjkpcs7r0C6tdDF2Vcphyaq6G58zXtczDhuoGkMPl6yyinartPyId8RQXQSr4TcRXeYB7b70wrNt1qC9MOAnTkJAW_lv66lIytC7o77UXxyKBMeodqZh52b0-mC5HI_riy-NCJfZQAuqIDDCc90rSe_poSmx96fGkVL9cMxygfaT3r4i03kF5y09p_gfV2pEJd1NE47wSvGWB0ygovD6PEWrQjrQhXB6WfCSvl-e59_bAKWmzUydVMM45kgc"
  },
  {
    id: 4,
    title: "Premium Recovery Suite",
    country: "Global",
    youtube_id: "lUjXntJ1G9k",
    thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW_95pC0t2W78L7khno0jUu0QLDdJ4IIAPUZqBZMqtfZrUuPbdnDDOsDmM6INuajOyEL-IJTKVCmQCCDrRsvokHS0_DtWAf2McGu64V5h95g8QSifB6gz0AB76_q5UCOSeY95aJ7xxtwRjGqxFEcxgqMy8kGaENjdI_TuV-_Yr_M-2__w_TK7LQw4PyWqLHAU7BxpFJwJrW4qmVw70ZmVBAecGb_BDW0vJ2WhQX9yNHzzxwMsEY5dlUc918Tzk-fQqjmP_Tv7TgSg"
  }
];


export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("Nigeria");
  const [phoneCode, setPhoneCode] = useState("+234");
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const [patientStories, setPatientStories] = useState<any[]>(STATIC_STORIES);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function fetchStories() {
      const { data, error } = await supabase
        .from('patient_stories')
        .select('*')
        .order('id', { ascending: true })
        .limit(4);
      
      if (error) {
        console.error("Erreur de lecture Supabase (Peut-être les règles RLS ne sont pas activées ?) :", error);
      } else if (data && data.length > 0) {
        // Formatter les données : si l'utilisateur met un lien complet, on extrait l'ID
        const formattedData = data.map(story => {
          let yId = story.youtube_id || "";
          
          // Si on trouve "youtube.com/watch?v=" ou "youtu.be/", on extrait l'ID
          if (yId.includes("youtube.com/watch?v=")) {
            yId = yId.split("v=")[1].split("&")[0];
          } else if (yId.includes("youtu.be/")) {
            yId = yId.split("youtu.be/")[1].split("?")[0];
          }

          // Si on n'a pas de thumbnail, on en génère un automatiquement depuis YouTube !
          const thumb = story.thumbnail_url || `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`;

          return {
            ...story,
            youtube_id: yId,
            thumbnail_url: thumb
          };
        });
        setPatientStories(formattedData);
      }
    }
    fetchStories();
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedCountryName(name);
    const countryObj = countries.find(c => c.name === name);
    if (countryObj) setPhoneCode(countryObj.code);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (selectedDest) params.append("dest", selectedDest);
    router.push(`/hospitals?${params.toString()}`);
    setSearchQuery("");
    setSelectedDest("");
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const fullPhone = `${phoneCode} ${phoneNumber}`;
      
      const { error } = await supabase.from('leads').insert([{
        name: fullName,
        phone: fullPhone,
        condition: medicalCondition,
        notes: `From Hero Form. Country selected: ${selectedCountryName}`
      }]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFullName("");
      setPhoneNumber("");
      setMedicalCondition("");
      
      // Optional: hide success message after a few seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-surface">
        {/* Beautiful Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="CureSureMedico Global Hospital Network" 
            className="w-full h-full object-cover object-[center_25%]" 
            src="/hero-bg.png"
          />
          {/* Gradient overlay to ensure text readability on the left and visual impact on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-surface/40"></div>
          <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest mb-6">World-Class Healthcare</span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-primary leading-[1.1] tracking-tight mb-8">
              Get World-Class Treatment at <span className="text-secondary">Affordable Costs</span>
            </h1>
            <p className="text-lg text-on-surface-variant mb-10 max-w-xl leading-relaxed">
              Personalized medical travel support for international patients. From consultation to recovery, we guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-12 z-10 relative">
              <button onClick={() => router.push('/quote')} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-bold shadow-lg flex justify-center items-center gap-2 hover:opacity-90 transition-opacity">
                Get Free Treatment Plan <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
              <button onClick={() => router.push('/quote')} className="w-full sm:w-auto px-8 py-4 bg-surface-container-low text-primary rounded-2xl font-bold hover:bg-surface-container-high transition-colors flex justify-center items-center">
                Talk to Medical Expert
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl"></div>
            <div className="relative bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-xl border border-outline-variant/10">
              <h3 className="text-xl font-bold text-primary mb-6">Inquire About Treatment</h3>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                {submitSuccess && (
                  <div className="bg-green-100 text-green-800 p-3 rounded-xl text-sm font-medium">
                    Thank you! Your inquiry has been sent. We will contact you shortly.
                  </div>
                )}
                {submitError && (
                  <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-medium">
                    {submitError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Full Name</label>
                  <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary py-3 px-4" placeholder="Your Name" type="text" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Country</label>
                  <select 
                    value={selectedCountryName}
                    onChange={handleCountryChange}
                    className="w-full bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary py-3 px-4"
                  >
                    {countries.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">WhatsApp</label>
                  <div className="flex gap-2">
                     <span className="bg-surface-container border-none rounded-xl flex items-center justify-center px-4 text-sm font-bold w-24 shrink-0 text-on-surface-variant">
                       {phoneCode}
                     </span>
                    <input required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1 w-full bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary py-3 px-4" placeholder="Phone Number..." type="tel" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Medical Condition</label>
                  <input required value={medicalCondition} onChange={(e) => setMedicalCondition(e.target.value)} className="w-full bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary py-3 px-4" placeholder="e.g. Cardiac Surgery" type="text" />
                </div>
                <button disabled={isSubmitting} className="w-full py-4 bg-primary text-white font-bold rounded-xl mt-4 hover:bg-primary-container transition-colors tracking-wide disabled:opacity-70 disabled:cursor-not-allowed" type="submit">
                  {isSubmitting ? "Sending..." : "Complete Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Global Search & Filter Bar (Added per user request) */}
      <section className="bg-surface py-8 md:py-12 -mt-10 relative z-20 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto bg-surface-container-lowest rounded-3xl md:rounded-full overflow-hidden shadow-lg border border-outline-variant/10 p-4 shrink-0 2xl:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-2">
          <div className="flex-1 flex items-center px-4 md:px-6 w-full md:w-auto border-b md:border-b-0 md:border-r border-outline-variant/20 pb-4 md:pb-0">
            <span className="material-symbols-outlined text-primary mr-3">stethoscope</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-0 py-1" 
              placeholder="Search by Treatment..." 
              type="text" 
            />
          </div>
          <div className="flex-1 flex items-center px-4 md:px-6 w-full md:w-auto pb-2 md:pb-0">
            <span className="material-symbols-outlined text-tertiary mr-3">public</span>
            <select 
              value={selectedDest}
              onChange={(e) => setSelectedDest(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium cursor-pointer px-0 py-1"
            >
              <option value="">Filter by Destination</option>
              <option value="India">India</option>
              <option value="Dubai">Dubai</option>
              <option value="Turkey">Turkey</option>
            </select>
          </div>
          <button onClick={handleSearch} className="bg-secondary text-on-secondary px-8 py-3.5 rounded-2xl md:rounded-full font-bold hover:opacity-90 transition-all w-full md:w-auto cursor-pointer flex-shrink-0">
            Find Hospital
          </button>
        </div>
      </section>

      {/* Your Journey to Recovery Section */}
      <section className="py-16 md:py-24 bg-surface px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-20 -mt-20 blur-3xl z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold uppercase text-xs tracking-widest">How It Works</span>
            <h2 className="text-4xl font-headline font-extrabold text-primary mt-2">Your Journey to Recovery</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mt-4 text-lg">
              We handle everything, so you can focus on healing. Un accompagnement étape par étape.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal connecting line (hidden on mobile) */}
            <div className="hidden md:block absolute top-[50px] left-0 w-full h-1 bg-outline-variant/20 rounded-full z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-surface-container-lowest border border-outline-variant/20 shadow-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                  <span className="material-symbols-outlined text-4xl">assignment</span>
                </div>
                <h3 className="font-bold border-b-2 border-transparent group-hover:border-primary pb-1 transition-all mb-2">1. Consultation</h3>
                <p className="text-sm text-on-surface-variant">Send your medical reports for a free evaluation by our partnering specialists.</p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-surface-container-lowest border border-outline-variant/20 shadow-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                  <span className="material-symbols-outlined text-4xl">travel_explore</span>
                </div>
                <h3 className="font-bold border-b-2 border-transparent group-hover:border-primary pb-1 transition-all mb-2">2. Travel &amp; Visa</h3>
                <p className="text-sm text-on-surface-variant">We organize your entire trip, including visa letters, flights, and accommodation.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-surface-container-lowest border border-outline-variant/20 shadow-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                  <span className="material-symbols-outlined text-4xl">health_and_safety</span>
                </div>
                <h3 className="font-bold border-b-2 border-transparent group-hover:border-primary pb-1 transition-all mb-2">3. Treatment</h3>
                <p className="text-sm text-on-surface-variant">Receive world-class care at top accredited hospitals with dedicated interpreters.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-surface-container-lowest border border-outline-variant/20 shadow-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                  <span className="material-symbols-outlined text-4xl">volunteer_activism</span>
                </div>
                <h3 className="font-bold border-b-2 border-transparent group-hover:border-primary pb-1 transition-all mb-2">4. Recovery</h3>
                <p className="text-sm text-on-surface-variant">Enjoy a safe recovery and continuous post-treatment follow-ups back home.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Packages Section */}
      <section className="py-16 md:py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-4">
            <div>
              <span className="text-secondary font-bold uppercase text-xs tracking-widest">Curated Healthcare</span>
              <h2 className="text-4xl font-headline font-extrabold text-primary mt-2">Promotional Medical Packages</h2>
              <p className="text-on-surface-variant mt-2">All-inclusive healthcare bundles designed for your peace of mind.</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore All Packages <span className="material-symbols-outlined">arrow_forward</span></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl border border-outline-variant/10 overflow-hidden flex flex-col no-line-card shadow-sm">
                <div className="relative h-48">
                  <img alt={pkg.title} className="w-full h-full object-cover" src={pkg.image} />
                  <div className={`absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${pkg.badge === 'Limited Time' ? 'bg-error' : 'bg-primary'}`}>
                    {pkg.badge}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-primary mb-2">{pkg.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{pkg.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-outline font-bold uppercase">Package Price</span>
                      <span className="text-2xl font-extrabold text-secondary">{pkg.price}</span>
                    </div>
                    <button className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elite Accredited Hospitals Section */}
      <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-12 md:mb-16">
      <h2 className="text-4xl font-headline font-extrabold text-primary">Elite Accredited Hospitals</h2>
      <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto">Global centers of excellence with JCI and ISO certifications, specifically chosen for our African patients.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Hospital 1 */}
      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden no-line-card shadow-sm border border-outline-variant/10 flex flex-col">
      <div className="relative h-56">
      <img alt="Apollo Hospitals" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"/>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
      <span className="material-symbols-outlined text-secondary text-sm fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      <span className="text-xs font-bold text-on-surface">4.9/5</span>
      </div>
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col">
      <h3 className="text-xl font-bold text-primary mb-1">Apollo Hospitals</h3>
      <p className="text-sm text-on-surface-variant mb-6 flex items-center gap-1">
      <span className="material-symbols-outlined text-base">location_on</span> Chennai, India
                              </p>
      <button onClick={() => router.push('/hospitals')} className="w-full mt-auto py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex justify-center items-center">View Details</button>
      </div>
      </div>
      {/* Hospital 2 */}
      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden no-line-card shadow-sm border border-outline-variant/10 flex flex-col">
      <div className="relative h-56">
      <img alt="Bumrungrad International" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80"/>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
      <span className="material-symbols-outlined text-secondary text-sm fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      <span className="text-xs font-bold text-on-surface">4.8/5</span>
      </div>
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col">
      <h3 className="text-xl font-bold text-primary mb-1">Bumrungrad International</h3>
      <p className="text-sm text-on-surface-variant mb-6 flex items-center gap-1">
      <span className="material-symbols-outlined text-base">location_on</span> Bangkok, Thailand
                              </p>
      <button onClick={() => router.push('/hospitals')} className="w-full mt-auto py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex justify-center items-center">View Details</button>
      </div>
      </div>
      {/* Hospital 3 */}
      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden no-line-card shadow-sm border border-outline-variant/10 flex flex-col">
      <div className="relative h-56">
      <img alt="Cleveland Clinic" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80"/>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
      <span className="material-symbols-outlined text-secondary text-sm fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      <span className="text-xs font-bold text-on-surface">4.9/5</span>
      </div>
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col">
      <h3 className="text-xl font-bold text-primary mb-1">Cleveland Clinic</h3>
      <p className="text-sm text-on-surface-variant mb-6 flex items-center gap-1">
      <span className="material-symbols-outlined text-base">location_on</span> Abu Dhabi, UAE
                              </p>
      <button onClick={() => router.push('/hospitals')} className="w-full mt-auto py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex justify-center items-center">View Details</button>
      </div>
      </div>
      </div>
      </div>
      </section>
      {/* Top Medical Destinations Section */}
      <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-16">
      <h2 className="text-4xl font-headline font-extrabold text-primary">Top Medical Destinations</h2>
      <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto">Experience world-class care in the world&apos;s leading medical hubs with complete concierge support.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Destination 1: India */}
      <div className="group relative h-96 rounded-3xl overflow-hidden shadow-xl">
      <img alt="India Destination" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
      <h3 className="text-3xl font-bold text-white mb-2">India</h3>
      <p className="text-secondary-fixed font-bold text-sm mb-6">Save 60-80% on medical costs compared to Western facilities.</p>
      <button onClick={() => router.push('/destinations')} className="w-full sm:w-fit px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex justify-center items-center">Explore Treatments</button>
      </div>
      </div>
      {/* Destination 2: Thailand */}
      <div className="group relative h-96 rounded-3xl overflow-hidden shadow-xl">
      <img alt="Thailand Destination" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
      <h3 className="text-3xl font-bold text-white mb-2">Thailand</h3>
      <p className="text-secondary-fixed font-bold text-sm mb-6">Specializing in Wellness, IVF, and high-end cosmetic care.</p>
      <button onClick={() => router.push('/destinations')} className="w-full sm:w-fit px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex justify-center items-center">Explore Treatments</button>
      </div>
      </div>
      {/* Destination 3: UAE */}
      <div className="group relative h-96 rounded-3xl overflow-hidden shadow-xl">
      <img alt="UAE Destination" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
      <h3 className="text-3xl font-bold text-white mb-2">UAE</h3>
      <p className="text-secondary-fixed font-bold text-sm mb-6">Premium Clinical Care with ultra-modern JCI facilities.</p>
      <button onClick={() => router.push('/destinations')} className="w-full sm:w-fit px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex justify-center items-center">Explore Treatments</button>
      </div>
      </div>
      </div>
      </div>
      </section>


      {/* Specialty Treatments */}
      <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-16">
      <span className="text-secondary font-bold uppercase text-xs tracking-widest">Centers of Excellence</span>
      <h2 className="text-4xl font-headline font-extrabold text-primary mt-2">Specialty Treatments</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-surface-container-lowest p-8 rounded-2xl no-line-card shadow-sm cursor-pointer hover:border-primary border border-transparent transition-all" onClick={() => router.push('/treatments')}>
      <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container mb-6">
      <span className="material-symbols-outlined">cardiology</span>
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">Cardiology</h3>
      <p className="text-sm text-on-surface-variant mb-6">Advanced heart surgeries and minimally invasive procedures.</p>
      <div className="flex items-center justify-between mt-auto">
      <span className="text-xs font-bold text-outline">Starting at</span>
      <span className="text-lg font-extrabold text-secondary">$3,500</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-8 rounded-2xl no-line-card shadow-sm cursor-pointer hover:border-primary border border-transparent transition-all" onClick={() => router.push('/treatments')}>
      <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container mb-6">
      <span className="material-symbols-outlined">orthopedics</span>
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">Orthopedics</h3>
      <p className="text-sm text-on-surface-variant mb-6">Joint replacements and spine surgeries using robotic precision.</p>
      <div className="flex items-center justify-between mt-auto">
      <span className="text-xs font-bold text-outline">Starting at</span>
      <span className="text-lg font-extrabold text-secondary">$4,200</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-8 rounded-2xl no-line-card shadow-sm cursor-pointer hover:border-primary border border-transparent transition-all" onClick={() => router.push('/treatments')}>
      <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container mb-6">
      <span className="material-symbols-outlined">oncology</span>
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">Oncology</h3>
      <p className="text-sm text-on-surface-variant mb-6">Comprehensive cancer care with latest immunotherapy protocols.</p>
      <div className="flex items-center justify-between mt-auto">
      <span className="text-xs font-bold text-outline">Starting at</span>
      <span className="text-lg font-extrabold text-secondary">$5,000</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-8 rounded-2xl no-line-card shadow-sm cursor-pointer hover:border-primary border border-transparent transition-all" onClick={() => router.push('/treatments')}>
      <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container mb-6">
      <span className="material-symbols-outlined">neurology</span>
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">Neurology</h3>
      <p className="text-sm text-on-surface-variant mb-6">Expert treatment for complex brain and spinal cord disorders.</p>
      <div className="flex items-center justify-between mt-auto">
      <span className="text-xs font-bold text-outline">Starting at</span>
      <span className="text-lg font-extrabold text-secondary">$4,800</span>
      </div>
      </div>
      </div>
      <div className="mt-12 text-center">
      <button onClick={() => router.push('/treatments')} className="text-primary font-bold flex items-center gap-2 mx-auto hover:gap-4 transition-all">
                          View All 30+ Specialties <span className="material-symbols-outlined">arrow_forward</span>
      </button>
      </div>
      </div>
      </section>

      {/* Patient Stories */}
      <section className="py-16 md:py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
      <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary-container via-transparent to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
      <span className="text-secondary-fixed font-bold uppercase text-xs tracking-widest">Real Experiences</span>
      <h2 className="text-4xl font-headline font-extrabold mt-4 mb-6 leading-tight">Patient Stories &amp; Virtual Tours</h2>
      <p className="text-primary-fixed/80 text-lg mb-10 leading-relaxed">Hear from families across Africa who chose CureSureMedico for their life-changing treatments. Take a virtual walk through our partner JCI-accredited facilities.</p>
      <button className="flex items-center gap-3 font-bold group">
      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
      <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
      </div>
                              Watch All Testimonials
                          </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {patientStories.map((story) => (
        <div 
          key={story.id}
          className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer" 
          onClick={() => setVideoOpen(`${story.youtube_id}?rel=0`)}
        >
          <img alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={story.thumbnail_url}/>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-5xl">play_circle</span>
          </div>
          <div className="absolute bottom-4 left-4">
            <p className="text-xs font-bold uppercase bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded">{story.title}</p>
          </div>
        </div>
      ))}
      </div>
      </div>
      </div>
      </section>

      {/* The CureSureMedico Advantage */}
      <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-12 md:mb-16">
      <h2 className="text-4xl font-headline font-extrabold text-primary">The CureSureMedico Advantage</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-surface-container p-10 rounded-2xl flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-6">
      <span className="material-symbols-outlined">verified</span>
      </div>
      <h3 className="text-2xl font-bold text-primary mb-4">Verified JCI-Accredited Hospitals</h3>
      <p className="text-on-surface-variant leading-relaxed">We only partner with hospitals that meet the gold standard of international healthcare. Each facility is personally vetted by our medical board.</p>
      </div>
      <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden">
      <img alt="Hospital exterior" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"/>
      </div>
      </div>
      <div className="bg-secondary-container p-8 rounded-2xl flex flex-col">
      <div className="w-12 h-12 bg-on-secondary-container rounded-xl flex items-center justify-center text-white mb-6">
      <span className="material-symbols-outlined">payments</span>
      </div>
      <h3 className="text-xl font-bold text-on-secondary-container mb-4">Transparent Pricing</h3>
      <p className="text-on-secondary-container/80 text-sm leading-relaxed">No hidden costs. Get detailed medical quotes and financial breakdown before you leave your home country.</p>
      </div>
      <div className="bg-surface-container-high p-8 rounded-2xl flex flex-col">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-6">
      <span className="material-symbols-outlined">public</span>
      </div>
      <h3 className="text-xl font-bold text-primary mb-4">Africa Support Network</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">Local support offices in Lagos, Nairobi, and Addis Ababa for seamless pre-travel coordination.</p>
      </div>
      <div className="bg-primary text-white p-8 rounded-2xl md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1 order-2 md:order-1">
      <h3 className="text-2xl font-bold mb-4">24/7 Dedicated Case Manager</h3>
      <p className="text-primary-fixed/70 leading-relaxed mb-6">Your personal advocate in the hospital who speaks your language and understands your cultural needs.</p>
      <ul className="space-y-3">
      <li className="flex items-center gap-2 text-sm"><span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span> 24/7 Bedside support</li>
      <li className="flex items-center gap-2 text-sm"><span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span> Linguistic assistance</li>
      <li className="flex items-center gap-2 text-sm"><span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span> Discharge planning</li>
      </ul>
      </div>
      </div></div></div></section>

      {/* YouTube Video Modal */}
      {videoOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setVideoOpen(null)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setVideoOpen(null)} 
              className="absolute -top-12 right-0 text-white hover:text-secondary-fixed transition-colors flex items-center gap-1 font-bold z-50 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span> Close
            </button>
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoOpen}&autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
