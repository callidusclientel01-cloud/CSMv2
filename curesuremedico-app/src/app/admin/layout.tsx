"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const menuItems = [
    { name: "Overview", path: "/admin", icon: "dashboard" },
    { name: "Hospitals", path: "/admin/hospitals", icon: "local_hospital" },
    { name: "Treatments", path: "/admin/treatments", icon: "medical_services" },
    { name: "Destinations", path: "/admin/destinations", icon: "flight_takeoff" },
    { name: "Blog", path: "/admin/blog", icon: "article" },
    { name: "Leads/Inquiries", path: "/admin/leads", icon: "forum" },
  ];

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-bold tracking-widest text-sm uppercase">Verifying Access...</div>;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white">
        <div className="p-6">
          <Link href="/admin" className="text-2xl font-bold text-white flex items-center">
            <span className="text-blue-400 mr-2">CSM</span> Admin
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            // Exact match for Overview to prevent it from being always active
            const isStrictlyActive = item.path === "/admin" ? pathname === "/admin" : isActive;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isStrictlyActive 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined mr-3">arrow_back</span>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50">
        <Link href="/admin" className="text-xl font-bold">
          <span className="text-blue-400">CSM</span> Admin
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-900 text-white z-40 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              const isStrictlyActive = item.path === "/admin" ? pathname === "/admin" : isActive;
              
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-4 rounded-xl ${
                    isStrictlyActive ? "bg-blue-600" : "hover:bg-slate-800"
                  }`}
                >
                  <span className="material-symbols-outlined mr-4">{item.icon}</span>
                  <span className="font-bold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
