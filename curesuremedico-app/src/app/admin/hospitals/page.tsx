"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('hospitals').select('*').order('id', { ascending: false });
    if (data) setHospitals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      await supabase.from('hospitals').delete().eq('id', id);
      fetchHospitals();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Hospitals</h1>
          <p className="text-slate-600">Manage your partner hospitals and clinics.</p>
        </div>
        <Link href="/admin/hospitals/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center shadow-sm">
          <span className="material-symbols-outlined mr-2">add</span>
          Add Hospital
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading hospitals...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Hospital Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 mr-3 flex-shrink-0">
                          {hospital.image_url ? (
                            <img src={hospital.image_url} alt={hospital.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-slate-400">local_hospital</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{hospital.name}</div>
                          <div className="text-xs text-slate-500 max-w-xs truncate">{hospital.accreditations?.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-900">{hospital.city}</div>
                      <div className="text-xs text-slate-500">{hospital.country}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-500 text-sm font-bold">
                        <span className="material-symbols-outlined text-sm mr-1">star</span>
                        {hospital.rating} <span className="text-slate-400 text-xs ml-1 font-normal">({hospital.reviews_count})</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/hospitals/${hospital.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(hospital.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {hospitals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No hospitals found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
