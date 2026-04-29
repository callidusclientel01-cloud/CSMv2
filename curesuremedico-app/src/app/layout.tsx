import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curesuremedico.com'),
  title: {
    default: "CureSureMedico | Global Clinical Excellence",
    template: "%s | CureSureMedico"
  },
  description: "Your trusted bridge to global clinical excellence. Access top-tier medical care across our global network of accredited hospitals.",
  openGraph: {
    title: "CureSureMedico | Global Clinical Excellence",
    description: "World-Class Treatments at Transparent Prices. Your medical travel journey made easy.",
    url: "/",
    siteName: "CureSureMedico",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CureSureMedico | Global Clinical Excellence",
    description: "World-Class Treatments at Transparent Prices.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "aArUBcHx4cY3m024Ig-yESzadGTK5jUz_tWhxSi-Hpc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-on-surface bg-surface min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
