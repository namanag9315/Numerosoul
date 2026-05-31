import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingConfirmedClient } from "@/components/booking/BookingConfirmedClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your NumeroSoul numerology booking is confirmed.",
};

export default function BookingConfirmedPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Booking Confirmed", path: "/booking-confirmed" },
        ])}
      />
      <Suspense fallback={<div className="min-h-screen bg-[color:var(--cream)] pt-32" />}>
        <BookingConfirmedClient />
      </Suspense>
    </>
  );
}
