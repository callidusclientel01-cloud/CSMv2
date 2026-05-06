import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import NavigationWrapper from "@/components/NavigationWrapper";
import ToasterProvider from "@/components/ToasterProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cairo.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-body text-on-surface bg-surface min-h-screen flex flex-col ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <NavigationWrapper>
              <ToasterProvider />
              {children}
            </NavigationWrapper>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
