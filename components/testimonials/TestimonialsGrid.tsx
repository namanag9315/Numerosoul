"use client";

import { useMemo, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const services = useMemo(
    () => ["All", ...Array.from(new Set(testimonials.map((testimonial) => testimonial.service)))],
    [testimonials],
  );
  const [selectedService, setSelectedService] = useState("All");

  const filteredTestimonials = useMemo(
    () =>
      testimonials.filter(
        (testimonial) => selectedService === "All" || testimonial.service === selectedService,
      ),
    [selectedService, testimonials],
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {services.map((service) => (
          <button
            key={service}
            type="button"
            onClick={() => setSelectedService(service)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              selectedService === service
                ? "border-[color:var(--saffron-gold)] text-white shadow-[0_8px_24px_var(--shadow-gold)]"
                : "border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--saffron-gold)] hover:text-[color:var(--saffron-gold)]"
            }`}
            style={
              selectedService === service
                ? { background: "linear-gradient(135deg, var(--saffron-gold), var(--molten-amber))" }
                : { background: "var(--celestial-cream)" }
            }
          >
            {service}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-6 md:columns-2 xl:columns-3">
        {filteredTestimonials.map((testimonial) => (
          <article
            key={`${testimonial.client}-${testimonial.service}`}
            className="card-premium mb-6 break-inside-avoid p-7 transition-all duration-300 hover:shadow-[0_28px_60px_var(--shadow-gold)]"
          >
            <p className="font-numeral text-sm text-[color:var(--saffron-gold)]">★★★★★</p>
            <blockquote className="mt-5 font-display text-2xl italic leading-9 text-[color:var(--sacred-indigo)]">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[color:var(--text-secondary)]">
                {testimonial.client}, {testimonial.city}
              </p>
              <time className="text-xs text-[color:var(--text-muted)]">{testimonial.date}</time>
            </div>
            <span
              className="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium text-[color:var(--saffron-gold)]"
              style={{ background: "rgba(232,160,32,0.08)", border: "1px solid rgba(232,160,32,0.15)" }}
            >
              {testimonial.service}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
