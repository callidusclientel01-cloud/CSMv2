"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      const { supabase } = await import('@/utils/supabaseClient');
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
      });
      return () => authListener.subscription.unsubscribe();
    }
    loadUser();

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.startsWith("/dashboard")) return null;

  const links = [
    { name: "Home", href: "/" },
    { name: "Treatments", href: "/treatments" },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Destinations", href: "/destinations" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-primary px-4 md:px-8 border-b border-primary-container">
        <div className="max-w-screen-2xl mx-auto h-10 flex justify-between items-center text-xs font-semibold text-white/90">
          <div className="flex items-center gap-4">
            <span className="text-white/80 hidden sm:inline-block">📞 +91 44 2829 0203 (International)</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">language</span>
              <select className="bg-transparent text-white border-none py-1 pr-4 pl-1 focus:ring-0 cursor-pointer text-xs font-semibold">
                <option className="text-on-surface" value="en">English</option>
                <option className="text-on-surface" value="fr">Français</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">payments</span>
              <select className="bg-transparent text-white border-none py-1 pr-4 pl-1 focus:ring-0 cursor-pointer text-xs font-semibold">
                <option className="text-on-surface" value="usd">USD ($)</option>
                <option className="text-on-surface" value="eur">EUR (€)</option>
                <option className="text-on-surface" value="xof">FCFA (CFA)</option>
                <option className="text-on-surface" value="inr">INR (₹)</option>
                <option className="text-on-surface" value="cny">CNY (¥)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex justify-between items-center h-20 px-4 md:px-8 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="CureSureMedico Logo" className="h-8 md:h-10 object-contain" />
          <div className="text-xl md:text-2xl font-bold tracking-tighter text-blue-800 dark:text-blue-300 hidden sm:block">
            <span className="text-blue-800 dark:text-blue-400">Cure</span>
            <span className="text-emerald-600 dark:text-emerald-400">Sure</span>
            <span className="text-blue-800 dark:text-blue-400">Medico</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
            return (
              <Link 
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary font-bold' 
                    : 'text-on-surface-variant hover:text-primary font-medium'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const searchInput = form.elements.namedItem('search') as HTMLInputElement;
              if (searchInput.value.trim()) {
                window.location.href = `/blog?search=${encodeURIComponent(searchInput.value.trim())}`;
              }
            }}
            className="hidden xl:flex items-center bg-surface-container-highest rounded-full px-4 py-2"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input name="search" className="bg-transparent border-none focus:outline-none text-sm placeholder:text-on-surface-variant w-40" placeholder="Search insights..." type="text" />
          </form>
          <Link href="/quote" className="bg-primary text-on-primary px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold text-xs md:text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap">
            Get a Quote
          </Link>
          
          {/* Profile Dropdown */}
          <div className="relative ml-1 md:ml-2" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center p-2 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors border border-outline-variant/30"
            >
              <div className="flex items-center text-on-surface-variant gap-1">
                <span className="material-symbols-outlined text-lg md:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                <span className="material-symbols-outlined text-xs md:text-sm">arrow_drop_down</span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-outline-variant/20 py-2 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-lowest dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">dashboard</span> 
                      <span className="font-medium">Tableau de bord</span>
                    </Link>
                    <button 
                      onClick={async () => {
                        const { supabase } = await import('@/utils/supabaseClient');
                        await supabase.auth.signOut();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-left w-full text-on-surface hover:bg-surface-container-lowest dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span> 
                      <span className="font-medium">Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-lowest dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">login</span> 
                      <span className="font-medium">Se connecter</span>
                    </Link>
                    <Link 
                      href="/login" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-lowest dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_add</span> 
                      <span className="font-medium">Créer compte</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-on-surface-variant flex items-center justify-center bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[120px] left-0 w-full min-h-screen bg-white dark:bg-slate-900 border-t border-outline-variant/20 flex flex-col p-6 flex-1 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-4 rounded-xl text-lg transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'text-on-surface hover:bg-surface-container font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 pt-8 border-t border-outline-variant/20">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Besoin d&apos;assistance ?</p>
            <a href="tel:+914428290203" className="flex items-center gap-3 p-4 bg-secondary-container text-on-secondary-container rounded-xl font-bold">
              <span className="material-symbols-outlined">call</span>
              +91 44 2829 0203
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
