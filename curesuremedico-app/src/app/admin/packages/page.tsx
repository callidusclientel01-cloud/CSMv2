"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('packages').select('*').order('id', { ascending: false });
    if (data) setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      await supabase.from('packages').delete().eq('id', id);
      fetchPackages();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Packages</h1>
          <p className="text-slate-600">Manage promotional medical packages.</p>
        </div>
        <Link href="/admin/packages/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center shadow-sm">
          <span className="material-symbols-outlined mr-2">add</span>
          Add Package
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading packages...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Package Title</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200 mr-3 flex-shrink-0">
                          {pkg.image_url ? (
                            <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-slate-400">image</span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900">{pkg.title}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-900">{pkg.badge_text || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-900">{pkg.price}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/packages/${pkg.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(pkg.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No packages found.</td>
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
