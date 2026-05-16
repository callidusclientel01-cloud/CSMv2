"use client";
import React, { useEffect, useState, use } from "react";
import DestinationForm from "../DestinationForm";
import Link from "next/link";
import { useLocale } from "next-intl";
import { supabase } from "@/utils/supabaseClient";

export default function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const locale = useLocale();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', unwrappedParams.id)
          .single();
        
        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Destination not found.');
          } else if (fetchError.code === 'PGRST204') {
            setError('Access denied. Check your permissions.');
          } else {
            setError(`Error: ${fetchError.message}`);
          }
          setDestination(null);
        } else {
          setDestination(data);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        setDestination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [unwrappedParams.id]);

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section - Mobile First */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6">
          <Link 
            href={`/${locale}/admin/destinations`}
            className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300"
            title="Back to destinations"
            aria-label="Go back to destinations list"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">arrow_back</span>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 md:mb-2 leading-snug">
              Edit Destination
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
              Update the information for this medical tourism destination.
            </p>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="p-6 sm:p-8 md:p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-2xl sm:text-3xl text-slate-400" aria-hidden="true">refresh</span>
              <span className="text-xs sm:text-sm md:text-base font-medium">Loading destination data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-600 p-6 sm:p-8 md:p-10 rounded-2xl font-medium border border-rose-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="material-symbols-outlined text-2xl sm:text-3xl flex-shrink-0" aria-hidden="true">error</span>
            <span className="text-xs sm:text-sm md:text-base">{error}</span>
            <Link 
              href={`/${locale}/admin/destinations`}
              className="ml-auto text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 underline whitespace-nowrap"
            >
              Back to list →
            </Link>
          </div>
        ) : destination ? (
          <DestinationForm initialData={destination} />
        ) : null}
      </div>
    </div>
  );
}
