"use client";
import React, { useEffect, useState, use } from "react";
import DestinationForm from "../DestinationForm";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      const { data } = await supabase.from('destinations').select('*').eq('id', unwrappedParams.id).single();
      setDestination(data);
      setLoading(false);
    };
    fetchDestination();
  }, [unwrappedParams.id]);

  return (
    <div className="min-h-screen bg-slate-50 px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 xs:mb-8 sm:mb-10 flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 sm:gap-6">
          <Link 
            href="/admin/destinations" 
            className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 xs:w-10 xs:h-10 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
            title="Back to destinations"
            aria-label="Go back to destinations list"
          >
            <span className="material-symbols-outlined text-2xl xs:text-xl">arrow_back</span>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5 xs:mb-1 sm:mb-2 leading-snug">
              Edit Destination
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Update the information for this medical tourism destination.
            </p>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="p-6 xs:p-8 sm:p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-slate-400" aria-hidden="true">refresh</span>
              <span className="text-xs xs:text-sm sm:text-base font-medium">Loading destination data...</span>
            </div>
          </div>
        ) : destination ? (
          <DestinationForm initialData={destination} />
        ) : (
          <div className="bg-rose-50 text-rose-600 p-6 xs:p-8 sm:p-10 rounded-2xl font-medium border border-rose-100 flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4">
            <span className="material-symbols-outlined text-3xl xs:text-2xl flex-shrink-0" aria-hidden="true">error</span>
            <span className="text-xs xs:text-sm sm:text-base">Destination not found in the database.</span>
          </div>
        )}
      </div>
    </div>
  );
}
