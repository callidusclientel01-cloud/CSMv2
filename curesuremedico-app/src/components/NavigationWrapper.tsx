"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide global Navbar and Footer on admin and patient dashboard routes
  // Account for optional locale prefixes (e.g. /fr/dashboard)
  const isDashboardRoute = pathname?.startsWith("/dashboard") || pathname?.match(/^\/(en|fr|ar)\/dashboard/);
  const isHiddenRoute = pathname?.startsWith("/admin") || !!isDashboardRoute;

  return (
    <>
      {!isHiddenRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isHiddenRoute && <Footer />}
    </>
  );
}
