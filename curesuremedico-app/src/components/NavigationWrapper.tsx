"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide global Navbar and Footer on admin and patient dashboard routes
  // because they have their own dedicated sidebars and layouts.
  const isHiddenRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

  return (
    <>
      {!isHiddenRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isHiddenRoute && <Footer />}
    </>
  );
}
