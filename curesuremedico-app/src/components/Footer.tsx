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
                +91 81089 70640<br />
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
        <p className="text-slate-400 text-xs">&copy; 2024 CureSureMedico - Medical Tourism Agency. All Rights Reserved.</p>
        <div className="flex items-center gap-6">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZX0dhQiKJbTeKabBthrd87utqo-oFW8MR4bwbe-3Kl_4qZLauHS2NiZ9-5in5jE70lsFQwYcfCzXBEIoZUG-vYzaqoWu-wRCqBjy9CvURYwdj8nOvKP4ZgC8wsbKmFZ7-yODlxCtovxDDH8roPP40fxhORONYuA7Sn_TFqnwsbNpfODxHUVKo6Au8-0QxneoMYc_lVWWnTkBoUjBmgBs26BK5N2VKdhtIBkyansHEm13ejAfePom8FLA4UjLwVXd0FL7eFOfY188" alt="JCI Accreditation" className="h-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" />
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-sm">language</span>
            <span className="text-xs font-bold">English (International)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
