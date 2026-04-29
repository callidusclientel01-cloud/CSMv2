"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      await supabase.from('leads').delete().eq('id', id);
      fetchLeads();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Inquiries (Leads)</h1>
          <p className="text-slate-600">Review and manage contact requests and quote inquiries from patients.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-100 flex items-center">
          <span className="material-symbols-outlined mr-2">group</span>
          {leads.length} Total Leads
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading patient leads...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Date</th>
                  <th className="p-4">Patient Details</th>
                  <th className="p-4">Medical Interest</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-sm text-blue-600 flex items-center mt-1">
                        <span className="material-symbols-outlined text-[14px] mr-1">mail</span>
                        <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                      </div>
                      <div className="text-sm text-green-600 flex items-center mt-1">
                        <span className="material-symbols-outlined text-[14px] mr-1">call</span>
                        <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold inline-block">
                        {lead.condition || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700 flex items-center">
                        <span className="material-symbols-outlined text-[16px] text-slate-400 mr-1">flight_takeoff</span>
                        {lead.preferred_destination || 'Not specified'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600 max-w-xs break-words bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {lead.notes ? lead.notes : <span className="italic text-slate-400">No additional notes provided.</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(lead.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Lead">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">inbox</span>
                      <div className="text-slate-500 font-medium">No patient leads found.</div>
                      <div className="text-sm text-slate-400 mt-1">When patients fill out contact forms, they will appear here.</div>
                    </td>
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
