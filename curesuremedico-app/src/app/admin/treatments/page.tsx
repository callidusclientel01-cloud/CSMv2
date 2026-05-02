"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function AdminTreatments() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatments = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('treatments').select('*').order('id', { ascending: false });
    if (data) setTreatments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this treatment?")) {
      await supabase.from('treatments').delete().eq('id', id);
      fetchTreatments();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Treatments</h1>
          <p className="text-slate-600">Manage medical specialties and treatments.</p>
        </div>
        <Link href="/admin/treatments/new" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center shadow-sm">
          <span className="material-symbols-outlined mr-2">add</span>
          Add Treatment
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading treatments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Treatment Name</th>
                  <th className="p-4">Short Description</th>
                  <th className="p-4">Starting Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {treatments.map((treatment) => (
                  <tr key={treatment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 mr-3 flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined">{treatment.icon_name || 'medical_services'}</span>
                        </div>
                        <div className="font-bold text-slate-900">{treatment.name}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600 max-w-md truncate">{treatment.short_description}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-900">{treatment.starting_price}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        treatment.status === 'published' ? 'bg-green-100 text-green-800' : 
                        treatment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {treatment.status || 'draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/treatments/${treatment.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(treatment.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {treatments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No treatments found.</td>
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
