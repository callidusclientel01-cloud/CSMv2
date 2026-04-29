import React from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch basic counts for the overview dashboard
  const [hospitalsRes, treatmentsRes, destinationsRes, leadsRes] = await Promise.all([
    supabase.from('hospitals').select('*', { count: 'exact', head: true }),
    supabase.from('treatments').select('*', { count: 'exact', head: true }),
    supabase.from('destinations').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
  ]);

  if (hospitalsRes.error) console.error("Error fetching hospitals count:", hospitalsRes.error);
  if (treatmentsRes.error) console.error("Error fetching treatments count:", treatmentsRes.error);
  
  const hospitalsCount = hospitalsRes.count || 0;
  const treatmentsCount = treatmentsRes.count || 0;
  const destinationsCount = destinationsRes.count || 0;
  const leadsCount = leadsRes.count || 0;

  const statCards = [
    { title: "Total Hospitals", count: hospitalsCount || 0, icon: "local_hospital", color: "bg-blue-500", link: "/admin/hospitals" },
    { title: "Total Treatments", count: treatmentsCount || 0, icon: "medical_services", color: "bg-teal-500", link: "/admin/treatments" },
    { title: "Destinations", count: destinationsCount || 0, icon: "flight_takeoff", color: "bg-indigo-500", link: "/admin/destinations" },
    { title: "New Leads", count: leadsCount || 0, icon: "forum", color: "bg-rose-500", link: "/admin/leads" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Welcome to the CureSureMedico Administration Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link} className="block">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${stat.color} text-white flex items-center justify-center`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-1">{stat.count}</h3>
              <p className="text-slate-500 font-medium">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/admin/hospitals/new" className="flex items-center p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                <span className="material-symbols-outlined">add</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Add New Hospital</h4>
                <p className="text-sm text-slate-500">Create a new hospital profile with details and images.</p>
              </div>
            </Link>
            <Link href="/admin/treatments/new" className="flex items-center p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mr-4">
                <span className="material-symbols-outlined">add</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Add New Treatment</h4>
                <p className="text-sm text-slate-500">Add a new medical procedure or treatment category.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-green-500 mr-3">check_circle</span>
                <span className="font-medium text-slate-900">Database Connection</span>
              </div>
              <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-green-500 mr-3">cloud_done</span>
                <span className="font-medium text-slate-900">Website Status</span>
              </div>
              <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Live</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-blue-500 mr-3">update</span>
                <span className="font-medium text-slate-900">Last Content Update</span>
              </div>
              <span className="text-sm text-slate-500">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
