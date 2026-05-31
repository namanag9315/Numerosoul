import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Book a Numerology Session",
  description:
    "Book a NumeroSoul numerology session online. Choose your service, date, time, consultation mode, and complete secure payment.",
};

export default function BookPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Book", path: "/book" }])} />
      <Suspense fallback={<div className="min-h-screen pt-32" style={{ background: 'var(--ethereal-pearl)' }} />}>
        <BookingFlow />
      </Suspense>
    </>
  );
}
