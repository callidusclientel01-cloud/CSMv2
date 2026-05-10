"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Enquiry {
  id: string;
  inquiry_id: string;
  inquiry_type: string;
  status: string;
  hospital_name?: string;
  submitted_at: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimelineEnq, setSelectedTimelineEnq] = useState<Enquiry | null>(null);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("enquiries")
          .select("*")
          .eq("user_id", user.id)
          .order("submitted_at", { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setEnquiries(data);
        } else {
          // Keep a basic mockup if no real DB data yet so the UI doesn't look completely empty for testing
          setEnquiries([
            {
              id: "mock1",
              inquiry_id: "ENQ-2024-8891",
              inquiry_type: "Cardiac Consultation Review",
              status: "Awaiting Quote",
              submitted_at: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching enquiries:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEnquiries();
  }, []);

  const activeCount = enquiries.filter(e => e.status !== "Closed").length;
  const closedCount = enquiries.filter(e => e.status === "Closed").length;
  const pendingQuotes = enquiries.filter(e => e.status === "Awaiting Quote").length;

  return (
    <section className="pt-24 pb-12 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">My Enquiries</h2>
        <p className="text-on-surface-variant max-w-2xl">Track and manage your medical consultations, quotes, and hospital coordination requests from our clinical network.</p>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="col-span-1 md:col-span-2 bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-1">Active Coordination</p>
            <h3 className="text-3xl font-bold">{activeCount} Enquiries</h3>
            <p className="text-xs mt-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Average response time: 4 hours
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-9xl">clinical_notes</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-secondary">check_circle</span>
            <span className="text-2xl font-bold text-on-surface">{closedCount}</span>
          </div>
          <p className="text-sm font-semibold text-on-surface-variant">Closed Cases</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-tertiary">request_quote</span>
            <span className="text-2xl font-bold text-on-surface">{pendingQuotes}</span>
          </div>
          <p className="text-sm font-semibold text-on-surface-variant">Pending Quotes</p>
        </div>
      </div>

      {/* Enquiry Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-5 py-2 bg-secondary text-on-secondary rounded-full text-sm font-medium whitespace-nowrap">All Enquiries</button>
        <button className="px-5 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full text-sm font-medium whitespace-nowrap">In Progress</button>
        <button className="px-5 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full text-sm font-medium whitespace-nowrap">Awaiting Quote</button>
        <button className="px-5 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full text-sm font-medium whitespace-nowrap">Completed</button>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-primary-fixed">Loading your enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant bg-surface-container-low rounded-xl">You have no active enquiries.</div>
        ) : (
          enquiries.map((enq) => (
            <div key={enq.id} className={`bg-surface-container-lowest rounded-xl p-1 transition-all border border-outline-variant/5 ${enq.status === 'Closed' ? 'opacity-75 bg-surface-container-lowest/60 border-outline-variant/10' : 'shadow-sm hover:shadow-md'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className={`p-6 lg:w-1/4 rounded-lg lg:rounded-r-none flex flex-col justify-between ${enq.status === 'Closed' ? 'bg-surface-container-low/40' : 'bg-surface-container-low'}`}>
                  <div>
                    <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${enq.status === 'Closed' ? 'text-on-surface-variant' : 'text-primary'}`}>
                      ID: {enq.inquiry_id || "ENQ-NEW"}
                    </p>
                    <h4 className="text-lg font-bold text-on-surface leading-tight">{enq.inquiry_type}</h4>
                    {enq.hospital_name && <p className="text-sm font-medium text-primary mt-1">{enq.hospital_name}</p>}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-4">
                    {enq.status === 'Closed' ? 'Completed: ' : 'Submitted: '}
                    {new Date(enq.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${
                      enq.status === 'Closed' ? 'bg-on-surface-variant/10 text-on-surface-variant' :
                      enq.status === 'Quote Received' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary/10 text-secondary'
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {enq.status === 'Closed' ? 'archive' : enq.status === 'Quote Received' ? 'payments' : 'local_hospital'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-tighter">Status</p>
                      <div className="flex items-center gap-2">
                        {enq.status !== 'Closed' && enq.status !== 'Quote Received' && <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>}
                        <span className={`text-sm font-bold ${
                          enq.status === 'Closed' ? 'text-on-surface-variant' :
                          enq.status === 'Quote Received' ? 'text-tertiary' : 'text-secondary'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {enq.status === 'Closed' ? (
                     <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95">View Archive</button>
                  ) : enq.status === 'Quote Received' ? (
                     <div className="flex gap-2">
                      <button className="bg-tertiary text-on-tertiary px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95">Review Quote</button>
                      <button onClick={() => setSelectedTimelineEnq(enq)} className="p-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center" title="View Timeline">
                        <span className="material-symbols-outlined">timeline</span>
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedTimelineEnq(enq)} className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:bg-primary-container active:scale-95">View Timeline</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State Suggestion */}
      <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-white rounded-2xl shadow-sm rotate-3">
          <span className="material-symbols-outlined text-4xl text-primary">psychology_alt</span>
        </div>
        <div>
          <h5 className="text-lg font-bold text-on-surface">Looking for something else?</h5>
          <p className="text-on-surface-variant text-sm mt-1 max-w-xl">If you need to start a new enquiry or request a second opinion from our international network of medical specialists, please use the button in the dashboard or contact your dedicated advisor.</p>
        </div>
        <button onClick={() => window.open('https://wa.me/919148297106', '_blank')} className="ml-auto bg-white text-primary border border-primary/20 px-6 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all whitespace-nowrap">Contact Support</button>
      </div>

      {/* Timeline Modal */}
      {selectedTimelineEnq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Enquiry Timeline</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">{selectedTimelineEnq.inquiry_id || 'Tracking Progress'}</p>
              </div>
              <button onClick={() => setSelectedTimelineEnq(null)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <div className="relative border-l-2 border-surface-container-highest ml-4 space-y-8 pb-4">
                {(() => {
                  let currentStep = 0;
                  const s = selectedTimelineEnq.status;
                  if (s === 'In Progress') currentStep = 1;
                  else if (s === 'Quote Received') currentStep = 2;
                  else if (s === 'Completed' || s === 'Closed') currentStep = 3;

                  const steps = [
                    {
                      title: "Request Submitted",
                      description: `We received your request on ${new Date(selectedTimelineEnq.submitted_at).toLocaleDateString()}.`,
                      icon: "inbox",
                      isCompleted: currentStep >= 0,
                      isActive: currentStep === 0
                    },
                    {
                      title: "Clinical Review",
                      description: "Our medical team is evaluating your case and coordinating with specialists.",
                      icon: "clinical_notes",
                      isCompleted: currentStep >= 1,
                      isActive: currentStep === 1
                    },
                    {
                      title: "Quote Ready",
                      description: "Your personalized treatment plan and estimated cost are ready for review.",
                      icon: "request_quote",
                      isCompleted: currentStep >= 2,
                      isActive: currentStep === 2
                    },
                    {
                      title: "Treatment Booked",
                      description: "Coordination complete. We are preparing for your arrival and journey.",
                      icon: "flight_takeoff",
                      isCompleted: currentStep >= 3,
                      isActive: currentStep === 3
                    }
                  ];

                  return steps.map((step, idx) => (
                    <div key={idx} className={`relative pl-8 transition-opacity duration-500 ${!step.isCompleted && !step.isActive ? 'opacity-40' : 'opacity-100'}`}>
                      {/* Node circle */}
                      <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest ${
                        step.isActive 
                          ? 'bg-primary text-on-primary shadow-[0_0_0_4px_rgba(var(--color-primary),0.2)] animate-pulse' 
                          : step.isCompleted 
                            ? 'bg-secondary text-on-secondary' 
                            : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {step.isCompleted && !step.isActive ? (
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">{step.icon}</span>
                        )}
                      </div>
                      
                      <div className="pt-1">
                        <h4 className={`text-base font-bold ${step.isActive ? 'text-primary' : 'text-on-surface'}`}>{step.title}</h4>
                        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/10 flex justify-end">
              <button onClick={() => setSelectedTimelineEnq(null)} className="px-6 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-full transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
