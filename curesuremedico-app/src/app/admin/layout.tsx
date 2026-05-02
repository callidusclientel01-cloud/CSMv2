"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { AdminProvider } from "@/components/admin/AdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (typeof window !== "undefined") {
        const storedKey = localStorage.getItem("csm_admin_auth");
        const validKeysStr = process.env.NEXT_PUBLIC_ADMIN_KEY || "CSMAdmin2024!";
        const validKeys = validKeysStr.split(",").map(k => k.trim());
        
        if (!storedKey) {
          if (pathname !== "/admin/login") {
            window.location.href = "/admin/login";
          } else {
            setLoading(false);
          }
          return;
        }

        if (validKeys.includes(storedKey)) {
          setSession({ role: "superadmin", permissions: ["all"] });
          setLoading(false);
        } else {
          try {
            const { data, error } = await supabase
              .from('admin_users')
              .select('*')
              .eq('auth_key', storedKey)
              .single();

            if (data && !error) {
              setSession({ role: "admin", permissions: data.permissions || [] });
              
              // Verify access to current path
              if (pathname !== "/admin" && pathname !== "/admin/login") {
                 const hasAccess = data.permissions.some((perm: string) => (pathname || "").startsWith(perm));
                 if (!hasAccess) {
                   router.push("/admin");
                   return;
                 }
              }

              setLoading(false);
            } else {
              localStorage.removeItem("csm_admin_auth");
              if (pathname !== "/admin/login") {
                window.location.href = "/admin/login";
              } else {
                setLoading(false);
              }
            }
          } catch (err) {
            console.error(err);
            if (pathname !== "/admin/login") {
              window.location.href = "/admin/login";
            } else {
              setLoading(false);
            }
          }
        }
      }
    };
    
    verifyAuth();
  }, [pathname, router]);

  const allMenuItems = [
    { name: "Overview", path: "/admin", icon: "dashboard" },
    { name: "Users", path: "/admin/users", icon: "group", superadminOnly: true },
    { name: "Hospitals", path: "/admin/hospitals", icon: "local_hospital" },
    { name: "Treatments", path: "/admin/treatments", icon: "medical_services" },
    { name: "Destinations", path: "/admin/destinations", icon: "flight_takeoff" },
    { name: "Packages", path: "/admin/packages", icon: "card_giftcard" },
    { name: "Patient Stories", path: "/admin/patient-stories", icon: "video_library" },
    { name: "Blog", path: "/admin/blog", icon: "article" },
    { name: "Leads/Inquiries", path: "/admin/leads", icon: "forum" },
  ];

  const menuItems = session ? allMenuItems.filter((item) => {
    if (session.role === "superadmin") return true;
    if (item.superadminOnly) return false;
    if (item.path === "/admin") return true;
    return session.permissions.includes(item.path);
  }) : [];

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-bold tracking-widest text-sm uppercase">Verifying Access...</div>;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session) {
    return <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-bold tracking-widest text-sm uppercase">Redirecting...</div>;
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
          <AdminProvider session={session}>
            {children}
          </AdminProvider>
        </div>
      </main>
    </div>
  );
}
