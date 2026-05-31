import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, DM_Sans } from "next/font/google";
import { CursorTrail } from "@/components/effects/CursorTrail";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { rootJsonLd } from "@/lib/seo";
import "../styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-numeral",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://numerasoul.in"),
  title: {
    default: "NumeroSoul — Numerologist | Personal Readings, Baby Names, Vehicle Numbers",
    template: "%s | NumeroSoul",
  },
  description:
    "Professional numerology consultations in India. Life path, baby name, vehicle number, phone number, and business numerology. Book online. Free tools available.",
  keywords: [
    "numerologist",
    "numerology consultation",
    "baby name numerology",
    "vehicle number numerology",
    "life path number",
    "phone number numerology",
    "numerologist in badaun",
    "numerologist in uttar pradesh",
    "lo shu grid",
    "name correction numerology",
  ],
  authors: [{ name: "NumeroSoul" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "NumeroSoul",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NumeroSoul — Numerology Consultations",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://numerasoul.in" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={rootJsonLd()} />
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable} ${cinzel.variable} antialiased`}>
        <Navbar />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppFloat />
        <MobileStickyBar />
        <CursorTrail />
      </body>
    </html>
  );
}
