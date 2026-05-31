import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { TestimonialsGrid } from "@/components/testimonials/TestimonialsGrid";
import { breadcrumbJsonLd } from "@/lib/seo";
import { TESTIMONIALS } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read NumeroSoul client testimonials for baby name numerology, vehicle number checks, business numerology, Lo Shu grid readings, and personal readings.",
};

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Testimonials", path: "/testimonials" }])} />
      <div className="page-shell">
        {/* Hero */}
        <section className="page-hero">
          {/* Star field */}
          <div className="star-field" aria-hidden="true">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} className="star" />
            ))}
          </div>
          <div className="page-hero-inner">
            <p className="eyebrow text-[#D4700A]">✦ Client Stories ✦</p>
            <h1 className="page-title">
              Voices of <span className="page-title-accent">Transformation</span>
            </h1>
            <p className="page-subtitle">
              Reflections from clients who used numerology for names, numbers,
              timing, business decisions, and personal clarity.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="px-6 py-14 sm:px-10 lg:px-16" style={{ background: "var(--celestial-cream)" }}>
          <div
            className="mx-auto grid max-w-6xl grid-cols-2 gap-3 overflow-hidden rounded-2xl p-4 text-center md:grid-cols-4"
            style={{
              background: "rgba(255,248,238,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(232,160,32,0.12)",
              boxShadow: "0 20px 50px rgba(232,160,32,0.06)",
            }}
          >
            {["500+ clients", "4.9 avg rating", "12 services", "Serving India & globally"].map((stat) => (
              <p
                key={stat}
                className="rounded-xl px-4 py-4 font-numeral text-sm font-medium text-[color:var(--saffron-gold)]"
                style={{ background: "rgba(232,160,32,0.06)" }}
              >
                {stat}
              </p>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="px-6 pb-20 sm:px-10 lg:px-16" style={{ background: "var(--celestial-cream)" }}>
          <div className="mx-auto max-w-7xl">
            <TestimonialsGrid testimonials={TESTIMONIALS} />
          </div>
        </section>

        {/* CTA */}
        <section className="page-section page-section-muted text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-4xl font-bold text-[color:var(--sacred-indigo)]">
              Submit Your <span className="italic text-[color:var(--saffron-gold)]">Story</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--text-secondary)]">
              Share how your reading helped you choose, understand, or realign.
            </p>
            <Link href="https://forms.gle/" className="btn-primary mt-8">
              Submit Your Story
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
