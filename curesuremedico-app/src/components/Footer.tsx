"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 font-inter text-sm leading-relaxed">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand & Description */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CureSureMedico Logo" className="h-10 object-contain" />
            <span className="text-xl font-bold text-blue-800 tracking-tighter">
              <span className="text-blue-800 dark:text-blue-400">Cure</span>
              <span className="text-emerald-600 dark:text-emerald-400">Sure</span>
              <span className="text-blue-800 dark:text-blue-400">Medico</span>
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed max-w-xs">
            Your trusted bridge to global clinical excellence. We coordinate world-class healthcare with precision, compassion, and unwavering integrity for patients worldwide.
          </p>

        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-blue-900 mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
          <ul className="space-y-4 text-slate-600 font-medium">
            <li><Link href="/treatments" className="hover:text-blue-700 transition-colors">Treatments</Link></li>
            <li><Link href="/hospitals" className="hover:text-blue-700 transition-colors">Hospitals</Link></li>
            <li><Link href="/destinations" className="hover:text-blue-700 transition-colors">Destinations</Link></li>
            <li><Link href="#" className="hover:text-blue-700 transition-colors">Partner Hospitals</Link></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h4 className="font-bold text-blue-900 mb-6 uppercase tracking-widest text-xs">Legal &amp; Support</h4>
          <ul className="space-y-4 text-slate-600 font-medium">
            <li><Link href="#" className="hover:text-blue-700 transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-700 transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-blue-700 transition-colors">Africa Support Network</Link></li>
            <li><Link href="#" className="hover:text-blue-700 transition-colors">Sitemap</Link></li>
          </ul>
        </div>

        {/* Our Offices */}
        <div>
          <h4 className="font-bold text-blue-900 mb-6 uppercase tracking-widest text-xs">Our Offices &amp; Contact</h4>
          <div className="space-y-4 text-slate-600 text-xs leading-relaxed">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-700 text-base">location_on</span>
              <div>
                <strong className="text-slate-800">C&ocirc;te d'Ivoire</strong><br />
                Angr&eacute; 8&egrave;me Tranche, Lot 365, llot 025, Appartement C101<br />
                Cocody, Abidjan
              </div>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-700 text-base">location_on</span>
              <div>
                <strong className="text-slate-800">Madagascar</strong><br />
                Lot IIG 20K Bis A, Ambatomaro<br />
                Antananarivo 101
              </div>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-700 text-base">location_on</span>
              <div>
                <strong className="text-slate-800">India</strong><br />
                No.16 Raj Mahal, Extension Gadikoppa<br />
                Shivamogga, Karnataka, 577205
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <span className="material-symbols-outlined text-blue-700 text-base mt-0.5">call</span>
              <div>
                +91 91482 97106<br />
                +261 38 25 819 47
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-blue-700 text-base">mail</span>
              <a href="mailto:contact@cureSureMedico.com" className="hover:text-blue-700 transition-colors">contact@cureSureMedico.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-slate-400 text-xs">&copy; 2026 CureSureMedico - Medical Tourism Agency. All Rights Reserved.</p>
          <div className="flex items-center gap-5 text-slate-400 mt-2 md:mt-0">
             <a href="https://web.facebook.com/profile.php?id=100095027918655&locale=fr_FR" target="_blank" rel="noopener noreferrer" className="relative z-10 block p-2 -m-2 hover:text-blue-700 transition-colors" aria-label="Facebook">
               <svg className="pointer-events-none" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" /></svg>
             </a>
             <a href="https://www.linkedin.com/company/curesuremedico/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="relative z-10 block p-2 -m-2 hover:text-blue-700 transition-colors" aria-label="LinkedIn">
               <svg className="pointer-events-none" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
             </a>
             <a href="https://www.youtube.com/@curesuremedico" target="_blank" rel="noopener noreferrer" className="relative z-10 block p-2 -m-2 hover:text-blue-700 transition-colors" aria-label="YouTube">
               <svg className="pointer-events-none" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
             </a>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-sm">language</span>
            <span className="text-xs font-bold">English (International)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
