import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NumeroSoul for numerology consultations, booking help, baby name numerology, vehicle number checks, and business numerology questions.",
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <div className="page-shell">
        <section className="page-hero">
          <div className="page-hero-inner">
            <p className="eyebrow">✦ Contact NumeroSoul ✦</p>
            <h1 className="page-title">
              Ask a <span className="page-title-accent">Question</span>
            </h1>
            <p className="page-subtitle">
              Reach out for service recommendations, booking support, or a quick
              question before your numerology session.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <ContactCard
              href={getWhatsAppLink()}
              icon={MessageCircle}
              label="WhatsApp"
              value="Chat with us"
            />
            <ContactCard
              href="mailto:numerosoul6@gmail.com"
              icon={Mail}
              label="Email"
              value="numerosoul6@gmail.com"
            />
            <ContactCard
              href="tel:+919193053666"
              icon={Phone}
              label="Phone"
              value="Available by appointment"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function ContactCard({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      className="card-premium p-7 text-center transition-all duration-300 hover:shadow-[0_28px_60px_var(--shadow-gold)]"
    >
      <span
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(232,160,32,0.12), rgba(212,112,10,0.08))",
          boxShadow: "0 0 24px rgba(232,160,32,0.1)",
        }}
      >
        <Icon className="h-6 w-6 text-[color:var(--saffron-gold)]" strokeWidth={1.7} />
      </span>
      <span className="mt-5 block font-display text-2xl font-bold text-[color:var(--sacred-indigo)]">
        {label}
      </span>
      <span className="mt-2 block text-sm leading-6 text-[color:var(--text-secondary)]">
        {value}
      </span>
    </a>
  );
}
