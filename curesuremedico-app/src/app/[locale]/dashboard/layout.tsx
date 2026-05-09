"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex w-full min-h-screen bg-surface items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-on-surface-variant font-medium animate-pulse">Loading secure portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-surface">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed h-screen w-64 left-0 top-0 bg-slate-50 border-r border-slate-100 flex-col p-4 z-40 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
        <div className="flex justify-between items-center mb-8 px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="CureSureMedico Logo" className="h-8 object-contain" />
            <div>
              <h2 className="text-xl font-bold tracking-tighter">
                <span className="text-blue-800 dark:text-blue-400">Cure</span>
                <span className="text-emerald-600 dark:text-emerald-400">Sure</span>
                <span className="text-blue-800 dark:text-blue-400">Medico</span>
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Medical Tourism Excellence</p>
            </div>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'}`}>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">dashboard</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard/consultation" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${pathname.startsWith('/dashboard/consultation') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'}`}>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">calendar_today</span>
            <span className="text-sm font-medium">Book a Consultation</span>
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard/enquiries" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${pathname.startsWith('/dashboard/enquiries') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'}`}>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chat_bubble</span>
            <span className="text-sm font-medium">My Enquiries</span>
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard/second-opinion" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${pathname.startsWith('/dashboard/second-opinion') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'}`}>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">assignment_turned_in</span>
            <span className="text-sm font-medium">Second Opinion</span>
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard/records" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${pathname.startsWith('/dashboard/records') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'}`}>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">folder_shared</span>
            <span className="text-sm font-medium">Medical Records</span>
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-slate-600 hover:text-error transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 flex-1 min-h-screen pb-16 md:pb-0">
        {/* Top App Bar */}
        <header className="w-full sticky top-0 z-20 bg-white/80 backdrop-blur-md px-6 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link href="/" className="flex items-center gap-2 md:hidden hover:opacity-80">
              <h1 className="text-lg font-bold tracking-tighter">
                <span className="text-blue-800">Cure</span>
                <span className="text-emerald-600">Sure</span>
              </h1>
            </Link>
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-64" placeholder="Search records..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+919148297106" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-xs font-bold hover:bg-red-100 transition-colors">
              <span className="material-symbols-outlined text-sm">emergency</span>
              Emergency Support: +91 91482 97106
            </a>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="material-symbols-outlined p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
                  notifications
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors bg-blue-50/30">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 text-blue-700 rounded-full shrink-0">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Welcome to CureSureMedico</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Your secure patient portal is now active. You can start booking consultations.</p>
                            <p className="text-[9px] font-bold text-blue-600 mt-2 uppercase tracking-widest">Just now</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full shrink-0">
                            <span className="material-symbols-outlined text-sm">upload_file</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Upload Medical Records</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">To help our specialists evaluate your case faster, please upload your past medical reports.</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Close Menu</button>
                    </div>
                  </div>
                )}
              </div>
              <button className="material-symbols-outlined p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">help_outline</button>
            </div>
            <img 
              alt="Patient Profile Avatar" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGyUaTTKBTFJJpV9ZJRzwOZli2xxeYkbsvIvrMY07PijIBiRNhWnCCUw4M1Az1GQpYFkyrsgXNxZYrPn5UuUzJ2VtRoMDR8gbjHMw6d1RjDfELH9NwdX1eshECale6R8LTJYBb3ZzGEwM3-lFWl0gAeNDKWpBIoTPdFw2KEz3E0yJHQusq2ct2O8W5fU-iAcxhj0pxtkicFVcV-r5mFKYbZrJ2l48ALFZIOdueOK3IteunMD605OKGrOVHB98JP46gN_5Nu5DKlbw" 
            />
          </div>
        </header>

        {/* Dynamic Content */}
        {children}
      </main>
    </div>
  );
}
