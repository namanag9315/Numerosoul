"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICE_FAQS } from "@/lib/faqs";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {SERVICE_FAQS.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.question}
            className="overflow-hidden rounded-2xl transition-all duration-300"
            style={{
              background: isOpen
                ? "linear-gradient(145deg, rgba(232,160,32,0.08), rgba(43,45,110,0.6))"
                : "rgba(255,248,238,0.06)",
              border: `1px solid ${isOpen ? "rgba(232,160,32,0.2)" : "rgba(232,160,32,0.08)"}`,
              boxShadow: isOpen ? "0 12px 40px rgba(232,160,32,0.08)" : "none",
            }}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="font-display text-xl font-bold text-[color:var(--celestial-cream)]">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[color:var(--saffron-gold)] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 sm:px-7">
                  {isOpen && (
                    <div
                      className="mb-4 h-px w-12"
                      style={{ background: "linear-gradient(to right, var(--saffron-gold), transparent)" }}
                    />
                  )}
                  <p className="text-sm leading-7 text-[color:var(--celestial-cream)]/70">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
