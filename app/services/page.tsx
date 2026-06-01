import type { Metadata } from "next";
import { NumberRainEffect } from "@/components/effects/NumberRainEffect";
import { StarField } from "@/components/effects/StarField";
import { FAQAccordion } from "@/components/services/FAQAccordion";
import { ServiceCard } from "@/components/services/ServiceCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICE_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Numerology Consultation Services",
  description:
    "Explore NumeroSoul numerology services including personal readings, baby names, vehicle numbers, business numerology, Lo Shu grid, and compatibility sessions.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Numerology Consultation Services",
    description: "Explore NumeroSoul numerology services including personal readings, baby names, vehicle numbers, business numerology, Lo Shu grid, and compatibility sessions.",
    url: "/services",
    type: "website",
  },
  twitter: {
    title: "Numerology Consultation Services",
    description: "Explore NumeroSoul numerology services including personal readings, baby names, vehicle numbers, business numerology, Lo Shu grid, and compatibility sessions.",
  },
};

export default function ServicesPage() {
  const featuredServices = SERVICES.filter((service) => service.featured);
  const smallerServices = SERVICES.filter((service) => !service.featured);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <JsonLd data={faqPageJsonLd(SERVICE_FAQS)} />
      <JsonLd data={serviceJsonLd(SERVICES)} />
      <div className="page-shell selection:bg-[#E8A020]/20 selection:text-[#E8A020]">
        {/* Hero */}
        <section className="page-hero">
          {/* Animated stars */}
          <StarField starCount={35} color="gold" className="opacity-[0.35] z-0" />
          <StarField starCount={15} color="white" className="opacity-[0.2] z-0" />

          <ServiceHeroMandala />
          <div className="page-hero-inner">
            <p className="eyebrow text-[#D4700A]">✦ Consultations · Checks · Reports ✦</p>
            <h1 className="page-title">
              Sacred <span className="page-title-accent">Services</span>
            </h1>
            <p className="page-subtitle">
              Choose the reading that meets your question with clarity, care, and
              practical numerology guidance.
            </p>
          </div>
        </section>

        <NumberRainEffect />

        {/* Featured services */}
        <section className="page-section">
          <div className="mx-auto max-w-7xl space-y-8">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                variant="featured"
                align={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>

          <div className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-2">
            {smallerServices.map((service) => (
              <ServiceCard key={service.id} service={service} variant="grid" />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="page-section page-section-muted">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="eyebrow text-[#D4700A]">✦ Answers ✦</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-slate-900">
              Common <span className="italic text-[#E8A020]">Questions</span>
            </h2>
            <p className="mt-4 text-base text-slate-600">
              A few details before you choose your session.
            </p>
          </div>
          <FAQAccordion />
        </section>
      </div>
    </>
  );
}

function ServiceHeroMandala() {
  return (
    <svg
      className="service-hero-mandala pointer-events-none absolute right-[-42px] top-14 h-[300px] w-[300px] opacity-[0.05]"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      style={{ color: "var(--cosmic-purple)" }}
    >
      <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, index) => (
        <ellipse
          key={index}
          cx="100"
          cy="48"
          rx="11"
          ry="31"
          transform={`rotate(${index * 30} 100 100)`}
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
      <path
        d="M100 28L111 88L172 100L111 112L100 172L89 112L28 100L89 88L100 28Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
