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
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <Link href="/admin/destinations" className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 break-words">Edit Destination</h1>
            <p className="text-sm sm:text-base text-slate-600 break-words">Update the information for this medical tourism destination.</p>
          </div>
        </div>

        {loading ? (
          <div className="p-6 sm:p-10 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">Loading destination data...</div>
        ) : destination ? (
          <DestinationForm initialData={destination} />
        ) : (
          <div className="bg-rose-50 text-rose-600 p-6 sm:p-8 rounded-2xl font-medium border border-rose-100 break-words">Destination not found in the database.</div>
        )}
      </div>
    </div>
  );
}
