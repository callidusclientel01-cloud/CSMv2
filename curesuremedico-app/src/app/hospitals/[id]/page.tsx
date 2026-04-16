"use client";

import { useState } from "react";
import Image from "next/image";
import { countries } from "@/utils/countries";

export default function HospitalProfilePage({ params }: { params: { id: string } }) {
  // Mock data for Apollo Hospitals based on the provided template
  const isApollo = params.id === "apollo";
  
  const [selectedCountryName, setSelectedCountryName] = useState("Nigeria");
  const [phoneCode, setPhoneCode] = useState("+234");
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedCountryName(name);
    const countryObj = countries.find(c => c.name === name);
    if (countryObj) setPhoneCode(countryObj.code);
  };

  return (
    <main className="pt-20 bg-surface text-on-surface">
      {/* Hero Section with Asymmetric Layout */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden py-20 px-8">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-15 grayscale" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC1E4TG7V-JemvIIaMtrv3dAfwnM2_URdZ3oQjv0C3_arLrgLmrTVSzFP9uWcvewSR8CgW22BA4x9xi49U3q275PkvFdN6CA_hJ5NpOqdzct5QntM3aeQiPqtivYBv6Qs47wz01ky7Xg6jpv0_-ZNJu15Kh5tVgL9aBI00eCj2eKLRIPr8nWQNH0j_RafgX4nXEhpDDtCHGqA4OrAloeswGWwSy9WpbchhGDjAkgQfKmtpwYanAOA1G5iZDPxSDeyiUfK2MIOLWWA" 
            alt="Hospital Exterior" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface/90 to-primary/5"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                JCI Accredited
              </span>
              <div className="flex items-center gap-1 text-secondary font-bold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm">4.9 Rating</span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface tracking-tight mb-4 leading-[1.1]">
              Apollo Hospitals, <br/><span className="text-primary">Greams Road</span>
            </h1>
            <div className="flex items-center gap-2 text-on-surface-variant mb-8 text-lg">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span>Chennai, Tamil Nadu, India</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Book Consultation
              </button>
              <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-full font-bold text-lg hover:bg-surface-container-high transition-colors">
                Get Free Quote
              </button>
            </div>
          </div>
          
          {/* Lead Capture Form Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-xl shadow-primary/5 border border-outline-variant/10">
              <h3 className="text-2xl font-bold mb-6 text-on-surface">Inquire About Treatment</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5 ml-1">Full Name</label>
                  <input required className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline" placeholder="John Doe" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5 ml-1">Country of Residence</label>
                  <select 
                    value={selectedCountryName}
                    onChange={handleCountryChange}
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 text-on-surface"
                  >
                    {countries.map((country, index) => (
                      <option key={index} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5 ml-1">WhatsApp Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 py-3 rounded-l-xl border-r border-outline-variant/20 bg-surface-container-highest text-on-surface-variant font-bold text-sm">
                      {phoneCode}
                    </span>
                    <input required className="w-full bg-surface-container-highest border-none rounded-r-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline" placeholder="123456789" type="tel" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5 ml-1">Treatment Type</label>
                  <select className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 text-on-surface">
                    <option value="">Select Specialty</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="oncology">Oncology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="robotic">Robotic Surgery</option>
                  </select>
                </div>
                <button className="w-full bg-secondary text-on-secondary py-4 rounded-xl font-bold mt-4 hover:opacity-95 transition-opacity" type="submit">
                  Send Inquiry
                </button>
                <p className="text-[10px] text-center text-on-surface-variant/60 mt-4">
                  By submitting, you agree to our privacy policy and medical disclaimer.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* About Section (Bento Grid Style) */}
      <section className="py-24 bg-surface px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col justify-center">
              <h2 className="text-3xl font-extrabold mb-6 tracking-tight">Clinical Excellence Since 1983</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                Apollo Hospitals, Greams Road, Chennai is the flagship hospital of the Apollo Group. Established in 1983, it has revolutionized the healthcare landscape in India, pioneering modern medical techniques and compassionate care.
              </p>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Our mission is to bring healthcare of international standards within the reach of every individual. We are committed to the achievement and maintenance of excellence in education, research, and healthcare for the benefit of humanity.
              </p>
            </div>
            <div className="lg:col-span-4 bg-primary-container rounded-xl p-8 text-on-primary-container flex flex-col justify-between">
              <span className="material-symbols-outlined text-5xl mb-4">clinical_notes</span>
              <div>
                <div className="text-4xl font-black mb-2">40+</div>
                <div className="text-sm font-medium opacity-80 uppercase tracking-widest">Years of Legacy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure & Technology */}
      <section className="py-24 bg-surface-container-low px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">The Precision Center</h2>
              <h3 className="text-4xl font-extrabold tracking-tight">Infrastructure &amp; Future-Tech</h3>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <span className="block text-3xl font-black text-secondary">600+</span>
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter">Premium Beds</span>
              </div>
              <div className="w-px h-10 bg-outline-variant/30"></div>
              <div className="text-right">
                <span className="block text-3xl font-black text-secondary">15+</span>
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter">Advanced OTs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl border-b-4 border-primary">
              <span className="material-symbols-outlined text-primary text-4xl mb-6">precision_manufacturing</span>
              <h4 className="text-xl font-bold mb-3">Robotic Surgery Suite</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Equipped with the latest Da Vinci® Xi Robotic System for minimally invasive procedures with maximum precision.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl border-b-4 border-secondary">
              <span className="material-symbols-outlined text-secondary text-4xl mb-6">biotech</span>
              <h4 className="text-xl font-bold mb-3">Diagnostic Labs</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">NABL accredited high-end laboratories featuring 3T MRI, 128 Slice CT, and advanced molecular diagnostics.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl border-b-4 border-tertiary">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-6">emergency</span>
              <h4 className="text-xl font-bold mb-3">24/7 Emergency Wing</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Dedicated level-1 trauma center with air ambulance facilities and specialized cardiac emergency units.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Centers of Excellence</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">Providing world-class medical expertise across diverse specialties with a patient-centric approach.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">cardiology</span>
              </div>
              <h4 className="font-bold text-lg">Cardiology</h4>
            </div>
            <div className="group text-center cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">medication_liquid</span>
              </div>
              <h4 className="font-bold text-lg">Oncology</h4>
            </div>
            <div className="group text-center cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">orthopedics</span>
              </div>
              <h4 className="font-bold text-lg">Orthopedics</h4>
            </div>
            <div className="group text-center cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">smart_toy</span>
              </div>
              <h4 className="font-bold text-lg">Robotic Surgery</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-surface-container-low px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px]">
            <div className="md:col-span-6 rounded-xl overflow-hidden relative">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkx7x8TrXX9nLWjXSRNTizLEn0yJT469kqG758YFkGID6JnWepo689ny8NOEsjPOnDzG93yL3CYHf7LEXGaGFlmO1zPs6EpyK5_yo8Iq3QXIunCNSKpU8u4czZBj4ppFbhToOgIVxP9qm4JfojgXAcheIWBKzkUMpZBkYQpJYY_PFZ7uUbgUVJ9rFKZXEU8j-Me6r5YzW0wFuouYQijfBY-8ObPodoIZtFDeg08LRxrLaA31lyf883QSBqRTlUxxY2Ym8BuK3-ta0" alt="Hospital Lobby" />
              <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">Main Lobby</div>
            </div>
            <div className="md:col-span-3 grid grid-rows-2 gap-4">
              <div className="rounded-xl overflow-hidden relative">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqa21_N-ZUMm0XFbfiwOm3hn_gv4eimP52Cv8op4t7EmzRTB6vPN9xrcl37IBK7-8AKf5XOfxinDvBkNlbcSssJTo7Nrwmmi_RFF_hUuYE0qUhuleCaWOB-0OHtmdUqot1-7BCK5wJi9fTMWfxSRmf2p6yT-oglijdvPB9yMG-uaDxZMF3WYtxZt86rOsvURJCxMPcvH-zXLqXoISvY3O80Bkeoh_zYv4O7gnBTaPQuSfaVU81AlQKpo-xCQIcHC58lzoSrbyKSNA" alt="Robotic Surgery Arm" />
              </div>
              <div className="rounded-xl overflow-hidden relative">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9opteFhWcdZR3nMZzWq7e-HQLQRsGk3Ry6Zlz_sFk2YGf9iDhCsl3EiI3Z0IqS9fQRZkeSUgcPy8tsvppg-SZ1YAUZuiWuzMsPohJqH6KntJOs5nn6NjJtBhq1GYbVZZRmDdFrf1mmZyaJCAMdadqzhuqcdpZouVGQu6_ZGI--QugVEuzFVGqUwAOFMdGNzbuJoepGnAQVb79tKuD0wuvHrcfbe6cYRfv000pIZkvXJHax0O5-dY3s1v0OGxF3TYBWf8fN78aRiY" alt="Patient Recovery Suite" />
              </div>
            </div>
            <div className="md:col-span-3 rounded-xl overflow-hidden relative">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdoZd0_xb8dWbN82voJOF5MMxc_cJN7oSKioI4ieeBmE1tfnf7YNc0BVW4NZowhCE26-4J9GTbhXOgce8xMcFLQnP5L8T7eJCXPZbOQt6KUTOMykoRYl0L61tEHGzXV8HxQNd2bcEm6SIc0yMaInxJztnvbJEig6H6BRODX7pWDNfQf4DNzAC4qhETGsCy77pr-BP4O0_c4UgQZhDFtqs7aNmfJr4zCcZOQagxuuz5M00jDc-C94BFujR_G7vU7tFBZcn0AmELaqw" alt="Medical Corridor" />
            </div>
          </div>
        </div>
      </section>

      {/* Patient Support Services (International) */}
      <section className="py-24 bg-surface-container px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-6">Global Patient Support</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              Apollo Greams Road is a preferred destination for international patients. Our dedicated International Patient Wing ensures a seamless journey from your home country to our hospital and back.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-sm">translate</span>
                </div>
                <span className="font-medium">Multi-lingual support: Arabic, French, Bengali, and more.</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-sm">travel_explore</span>
                </div>
                <span className="font-medium">End-to-end Visa &amp; Travel assistance.</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-sm">hotel</span>
                </div>
                <span className="font-medium">Concierge service for accommodation and transport.</span>
              </li>
            </ul>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <div className="aspect-square bg-primary/5 rounded-3xl overflow-hidden shadow-inner hidden md:block">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_7JgMIU9OhPGqgwRvArDb_q9lXyIPwWXvwB9F1IgZuAEiQmH2pLCIKjMCadRaXPCqyfTPBBY5Zb3Coariey4k8L3faLNlyfTSlxYAQlxEO8gzlxw_ER13k-JJ0bDIdAhWvLalGa1ZxvF6kSqhlk3eBP9NKLDcGeQ4VkmkDLiiqQ8KgTcw0qhIxq8pJB2ydtMoJIaKLG8tLHlOA7lBeizLANLIzUonpb7b_WsSntwV70_AtL925IdxQcjOulkEA5SP02C_1sQZ_r8" alt="Physician" />
            </div>
            <div className="md:absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-2xl shadow-lg border border-outline-variant/10 max-w-[240px]">
              <p className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">24/7 Helpline</p>
              <p className="text-xl font-black">+91 44 2829 0203</p>
              <p className="text-[10px] text-on-surface-variant mt-2">Dedicated international patient coordinator desk.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
