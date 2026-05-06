"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [documentsCount, setDocumentsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }

      // Load enquiries
      const { data: enqData } = await supabase
        .from('enquiries')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
        
      if (enqData) setEnquiries(enqData);

      // Load documents count
      const { count } = await supabase
        .from('patient_documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (count !== null) setDocumentsCount(count);
    }
    loadData();
  }, []);

  // Compute roadmap phase (1 to 5) based on latest enquiry
  const latestEnquiry = enquiries[0];
  let currentPhase = 0; // 0 means no roadmap started
  if (latestEnquiry) {
    const status = latestEnquiry.status.toLowerCase();
    if (status.includes('quote received')) {
        currentPhase = 2;
    } else if (status.includes('visa')) {
        currentPhase = 3;
    } else if (status.includes('treatment')) {
        currentPhase = 4;
    } else if (status.includes('recovery')) {
        currentPhase = 5;
    } else {
        currentPhase = 1; // Default to Inquiry for "Pending Review" or "Awaiting Quote"
    }
  }

  const getPhaseStyles = (phaseNumber: number, currentPhase: number) => {
    if (phaseNumber < currentPhase) { // Completed
        return {
            bg: "bg-secondary text-white ring-4 ring-slate-50",
            icon: "check",
            textColor: "text-on-surface",
            subText: "Done"
        };
    } else if (phaseNumber === currentPhase) { // Active
        return {
            bg: "bg-primary text-white ring-8 ring-blue-100",
            icon: "hourglass_empty", // You can customize per phase if needed
            textColor: "text-primary font-bold",
            subText: "In Progress"
        };
    } else { // Future
        return {
            bg: "bg-slate-200 text-slate-400 ring-4 ring-slate-50",
            icon: phaseNumber === 4 ? "medical_services" : "exercise",
            textColor: "text-slate-400",
            subText: "Pending"
        };
    }
  };

  const getProgressWidth = (phase: number) => {
    if (phase <= 1) return "0%";
    if (phase === 2) return "25%";
    if (phase === 3) return "50%";
    if (phase === 4) return "75%";
    return "100%";
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Welcome, {userName}.</h2>
          <p className="text-on-surface-variant text-lg">Your journey to health is our priority.</p>
        </div>
      </section>

      {/* Bento Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-on-surface">{enquiries.length}</p>
            <p className="text-on-surface-variant font-medium">Active Enquiries</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-on-surface">0</p>
            <p className="text-on-surface-variant font-medium">Upcoming Appointment</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container text-on-tertiary-container rounded-lg">
              <span className="material-symbols-outlined">description</span>
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-on-surface">{documentsCount}</p>
            <p className="text-on-surface-variant font-medium">Records Uploaded</p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <h3 className="text-lg font-bold text-on-surface mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">route</span>
          Your Medical Roadmap
        </h3>
        
        {currentPhase > 0 ? (
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 rounded-full">
                <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: getProgressWidth(currentPhase) }}></div>
              </div>
              {/* Steps flex */}
              <div className="relative flex justify-between">
                {[ 
                    { id: 1, label: "Inquiry" },
                    { id: 2, label: "Quote" },
                    { id: 3, label: "Visa" },
                    { id: 4, label: "Treatment" },
                    { id: 5, label: "Recovery" }
                ].map((step) => {
                    const style = getPhaseStyles(step.id, currentPhase);
                    return (
                        <div key={step.id} className="flex flex-col items-center text-center max-w-[100px] z-10 w-1/5">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 relative z-10 ${style.bg}`}>
                            {style.icon === 'check' ? (
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">{style.icon}</span>
                            )}
                          </div>
                          <span className={`text-xs ${style.textColor}`}>{step.label}</span>
                          {style.subText && <span className="text-[10px] opacity-70">{style.subText}</span>}
                        </div>
                    );
                })}
              </div>
            </div>
        ) : (
            <div className="text-center py-6">
                <p className="text-on-surface-variant">You have not started your medical journey yet.</p>
                <Link href="/dashboard/consultation" className="inline-block mt-4 text-sm bg-primary text-white px-4 py-2 rounded-full">Start a Request</Link>
            </div>
        )}
      </section>

      {/* Main Content Area: Enquiries & Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-on-surface tracking-tight">Recent Enquiries</h3>
            <Link href="/dashboard/enquiries" className="text-sm font-bold text-primary hover:underline transition-all">View all</Link>
          </div>
          <div className="space-y-3">
            {enquiries.length === 0 ? (
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-dashed border-outline-variant/30 text-center text-on-surface-variant flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl opacity-50">inbox</span>
                  <p>No recent enquiries found.</p>
                </div>
            ) : (
                enquiries.slice(0, 3).map((enquiry) => (
                    <div key={enquiry.id} className="group bg-surface-container-lowest p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between border border-transparent hover:border-slate-100 hover:shadow-md transition-all duration-300 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                           <span className="material-symbols-outlined text-2xl">medical_information</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{enquiry.inquiry_type || 'Consultation Request'}</h4>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1">
                            {enquiry.hospital_name || 'Destination specific'}
                          </p>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <div className={`px-3 py-1 text-[10px] font-bold rounded-full mb-1 inline-block ${
                            enquiry.status === 'Closed' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {enquiry.status || 'Awaiting Quote'}
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          Submitted on {new Date(enquiry.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-on-surface">Quick Actions</h4>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/dashboard/consultation" className="flex items-center justify-start gap-3 w-full p-3 bg-white rounded-lg text-sm text-on-surface font-medium hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-primary">add_box</span>
                Book a Consultation
              </Link>
              <Link href="/dashboard/records" className="flex items-center justify-start gap-3 w-full p-3 bg-white rounded-lg text-sm text-on-surface font-medium hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-primary">cloud_upload</span>
                Upload New Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
