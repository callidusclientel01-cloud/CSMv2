"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import { countries } from "@/utils/countries";
import { useTranslations } from "next-intl";

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    condition: "",
    preferred_destination: "",
    notes: ""
  });
  const t = useTranslations("QuotePage");
  
  const [selectedCountryName, setSelectedCountryName] = useState("Nigeria");
  const [countryCode, setCountryCode] = useState("+234");
  const [file, setFile] = useState<File | null>(null);
  const [availableDestinations, setAvailableDestinations] = useState<any[]>([]);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userCaptcha, setUserCaptcha] = useState("");

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);

    async function fetchDestinations() {
      const { data } = await supabase.from('destinations').select('country_name');
      if (data && data.length > 0) {
        setAvailableDestinations(data);
      }
    }
    fetchDestinations();
  }, []);

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

    if (parseInt(userCaptcha) !== num1 + num2) {
      setError("Incorrect math answer. Please try again.");
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setUserCaptcha("");
      setIsSubmitting(false);
      return;
    }

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
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setUserCaptcha("");
      
    } catch (err: any) {
      console.error("Submission failed", err);
      setError("An error occurred while submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 xs:pt-24 sm:pt-32 pb-12 xs:pb-16 sm:pb-20 px-4 xs:px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-8 xs:mb-10 sm:mb-12 text-center sm:text-left">
          <span className="inline-block px-3 xs:px-4 py-1 xs:py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-3 xs:mb-4">
            {t("personalizedCare")}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tighter mb-4 xs:mb-6 leading-tight">
            {t("heroTitle1")} <br className="hidden xs:block" /> {t("heroTitle2")} <span className="text-primary">{t("heroTitleHighlight")}</span>.
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed mx-auto sm:mx-0">
            {t("heroSubtitle")}
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Form */}
          <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
            <div className={`p-6 xs:p-8 sm:p-10 md:p-12 ${success ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
              <form onSubmit={handleSubmit} className="space-y-6 xs:space-y-7 sm:space-y-8">
                {/* Personal Info */}
                <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <h2 className="text-base xs:text-lg sm:text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg xs:text-xl">person</span>
                    {t("personalInfo")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs xs:text-sm font-medium text-on-surface-variant px-1">Full Name *</label>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-2.5 xs:py-3 px-3 xs:px-4 transition-all text-sm" 
                        placeholder="e.g. John Doe" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-on-surface-variant px-1">{t("emailAddress")}</label>
                      <input 
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-2.5 sm:py-3 px-3 sm:px-4 transition-all text-sm" 
                        placeholder="john@example.com" 
                        type="email" 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-on-surface-variant px-1">{t("residence")}</label>
                      <select 
                        value={selectedCountryName}
                        onChange={handleCountryChange}
                        className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-2.5 sm:py-3 px-3 sm:px-4 transition-all cursor-pointer"
                      >
                        {countries.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-on-surface-variant px-1">WhatsApp Number *</label>
                      <div className="flex gap-3">
                        <span className="bg-surface-container-highest flex items-center justify-center rounded-xl px-4 py-3 font-bold text-sm text-on-surface-variant w-24 shrink-0">
                          {countryCode}
                        </span>
                        <input 
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="flex-1 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-2.5 sm:py-3 px-3 sm:px-4 transition-all" 
                          placeholder="00 00 00 00 00" 
                          type="tel" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Medical Details */}
                <div className="space-y-6 pt-6">
                  <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">medical_information</span>
                    {t("medicalDetails")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-on-surface-variant px-1">{t("primaryCondition")}</label>
                      <input 
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-2.5 sm:py-3 px-3 sm:px-4 transition-all text-sm" 
                        placeholder="e.g. Chronic Back Pain" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-on-surface-variant px-1">{t("preferredDest")}</label>
                      <select 
                        name="preferred_destination"
                        value={formData.preferred_destination}
                        onChange={handleChange}
                        className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-2.5 sm:py-3 px-3 sm:px-4 transition-all text-sm"
                      >
                        <option value="">{t("noPreference")}</option>
                        {availableDestinations.length > 0 ? (
                          availableDestinations.map(d => (
                            <option key={d.country_name} value={d.country_name}>{d.country_name}</option>
                          ))
                        ) : (
                          <>
                            <option value="India">India</option>
                            <option value="Turkey">Turkey</option>
                            <option value="UAE">UAE</option>
                            <option value="Thailand">Thailand</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-on-surface-variant px-1">{t("uploadReports")}</label>
                      <label className="flex flex-col items-center justify-center w-full h-14 px-4 bg-surface-container-highest border border-dashed border-outline-variant/40 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">upload_file</span>
                          <span className="text-sm text-on-surface-variant font-medium truncate max-w-md">
                            {file ? file.name : t("uploadPrompt")}
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
                      <label className="text-sm font-medium text-on-surface-variant px-1">{t("tellUsMore")}</label>
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all resize-none" 
                        placeholder={t("tellUsMorePlaceholder")}
                        rows={4}
                      ></textarea>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant px-1">Human Check: {num1} + {num2} = ?</label>
                      <input 
                        required
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        className="w-full bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 py-3 px-4 transition-all" 
                        placeholder="Answer" 
                        type="number" 
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col xs:flex-row gap-3 xs:gap-4">
                  <button 
                    disabled={isSubmitting}
                    className={`w-full xs:w-auto bg-primary text-on-primary text-sm xs:text-base font-bold px-8 xs:px-12 py-3 xs:py-4 rounded-full transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl active:scale-95'}`} 
                    type="submit"
                  >
                    {isSubmitting ? 'Sending...' : t("getTreatmentPlan")}
                    {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6 xs:space-y-7 sm:space-y-8">
            {/* ...existing code... */}
          </aside>
        </div>
      </div>
    </main>
  );
}
