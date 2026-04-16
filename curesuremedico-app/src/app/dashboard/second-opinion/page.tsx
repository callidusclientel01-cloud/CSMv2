"use client";

import React from "react";

export default function SecondOpinionPage() {
  return (
    <section className="pt-24 pb-12 px-6 lg:px-12 max-w-6xl mx-auto min-h-screen">
      {/* Hero Header Section (Asymmetric Layout) */}
      <div className="flex flex-col lg:flex-row gap-12 mb-12 items-center">
        <div className="lg:w-7/12">
          <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full mb-4">EXPERT MEDICAL REVIEW</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-[1.1]">
            Clarity begins with a <span className="text-primary">world-class</span> second opinion.
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
            Gain peace of mind with a comprehensive review of your diagnosis and treatment plan by leading clinical specialists. Our remote consultation service connects you with top-tier expertise from the comfort of your home.
          </p>
        </div>
        <div className="lg:w-5/12 w-full">
          <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img alt="Doctor Reviewing Scans" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKtvaWLL8eZIhffu7sHGQ8mHq_dlXi1Cn2pTr2V-y8z58NayhywXoFp73hAbMLOn45oz3NgERZ1w4m_UYUJVF73wPv1DXIqWfXXGpw8ocVQg3bAV7y_NzEVIk9OvOZiQ0U20hiJvIRx6KvTDEbw05yr057Gb6GpYsO2fpL4PYvOdz2p13Nh7V1u8Jc_URnwln5UsKubgjPmNkQakt1BaCBJm-NJ6vUpdoZ0PaboZP-zRcQ3099aaUsj-p0unveml_JBmvDvF5wOws"/>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* The Process Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
          <span className="material-symbols-outlined text-primary mb-4 text-3xl">upload_file</span>
          <h3 className="text-lg font-bold mb-2">1. Secure Upload</h3>
          <p className="text-sm text-on-surface-variant">Submit your diagnosis, clinical notes, and imaging data through our HIPAA-compliant portal.</p>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-tertiary shadow-sm hover:shadow-md transition-all">
          <span className="material-symbols-outlined text-tertiary mb-4 text-3xl">stethoscope</span>
          <h3 className="text-lg font-bold mb-2">2. Specialist Matching</h3>
          <p className="text-sm text-on-surface-variant">Our team assigns your case to a senior consultant specifically experienced in your condition.</p>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-secondary shadow-sm hover:shadow-md transition-all">
          <span className="material-symbols-outlined text-secondary mb-4 text-3xl">verified_user</span>
          <h3 className="text-lg font-bold mb-2">3. Detailed Report</h3>
          <p className="text-sm text-on-surface-variant">Receive a comprehensive medical report within 3-5 business days including treatment validation.</p>
        </div>
      </div>

      {/* Focused Request Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Request Form (Primary Card) */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 lg:p-12 rounded-xl shadow-sm">
          <div className="mb-10">
            <h4 className="text-2xl font-bold text-on-surface mb-2">Opinion Request Form</h4>
            <p className="text-on-surface-variant">Please provide as much detail as possible to ensure accuracy.</p>
          </div>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Diagnosis Section */}
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Current Diagnosis</label>
              <input className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-400 focus:outline-none" placeholder="e.g. Stage II Breast Cancer, Grade 3" type="text" />
            </div>
            {/* Scans & Files */}
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Clinical Records &amp; Scans (MRI/CT/PET)</label>
              <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-10 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container hover:border-primary/50 transition-all group cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-outline mb-3 group-hover:text-primary transition-colors">cloud_upload</span>
                <p className="text-sm font-medium text-on-surface">Drag and drop files or <span className="text-primary underline">browse computer</span></p>
                <p className="text-xs text-on-surface-variant mt-2">Maximum file size 500MB. Supported: DICOM, PDF, JPG, PNG.</p>
              </div>
            </div>
            {/* Specific Questions */}
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Specific Questions for the Doctor</label>
              <textarea className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-400 focus:outline-none" placeholder="What are your primary concerns? Do you have questions about specific treatment options?" rows={4}></textarea>
            </div>
            {/* Action */}
            <div className="pt-4">
              <button className="w-full lg:w-auto bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2" type="submit">
                Request Medical Review
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sticky Sidebar Info (Secondary Surface) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low p-8 rounded-xl">
            <h5 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              Privacy &amp; Security
            </h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Your health data is encrypted using military-grade AES-256 standards. Only your assigned specialist and our medical director will have access to your records.
            </p>
          </div>
          <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
            <h5 className="text-lg font-bold mb-4">Why CureSureMedico?</h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-on-surface-variant">Access to board-certified specialists from top US and EU clinics.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-on-surface-variant">Validated clinical research-backed opinions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-on-surface-variant">Concierge support for any follow-up inquiries.</span>
              </li>
            </ul>
          </div>
          <div className="p-8 rounded-xl bg-slate-900 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <h5 className="text-lg font-bold mb-2">Need help?</h5>
              <p className="text-sm text-slate-300 mb-6">Our patient advocates are available 24/7 to assist with your documentation.</p>
              <button className="bg-white text-slate-900 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">Start Live Chat</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">support_agent</span>
          </div>
        </div>
      </div>
    </section>
  );
}
