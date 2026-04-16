"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import { countries } from "@/utils/countries";

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    condition: "",
    preferred_destination: "",
    notes: ""
  });
  
  const [selectedCountryName, setSelectedCountryName] = useState("Nigeria");
  const [countryCode, setCountryCode] = useState("+234");
  const [file, setFile] = useState<File | null>(null);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedCountryName(name);
    const countryObj = countries.find(c => c.name === name);
    if (countryObj) setCountryCode(countryObj.code);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let attachmentUrl = "";

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("medical_reports")
          .upload(fileName, file);

        if (uploadError) {
          console.error("File upload error:", uploadError);
          attachmentUrl = `\n\n[System Note: User tried to upload a file (${file.name}), but the 'medical_reports' Supabase bucket is missing or restricted. Please create the bucket and set permissions.]`;
        } else if (uploadData) {
          const { data: publicUrlData } = supabase.storage.from("medical_reports").getPublicUrl(fileName);
          attachmentUrl = `\n\n[Medical Report Attachment: ${publicUrlData.publicUrl}]`;
        }
      }

      const { error: submitError } = await supabase
        .from("leads")
        .insert([{
           name: formData.name,
           email: formData.email,
           phone: `${countryCode} ${formData.phone}`,
           condition: formData.condition,
           preferred_destination: formData.preferred_destination,
           notes: formData.notes + attachmentUrl
        }]);

      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        condition: "",
        preferred_destination: "",
        notes: ""
      });
      setFile(null);
      
    } catch (err: any) {
      console.error("Submission failed", err);
      setError("An error occurred while submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-36 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <header className="mb-12 text-center md:text-left">
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold mb-4">
          Personalized Care
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tighter mb-6">
          Start Your Medical Journey <br className="hidden md:block" /> with <span className="text-primary">Confidence</span>.
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
          Connect with world-class specialists and receive a comprehensive, cost-effective treatment plan tailored specifically to your needs.
        </p>
      </header>

      {/* Main Form Container: Asymmetric Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Comprehensive Form */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10 relative">
          
          {/* Success Overlay */}
          {success ? (
            <div className="absolute inset-0 z-20 bg-surface-container-lowest flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
               <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                 <span className="material-symbols-outlined text-green-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
               </div>
               <h3 className="text-3xl font-bold text-on-surface mb-4">Demande Envoyée avec Succès !</h3>
               <p className="text-on-surface-variant max-w-md mx-auto mb-8 text-lg">
                 Merci pour votre confiance. Notre équipe médicale a bien reçu votre dossier et vous contactera par email ou WhatsApp d'ici 24 heures pour planifier votre consultation avec nos spécialistes.
               </p>
               <button 
                 onClick={() => setSuccess(false)}
                 className="bg-primary hover:bg-primary-container text-on-primary font-bold px-8 py-3 rounded-full transition-colors"
               >
                 Envoyer une autre demande
               </button>
            </div>
          ) : null}

          <div className={`p-8 md:p-12 ${success ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium border border-red-200">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section: Personal Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Full Name *</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all" 
                      placeholder="e.g. John Doe" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Email Address *</label>
                    <input 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all" 
                      placeholder="john@example.com" 
                      type="email" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Country of Residence</label>
                    <select 
                      value={selectedCountryName}
                      onChange={handleCountryChange}
                      className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all cursor-pointer"
                    >
                      {countries.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">WhatsApp Number *</label>
                    <div className="flex gap-3">
                      <span className="bg-surface-container-highest flex items-center justify-center rounded-xl px-4 py-3 font-bold text-sm text-on-surface-variant w-24">
                        {countryCode}
                      </span>
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all" 
                        placeholder="00 00 00 00 00" 
                        type="tel" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Medical Details */}
              <div className="space-y-6 pt-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">medical_information</span>
                  Medical Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Primary Condition</label>
                    <input 
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all" 
                      placeholder="e.g. Chronic Back Pain" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Preferred Destination</label>
                    <select 
                      name="preferred_destination"
                      value={formData.preferred_destination}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all"
                    >
                      <option value="">No preference / Advise Me</option>
                      <option value="India">India</option>
                      <option value="Turkey">Turkey</option>
                      <option value="UAE">UAE</option>
                      <option value="Thailand">Thailand</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Upload Medical Reports (Optional)</label>
                    <label className="flex flex-col items-center justify-center w-full h-14 px-4 bg-surface-container-highest border border-dashed border-outline-variant/40 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">upload_file</span>
                        <span className="text-sm text-on-surface-variant font-medium truncate max-w-md">
                          {file ? file.name : "Click to browse reports (PDF, JPG, PNG)"}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Tell us more about your case</label>
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all resize-none" 
                      placeholder="Briefly describe your symptoms, previous treatments, and goals..." 
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isSubmitting}
                  className={`w-full md:w-auto bg-primary text-on-primary text-lg font-bold px-12 py-4 rounded-full transition-all flex items-center justify-center gap-3 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl active:scale-95'}`} 
                  type="submit"
                >
                  {isSubmitting ? 'Sending...' : 'Get My Free Treatment Plan'}
                  {!isSubmitting && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
                <p className="mt-4 text-xs text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  Your data is encrypted and 100% confidential.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Right Side: Trust Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
            <h3 className="text-xl font-bold text-on-surface">Why Trust Us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">JCI Accredited Network</h4>
                  <p className="text-xs text-on-surface-variant">All hospitals in our network maintain the highest global safety standards.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">24/7 Dedicated Case Manager</h4>
                  <p className="text-xs text-on-surface-variant">Personalized support from your first inquiry until you return home safely.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">100% Data Confidentiality</h4>
                  <p className="text-xs text-on-surface-variant">We adhere to international health privacy regulations (HIPAA/GDPR).</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-surface-container-low p-8 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-on-surface">Local Support in Africa</h3>
            <p className="text-sm text-on-surface-variant mb-4">Visit our local offices for in-person consultations and medical documentation assistance.</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-2 rounded-lg">
                <span className="font-bold text-xs">Lagos</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-2 rounded-lg">
                <span className="font-bold text-xs">Nairobi</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-2 rounded-lg">
                <span className="font-bold text-xs">Johannesburg</span>
              </div>
            </div>
          </div>
          
          <div className="relative bg-primary overflow-hidden rounded-xl p-8 text-on-primary">
            <img 
               className="absolute inset-0 w-full h-full object-cover opacity-20" 
               alt="Happy Patient" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQUmlp0F-zAP7mZTRU5_WOKgLPFdeyE8DAl-7CEG4GpiHGW0SgNpYYAD58VYtkuxTZPg4FUr7YqOGD4UNnc4-f-IkqkVT_apoLdGDIYoTxdh4mND0hBRVX7eLcOMJyNbhswOzUXabTGNomt8ull6Y4poIjc3alWl2AfZh0nchcLS4N9G-LESeC6c4pk923d54X0mRAh5W1gMNceTggIJeFq65D7NUdh1RSMDA-tisdhtxlRzZ4VZ7Yh-gIBIHnGN8dzRfPIsrosd4" 
            />
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-4 text-secondary-container">format_quote</span>
              <p className="text-lg italic font-medium leading-relaxed mb-6">
                  "The process was seamless. From Lagos to Mumbai, CureSureMedico handled every detail. I'm now pain-free and back to work!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
                  <img 
                     className="w-full h-full object-cover" 
                     alt="Amara" 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Y4rxMY4BERsfwXWTbWh81w2GmDUWB_pihsabkGsWKEjuRgU4CW60xlIlokyKxLlmX_xNlGgF4Ke_4IZNIDo7ZnVdLtNLG-ZZeaWxMJjEN_wuAQaXLGkwCEE-wLSr9F4-J4Do33rkFK9KYIUzfhHHRWy5mGnlMBjV5XZwL6oqxRj8z5fLK3ZhkZBzJPx88WEbqEs90S8PIuMwEnOjsmU9Vb6LpPNXHuRYtBfFoorI0zDdpkBtAGeLV1LdQvr7L-e58JoMzrqo_Vg" 
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">Amara O.</p>
                  <p className="text-xs text-white/70">Knee Replacement Patient</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
