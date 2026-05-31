import Link from "next/link";
import { Check } from "lucide-react";
import type { NumerologyService } from "@/lib/services";
import { serviceIcons } from "@/components/services/serviceIcons";
import { getServiceWhatsAppLink } from "@/lib/whatsapp";

export function ServiceCard({
  align = "left",
  service,
  variant = "grid",
}: {
  align?: "left" | "right";
  service: NumerologyService;
  variant?: "featured" | "grid";
}) {
  const Icon = serviceIcons[service.icon];
  const isFeatured = variant === "featured";

  return (
    <article
      className={`card-premium transition-all duration-300 hover:shadow-[0_32px_70px_var(--shadow-gold)] ${
        isFeatured ? "p-7 md:p-9" : "p-6"
      }`}
      style={{
        borderTop: "3px solid var(--saffron-gold)",
      }}
    >
      <div
        className={`grid gap-8 ${
          isFeatured ? "lg:grid-cols-[0.9fr_1.1fr]" : ""
        } ${align === "right" ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <div>
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(232,160,32,0.12), rgba(212,112,10,0.08))",
                boxShadow: "0 0 24px rgba(232,160,32,0.1)",
              }}
            >
              <Icon className="h-6 w-6 text-[color:var(--saffron-gold)]" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-display text-[28px] font-bold leading-8 text-[color:var(--sacred-indigo)]">
                {service.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
                {service.tagline}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span
              className="rounded-full px-4 py-2 font-numeral text-xs font-medium text-[color:var(--saffron-gold)]"
              style={{
                background: "rgba(232,160,32,0.08)",
                border: "1px solid rgba(232,160,32,0.15)",
                boxShadow: "0 0 12px rgba(232,160,32,0.06)",
              }}
            >
              {service.duration}
            </span>
            <span
              className="rounded-full px-4 py-2 font-numeral text-xs font-semibold text-[color:var(--saffron-gold)]"
              style={{
                background: "rgba(232,160,32,0.08)",
                border: "1px solid rgba(232,160,32,0.15)",
                boxShadow: "0 0 12px rgba(232,160,32,0.06)",
              }}
            >
              {service.price}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="eyebrow text-xs">What&apos;s included</h3>
            <ul className="mt-4 space-y-3">
              {service.included.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-[color:var(--text-secondary)]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--forest-emerald)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(145deg, rgba(43,45,110,0.04), rgba(232,160,32,0.03))",
            border: "1px solid rgba(232,160,32,0.08)",
          }}
        >
          <h3 className="font-display text-2xl font-bold text-[color:var(--sacred-indigo)]">
            Who is this for?
          </h3>
          <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
            {service.forWhom}
          </p>

          <h3 className="mt-6 font-display text-2xl font-bold text-[color:var(--sacred-indigo)]">
            What you&apos;ll receive
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[color:var(--text-secondary)]">
            {service.receive.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Link href={`/book?service=${service.id}`} className="btn-primary mt-7 w-full justify-center">
            Book This Service
          </Link>
          <a
            href={getServiceWhatsAppLink(service.id)}
            className="btn-secondary mt-3 w-full justify-center"
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
