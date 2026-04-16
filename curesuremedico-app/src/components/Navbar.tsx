"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      <div className="bg-primary px-8 border-b border-primary-container">
        <div className="max-w-screen-2xl mx-auto h-10 flex justify-between items-center text-xs font-semibold text-white/90">
          <div className="flex items-center gap-4">
            <span className="text-white/80 hidden sm:inline-block">📞 +91 44 2829 0203 (International)</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">language</span>
              <select className="bg-transparent text-white border-none py-1 pr-6 pl-1 focus:ring-0 cursor-pointer text-xs font-semibold">
                <option className="text-on-surface" value="en">English</option>
                <option className="text-on-surface" value="fr">Français</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">payments</span>
              <select className="bg-transparent text-white border-none py-1 pr-6 pl-1 focus:ring-0 cursor-pointer text-xs font-semibold">
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
      <nav className="flex justify-between items-center h-20 px-8 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo requires it to be inside public folder, we will copy logo.png to next app public folder */}
          <img src="/logo.png" alt="CureSureMedico Logo" className="h-10 object-contain" />
          <div className="text-2xl font-bold tracking-tighter text-blue-800 dark:text-blue-300">
            <span className="text-blue-800 dark:text-blue-400">Cure</span>
            <span className="text-emerald-600 dark:text-emerald-400">Sure</span>
            <span className="text-blue-800 dark:text-blue-400">Medico</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
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
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-surface-container-highest rounded-full px-4 py-2">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input className="bg-transparent border-none focus:outline-none text-sm placeholder:text-on-surface-variant w-40" placeholder="Search insights..." type="text" />
          </div>
          <Link href="/quote" className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all">
            Get a Quote
          </Link>
          
          {/* Profile Dropdown */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center p-2 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors border border-outline-variant/30"
            >
              <div className="flex items-center text-on-surface-variant gap-1">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-outline-variant/20 py-2 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
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
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
