import type { Metadata } from "next";
import Link from "next/link";
import { NumberRainEffect } from "@/components/effects/NumberRainEffect";
import { StarField } from "@/components/effects/StarField";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolsPageClient } from "@/components/tools/ToolsPageClient";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Numerology Calculators — Life Path, Name, Vehicle",
  description:
    "Use free NumeroSoul numerology calculators for life path, name number, vehicle or phone vibration, psychic number, and personal year cycles.",
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }])} />
      <div className="page-shell selection:bg-[#E8A020]/20 selection:text-[#E8A020]">
        {/* Hero */}
        <section className="page-hero">
          {/* Animated stars */}
          <StarField starCount={30} color="gold" className="opacity-[0.25] z-0" />
          <StarField starCount={15} color="white" className="opacity-[0.15] z-0" />

          <div className="page-hero-inner">
            <p className="eyebrow text-[#D4700A]">✦ Free Instruments ✦</p>
            <h1 className="page-title">
              Calculate Your <span className="page-title-accent">Numbers</span>
            </h1>
            <p className="page-subtitle">
              Instant life path, name number, vehicle vibration, psychic number,
              and personal year results. No sign-up needed.
            </p>
          </div>
        </section>

        <NumberRainEffect />

        {/* Tools grid */}
        <section
          className="page-section"
        >
          <div className="mx-auto max-w-7xl">
            <ToolsPageClient />
          </div>
        </section>

        {/* CTA */}
        <section className="page-section page-section-muted text-center">
          <h2 className="font-display text-4xl font-bold text-slate-900">
            Want a <span className="italic text-[#E8A020]">deeper</span> interpretation?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            The calculators reveal the number. A session reads the relationships
            between your numbers, timing, names, and current life question.
          </p>
          <Link href="/book" className="btn-primary mt-8">
            Book a Session
          </Link>
        </section>
      </div>
    </>
  );
}
