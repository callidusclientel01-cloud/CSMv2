"use client";

import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function ConsultationPage() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!specialty || !destination) {
      alert("Please select a specialty and a destination.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to book a consultation.");

      const inquiryType = `${specialty} Consultation in ${destination}`;
      
      const { error } = await supabase
        .from('enquiries')
        .insert({
          user_id: user.id,
          inquiry_type: inquiryType,
          status: 'Pending Review'
        });
        
      if (error) throw error;

      alert(`Success! Your request for ${inquiryType} has been submitted.`);
      router.push("/dashboard/enquiries");
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-24 pb-12 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      {/* Hero Header with Image */}
      <div className="relative rounded-xl overflow-hidden mb-8 h-48 flex items-end">
        <img alt="Clinical Header" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNMk6tfCsoZxuLR9PWeo0jXj9aeZBMRTeqkwRlR5TZ8JabgS-NjXvyW_vDI3iqJVtgyiC2Dc82LfYtFGIbRk8HbeypTIe-NVec6hKqe5p8061UMcCW1tX8ESedmSkWrjnqm0oj2VhOpe5hr6jeDC_nNl3QKFLLsMpirUiWcyCziI2mLXQL4JSaPvSLvdu8RtRAVXRDi0Z8tIGPMKGn28gIY0voeiwBT5_3LZEF4cN5f4i03MpujEsulOwqFxS0gfWGgxOlqaum_ME"/>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
        <div className="relative p-8 w-full">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Book a Consultation</h1>
          <p className="text-primary-fixed text-sm">Secure your appointment with global medical experts in minutes.</p>
        </div>
      </div>
      
      {/* Multi-Step Progress Indicator */}
      <div className="flex justify-between items-center mb-10 px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">1</div>
          <span className="text-xs font-semibold text-primary">Details</span>
        </div>
        <div className="flex-1 h-px bg-surface-container-highest mx-4"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm">2</div>
          <span className="text-xs font-medium text-on-surface-variant">Review</span>
        </div>
        <div className="flex-1 h-px bg-surface-container-highest mx-4"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm">3</div>
          <span className="text-xs font-medium text-on-surface-variant">Confirm</span>
        </div>
      </div>
      
      {/* Bento Grid Form Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-transparent">
            <h3 className="text-lg font-bold text-on-surface mb-6">Medical Specialty & Location</h3>
            <div className="space-y-8">
              {/* Specialty Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Select Specialty (Required)</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Cardiology", "Neurology", "Oncology"].map((spec) => (
                    <button 
                      key={spec}
                      onClick={() => setSpecialty(spec)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        specialty === spec 
                          ? 'border-primary/40 bg-primary/10 text-primary' 
                          : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl mb-2">{spec === 'Cardiology' ? 'cardiology' : spec === 'Neurology' ? 'neurology' : 'oncology'}</span>
                      <span className="text-xs font-semibold">{spec}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Country Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Medical Destination (Required)</label>
                <div className="flex flex-wrap gap-2">
                  {["India", "Turkey", "UAE", "Thailand"].map((dest) => (
                    <button 
                      key={dest}
                      onClick={() => setDestination(dest)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                        destination === dest 
                          ? 'bg-secondary-container text-on-secondary-container' 
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                      }`}
                    >
                      {destination === dest && <span className="material-symbols-outlined text-lg">location_on</span>} {dest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Document */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Preferred Date</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-highest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/40 transition-all font-body" type="date"/>
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Medical Report (Optional)</label>
                   <label className="flex items-center justify-center w-full h-[46px] px-4 bg-surface-container-highest rounded-xl cursor-pointer hover:bg-surface-container-high transition-all">
                     <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary">upload_file</span>
                       <span className="text-sm text-on-surface-variant">Upload PDF/JPG</span>
                     </div>
                     <input className="hidden" type="file" disabled/>
                   </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <button className="px-6 py-3 text-primary font-bold text-sm w-full md:w-auto hover:bg-surface-container-high rounded-full transition-all">Save for Later</button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 bg-primary text-on-primary w-full md:w-auto rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : (
                <>Submit Request <span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-8 -mt-8"></div>
            <h4 className="text-sm font-bold text-secondary flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-xl">verified_user</span> Global Trust Network
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              You are booking through CureSureMedico&apos;s elite partner network. All hospitals in India, Turkey, UAE, and Thailand are JCI accredited.
            </p>
            <div className="flex items-center gap-3">
              <img alt="Liaison" className="w-10 h-10 rounded-full object-cover border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv4WcovqCQ3L4tJToMV-L6xErLkquwm0LSPDMK4Ut4eMb_PaqYOGTKLf-24M-L-BlskOL8HSUhT_2TmDvfc-Kw5eqWqinHLliO7lfS9MEYor-Musz41xcJudW2T875RYRHtEsuZvP6hClVSCVJXHt5JtuNcHQDlvHCdEsFRNQFqXDc94K_2DF47zlPA5xpFQ-9w5UGly4gOzgYWnb_GYRJfav-Jm1-5rwS4wBkrwPWuTA4MhvpVg9BBkSwsFTb4PYo8UmPf8Ema4A"/>
              <div>
                <p className="text-[10px] font-bold text-on-surface">Dr. Ananya Sharma</p>
                <p className="text-[10px] text-on-surface-variant">Chief Medical Liaison</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-on-surface">Need Assistance?</h4>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">support_agent</span>
              <div>
                <p className="text-xs font-bold">Priority Patient Desk</p>
                <p className="text-[11px] text-on-surface-variant">Available 24/7 for global patients</p>
              </div>
            </div>
            <button className="w-full py-2 bg-white text-primary border border-primary/20 text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
              Talk to a Care Manager
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
