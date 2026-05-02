"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { countries } from "@/utils/countries";

interface Treatment {
  id: string;
  slug?: string;
  name: string;
  icon_name: string;
  short_description: string;
  starting_price: string;
}

interface Package {
  id: string;
  slug?: string;
  title: string;
  badge_text: string;
  description: string;
  price: string;
  features: string[];
  image_url: string;
}

function TreatmentsContent() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [visibleTreatments, setVisibleTreatments] = useState(6);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState("");
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  useEffect(() => {
    async function fetchData() {
      try {
        const isAdmin = typeof window !== 'undefined' ? localStorage.getItem("csm_admin_auth") !== null : false;
        const showDrafts = isPreview && isAdmin;

        // Fetch Treatments
        let treatmentQuery = supabase.from("treatments").select("*").order("id", { ascending: true });
        if (!showDrafts) {
          treatmentQuery = treatmentQuery.eq('status', 'published');
        }
        const { data: treatmentData, error: treatmentErr } = await treatmentQuery;

        if (treatmentErr) {
          console.error("Error fetching treatments:", treatmentErr);
        }
        
        if (treatmentData && treatmentData.length > 0) {
          finalTreatments = treatmentData;
        } else {
          // STATIC FALLBACK
          finalTreatments = [
            { id: "1", slug: "cardiology", name: "Cardiology", icon_name: "favorite", short_description: "Heart valve replacement, Bypass surgery, and minimally invasive cardiac procedures.", starting_price: "Ask for quote" },
            { id: "2", slug: "orthopedics", name: "Orthopedics", icon_name: "check_circle", short_description: "Precision robotic knee and hip replacements using the latest biocompatible materials.", starting_price: "Ask for quote" },
            { id: "3", slug: "oncology", name: "Oncology", icon_name: "healing", short_description: "Comprehensive cancer care including CyberKnife, Proton therapy, and advanced immunotherapy.", starting_price: "Ask for quote" },
            { id: "4", slug: "fertility-ivf", name: "Fertility/IVF", icon_name: "child_care", short_description: "High-success rate IVF, ICSI, and egg donation programs in world-class clinics.", starting_price: "Ask for quote" },
            { id: "5", slug: "neurology", name: "Neurology", icon_name: "psychology", short_description: "Expert neurosurgery for brain and spine conditions using navigation-guided systems.", starting_price: "Ask for quote" },
            { id: "6", slug: "bariatric-surgery", name: "Bariatric Surgery", icon_name: "monitor_weight", short_description: "Advanced metabolic surgeries and gastric sleeve procedures for long-term health.", starting_price: "Ask for quote" },
            { id: "7", slug: "gastroenterology", name: "Gastroenterology", icon_name: "check_circle", short_description: "Advanced endoscopic procedures and digestive tract treatments.", starting_price: "Ask for quote" },
            { id: "8", slug: "urology", name: "Urology", icon_name: "check_circle", short_description: "Prostate treatments, kidney stone removal, and robotic urologic surgeries.", starting_price: "Ask for quote" },
            { id: "9", slug: "cosmetic-surgery", name: "Cosmetic Surgery", icon_name: "face", short_description: "High-end aesthetic and reconstructive procedures by international board-certified surgeons.", starting_price: "Ask for quote" },
            { id: "10", slug: "dentistry", name: "Dentistry", icon_name: "check_circle", short_description: "Full mouth restorations, dental implants, and premium aesthetic dentistry.", starting_price: "Ask for quote" },
            { id: "11", slug: "ophthalmology", name: "Ophthalmology", icon_name: "visibility", short_description: "Advanced LASIK, cataract surgery, and retinal treatments.", starting_price: "Ask for quote" },
            { id: "12", slug: "pediatrics", name: "Pediatrics", icon_name: "check_circle", short_description: "Specialized pediatric cardiology, oncology, and general pediatric surgery.", starting_price: "Ask for quote" },
            { id: "13", slug: "pulmonology", name: "Pulmonology", icon_name: "check_circle", short_description: "Asthma, COPD, and advanced respiratory disorder treatments.", starting_price: "Ask for quote" },
            { id: "14", slug: "general-surgery", name: "General Surgery", icon_name: "medical_services", short_description: "Wide range of minimally invasive laparoscopic and general surgical procedures.", starting_price: "Ask for quote" },
            { id: "15", slug: "gynecology", name: "Gynecology", icon_name: "pregnant_woman", short_description: "Comprehensive women's health screening and specialized gynecological surgeries.", starting_price: "Ask for quote" }
          ];
        }
        setTreatments(finalTreatments);

        // Fetch Packages
        let finalPackages: Package[] = [];
        let packageQuery = supabase.from("packages").select("*").order("id", { ascending: true }).limit(3);
        if (!showDrafts) {
          packageQuery = packageQuery.eq('status', 'published');
        }
        const { data: packageData, error: packageErr } = await packageQuery;

        if (packageErr) {
          console.error("Error fetching packages:", packageErr);
        }

        if (packageData && packageData.length > 0) {
          finalPackages = packageData;
        } else {
          // STATIC FALLBACK
          finalPackages = [
            { id: "1", title: "Full Executive Check-up", badge_text: "Most Popular", description: "Comprehensive 2-day screening including advanced cardiac imaging, metabolic profile, and cancer marker screening at a premium facility.", price: "$1,200", features: [], image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt-M-PbLDQArKrmT1S0nDrS-OCfB_pnSE3Y94_yvvtwXe2C5zWPrlzs7ifj6wniyO-QeETc79lfDIwi3qBrZVKmvbddznWVVwEncjMNIkQvLNH1dSWU6c_w91ICsI9ARvCtz12brJPPAdOoo_iQM8PMqsC4Hn0TdirOIpn5FnirbkJOsEJBwzwC7w6W7ICJffWxxKDbWwJv02aocAyYCJIX-6_sj19PxJEnPKWi4wfJnsTfAcvvrwP2LTrD4ILuo3Fve0WIeyzDKM" },
            { id: "2", title: "Cardiac Excellence Suite", badge_text: "Exclusive Suite", description: "All-inclusive cardiac intervention package including premium hospital stay, specialist fees, and dedicated recovery concierge.", price: "$8,500", features: [], image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9GvupbFXOLPnff-BWCeW_OTFSuf2uOdLE7ro803jro7tDl_J3-F7Tgb6N2jr11gxntIZJu-2xLJAmhLy69kSp3MB5AYbBnQK0ZbU4uM668WgoyquazwmI30gMlNQp99ckEgInsg6js6a2X6WaLU_otEyaKoTwrmsC6zdVjJUf0HGaDuYmXjCTbJcxEanSTv7aJ87khZQXkb-CBmKTyboY8yX9wL6grlGuVfB7Tez4uiiFAaT45MPNqCmtKWDJYjb9KWA2nYXcOGA" },
            { id: "3", title: "IVF Foundation Package", badge_text: "Family Path", description: "One full cycle of IVF including medications, egg retrieval, and embryo transfer at a top fertility center in South Africa or India.", price: "$4,500", features: [], image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsx_x_IJNt7zANd24MQ22fGxxSI0SnjLd5Wl8K4HoDdjscIO2GZCEEMbyW0MbhDvP25y_xnPFq17Sgo-bGbedObDIxUeszS74EEwi-rXYqe0zPR1V5q9hBShlabQ2sucQxud2SAmFyzlMHo7VO3-pnj9l1Qgeb9UEnvkxjR-rDYeK1l_epxxiq_jWqGYq9iR5P5fHNQoiV7c2SAJElbbXJukpWlJ0Kbnke8pDJRqhJNToFo7AdWQHT6QpbHr48t1Hn0fQOHlaKneM" }
          ];
        }
        setPackages(finalPackages);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isPreview]);

  const [selectedCountryName, setSelectedCountryName] = useState("Nigeria");
  const [phoneCode, setPhoneCode] = useState("+234");
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedCountryName(name);
    const countryObj = countries.find(c => c.name === name);
    if (countryObj) setPhoneCode(countryObj.code);
  };

  const handleLoadMoreTreatments = () => {
    setVisibleTreatments((prev) => prev + 6);
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
        notes: `From Treatments Form. Country selected: ${selectedCountryName}`
      }]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFullName("");
      setPhoneNumber("");
      setMedicalCondition("");
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (selectedDest) params.append("dest", selectedDest);
    router.push(`/hospitals?${params.toString()}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[700px] flex items-center overflow-hidden pt-36">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover object-center" 
            alt="Medical Professional" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2Lay85eV3GaIWbr5Jt4hOcybqbHu0znPNDf3KkqWRWY9Ou8S6FoPpvBv1KwPdUp8Uq1bfFOQY8WkUkgnSiWy9y9kRyDXEjuKv1RpRCZWSFTIsY_Q_c6yp4wVI_KwEElGNW_cg85DgkVK827JaOVXJnU-t-DFTyT8ThooNTxADbhmrpyA7w4-A1eYgUqH0VtG55XssmYRBiyR2I8ASWu268xlL5bgEeXI6YQhx3MRQZWpZXnDgSLE1TDgSX-hzDrOSjOZRUt_uv-w" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-container/70"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-on-primary">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
              World-Class Treatments at <span className="text-secondary-container">Transparent Prices</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-xl mb-8 leading-relaxed font-light">
              Access top-tier medical care across our global network of accredited hospitals. High-quality outcomes, curated for the African patient.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined mr-2">verified_user</span>
                <span className="text-sm font-medium">JCI Accredited</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined mr-2">payments</span>
                <span className="text-sm font-medium">Up to 70% Savings</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 md:p-10 flex-col flex rounded-xl shadow-2xl max-w-md mx-auto lg:ml-auto w-full">
            <h3 className="text-2xl font-bold text-primary mb-2">Request a Consultation</h3>
            <p className="text-on-surface-variant text-sm mb-6">Get a personalized medical quote within 24 hours.</p>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              {submitSuccess && (
                <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm font-medium">
                  Thank you! Your inquiry has been sent.
                </div>
              )}
              {submitError && (
                <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-medium">
                  {submitError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/40 p-3 text-sm" placeholder="John Doe" type="text" />
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Country</label>
                  <select 
                    value={selectedCountryName}
                    onChange={handleCountryChange}
                    className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/40 p-3 text-sm"
                  >
                     {countries.map(c => (
                       <option key={c.name} value={c.name}>{c.name}</option>
                     ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Condition</label>
                  <input required value={medicalCondition} onChange={(e) => setMedicalCondition(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/40 p-3 text-sm" placeholder="e.g. Cardiology" type="text" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">WhatsApp Number</label>
                <div className="flex gap-2">
                  <span className="bg-surface-container-high px-3 flex items-center justify-center rounded-lg text-sm font-bold w-20 sm:w-24 shrink-0 text-on-surface-variant">
                    {phoneCode}
                  </span>
                  <input required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1 min-w-0 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/40 p-3 text-sm" placeholder="800 000 0000" type="tel" />
                </div>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                <span className="whitespace-nowrap">{isSubmitting ? "Sending..." : "Get Quote"}</span> {!isSubmitting && <span className="material-symbols-outlined shrink-0">arrow_forward</span>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Global Search & Filter Bar */}
      <section className="bg-surface py-12 -mt-10 relative z-20 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto bg-surface-container-lowest rounded-3xl md:rounded-full overflow-hidden shadow-lg border border-outline-variant/10 p-4 shrink-0 md:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-2">
          <div className="flex-1 flex items-center px-4 md:px-6 w-full md:w-auto border-b md:border-b-0 md:border-r border-outline-variant/20 pb-4 md:pb-0">
            <span className="material-symbols-outlined text-primary mr-3">stethoscope</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-0" 
              placeholder="Search by Treatment..." 
              type="text" 
            />
          </div>
          <div className="flex-1 flex items-center px-4 md:px-6 w-full md:w-auto pb-2 md:pb-0">
            <span className="material-symbols-outlined text-tertiary mr-3">public</span>
            <select 
              value={selectedDest}
              onChange={(e) => setSelectedDest(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium cursor-pointer px-0"
            >
              <option value="">Filter by Destination</option>
              <option value="India">India</option>
              <option value="Dubai">Dubai</option>
              <option value="Turkey">Turkey</option>
            </select>
          </div>
          <button onClick={handleSearch} className="bg-secondary text-on-secondary px-8 py-3.5 rounded-2xl md:rounded-full font-bold hover:opacity-90 transition-all w-full md:w-auto cursor-pointer block text-center min-h-[48px]">
            Find Hospital
          </button>
        </div>
      </section>

      {/* Specialty Grid */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tighter text-on-surface mb-4">Medical Specialties</h2>
          <p className="text-on-surface-variant max-w-2xl text-lg">Specialized care paths designed for complex medical needs, delivered by globally recognized specialists.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : treatments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treatments.slice(0, visibleTreatments).map((treatment) => (
                <div key={treatment.id} className="group bg-surface-container-low rounded-xl p-8 hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-sm border border-outline-variant/10 hover:shadow-xl">
                  <div className="w-14 h-14 rounded-lg bg-surface-container-lowest flex items-center justify-center mb-6 shadow-sm group-hover:bg-white/20">
                    <span className="material-symbols-outlined text-primary text-3xl group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {treatment.icon_name || "medical_services"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{treatment.name}</h3>
                  <p className="opacity-80 mb-8 line-clamp-2 min-h-[48px]">{treatment.short_description}</p>
                  <div className="mt-auto flex flex-col gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">Starting at {treatment.starting_price}</span>
                    <Link href={`/treatments/${treatment.slug || treatment.id}`} className="flex items-center justify-center font-bold text-sm uppercase tracking-widest gap-2 bg-white text-primary hover:bg-surface-container-lowest py-3 rounded-xl transition-all shadow-sm">
                      Explore Speciality <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleTreatments < treatments.length && (
              <div className="flex justify-center pt-12">
                <button 
                  onClick={handleLoadMoreTreatments}
                  className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-8 py-3 rounded-full font-bold transition-all border border-outline-variant/30 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  Voir Plus (See More Treatments)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
             <p className="text-on-surface-variant">No treatments found in the database.</p>
          </div>
        )}
      </section>

      {/* Promotional Medical Packages Section */}
      <section className="py-24 bg-surface-container-low/30 px-8 border-t border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tighter text-on-surface mb-4">Promotional Medical Packages</h2>
              <p className="text-on-surface-variant max-w-2xl text-lg">Carefully curated all-inclusive medical experiences with significant value.</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 hover:underline">
              View All Offers <span className="material-symbols-outlined">arrow_right_alt</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div key={pkg.id} className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full ${idx === 1 ? 'border-2 border-primary/10' : 'border border-outline-variant/20'}`}>
                <div className="relative h-64 overflow-hidden">
                  <img 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                     alt={pkg.title} 
                     src={pkg.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000"} 
                  />
                  {pkg.badge_text && (
                    <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${idx === 1 ? 'bg-primary' : (idx === 2 ? 'bg-tertiary' : 'bg-secondary')}`}>
                      {pkg.badge_text}
                    </div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3 text-on-surface">{pkg.title}</h3>
                  <p className="text-on-surface-variant mb-4 line-clamp-3">{pkg.description}</p>
                  
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="mb-8 space-y-1">
                      {pkg.features.slice(0,3).map((f, i) => (
                        <li key={i} className="text-sm text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span> {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-outline-variant/10 pt-6">
                    <div>
                      <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Starts from</span>
                      <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                    </div>
                    <Link href={`/quote?package=${pkg.id}`} className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined">add</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparative Pricing Table */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter text-on-surface mb-4">Estimated Treatment Costs</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">See how much you can save by choosing our partner hospitals in premium medical destinations.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-primary text-on-primary">
                  <th className="py-6 px-8 font-bold border-b border-primary-container">Procedure</th>
                  <th className="py-6 px-8 font-bold border-b border-primary-container">UK / USA Cost</th>
                  <th className="py-6 px-8 font-bold border-b border-primary-container">GlobalMed Avg.</th>
                  <th className="py-6 px-8 font-bold text-secondary-container border-b border-primary-container">Your Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="py-6 px-8 font-semibold">Knee Replacement (Single)</td>
                  <td className="py-6 px-8 text-on-surface-variant line-through">$35,000</td>
                  <td className="py-6 px-8 font-bold text-primary">$6,500</td>
                  <td className="py-6 px-8"><span className="bg-secondary-container/30 text-secondary font-bold px-3 py-1 rounded-full text-sm">Save 81%</span></td>
                </tr>
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="py-6 px-8 font-semibold">Heart Bypass (CABG)</td>
                  <td className="py-6 px-8 text-on-surface-variant line-through">$120,000</td>
                  <td className="py-6 px-8 font-bold text-primary">$9,800</td>
                  <td className="py-6 px-8"><span className="bg-secondary-container/30 text-secondary font-bold px-3 py-1 rounded-full text-sm">Save 92%</span></td>
                </tr>
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="py-6 px-8 font-semibold">IVF Treatment Cycle</td>
                  <td className="py-6 px-8 text-on-surface-variant line-through">$15,000</td>
                  <td className="py-6 px-8 font-bold text-primary">$4,200</td>
                  <td className="py-6 px-8"><span className="bg-secondary-container/30 text-secondary font-bold px-3 py-1 rounded-full text-sm">Save 72%</span></td>
                </tr>
              </tbody>
            </table>
            <div className="p-6 bg-surface-container-high/30 text-xs text-on-surface-variant text-center">
              *Prices are indicative and include hospital stay and surgery. Final quote depends on specific medical condition.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function TreatmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-36 pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <TreatmentsContent />
    </Suspense>
  );
}
