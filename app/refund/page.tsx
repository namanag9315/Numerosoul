import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description:
    "Read the NumeroSoul Refund and Cancellation Policy for consultations, digital reports, rescheduling, no-shows, duplicate payments, and refund timelines.",
};

const lastUpdated = "May 31, 2026";

export default function RefundPolicyPage() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Refund Policy</p>
          <h1 className="page-title">
            Refunds, Cancellations <span className="page-title-accent">and Rescheduling</span>
          </h1>
          <p className="page-subtitle">
            This policy explains how refunds, cancellations, rescheduling, late
            arrivals, no-shows, and digital report purchases are handled for
            NumeroSoul services.
          </p>
          <p className="mt-6 text-sm font-semibold text-[color:var(--text-muted)]">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="page-section">
        <article className="mx-auto max-w-4xl px-6">
          <div className="mb-10 border-l-4 border-[color:var(--sunrise-orange)] bg-white/70 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
            <h2 className="font-display text-2xl font-bold text-[color:var(--text-primary)]">
              Quick Summary
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              Consultation bookings can usually be cancelled for a refund if
              requested at least 24 hours before the scheduled session. Digital
              reports and completed services are generally non-refundable once
              work has started or delivery has occurred.
            </p>
          </div>

          <PolicySection title="1. Scope">
            <p>
              This Refund and Cancellation Policy applies to services purchased
              through the NumeroSoul website, official booking flow, official
              payment links, or direct arrangements confirmed by {BRAND.legalName}.
              It should be read together with our{" "}
              <Link className="font-semibold text-[color:var(--sunrise-orange)]" href="/terms">
                Terms and Conditions
              </Link>
              .
            </p>
          </PolicySection>

          <PolicySection title="2. Consultation Cancellations">
            <ul>
              <li>
                Cancellations requested at least 24 hours before the scheduled
                consultation are eligible for a full refund, unless a custom
                report or preparation work has already been completed.
              </li>
              <li>
                Cancellations requested less than 24 hours before the scheduled
                consultation may be eligible for rescheduling, but are not
                guaranteed to receive a refund.
              </li>
              <li>
                Once a consultation has started or been completed, the booking
                fee is non-refundable.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Rescheduling">
            <ul>
              <li>
                You may request to reschedule a live consultation at least 12
                hours before the scheduled time, subject to availability.
              </li>
              <li>
                We will make reasonable efforts to offer a suitable alternate
                time, but preferred slots cannot be guaranteed.
              </li>
              <li>
                Repeated rescheduling or last-minute changes may be treated as a
                cancellation at our discretion.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Late Arrivals and No-Shows">
            <ul>
              <li>
                If you are late, the consultation may still end at the original
                scheduled time so that later appointments are not affected.
              </li>
              <li>
                If you miss a scheduled consultation without prior notice, it
                will be treated as a no-show and no refund will be issued.
              </li>
              <li>
                If we need to cancel or reschedule due to an issue on our side,
                you may choose a new time or request a refund.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Digital Reports and Personalized Work">
            <p>
              Digital numerology reports, generated readings, written
              recommendations, name correction work, vehicle or phone number
              analysis, compatibility notes, and other personalized deliverables
              are customized for the information you provide. These are
              non-refundable once generation, preparation, delivery, download,
              or review work has started.
            </p>
          </PolicySection>

          <PolicySection title="6. Eligible Refund Situations">
            <p>Refunds may be approved when:</p>
            <ul>
              <li>You were charged twice for the same service.</li>
              <li>Payment was successful but the booking could not be confirmed.</li>
              <li>We cancelled a service and no suitable replacement time was accepted.</li>
              <li>
                A technical issue on our side prevented delivery, and we were
                unable to resolve it within a reasonable time.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="7. Non-Refundable Situations">
            <p>Refunds are generally not available when:</p>
            <ul>
              <li>The consultation has been completed.</li>
              <li>A digital report or personalized deliverable has been generated or delivered.</li>
              <li>The issue was caused by incorrect information submitted by you.</li>
              <li>You missed the session or joined too late for the full consultation.</li>
              <li>You changed your mind after work had started.</li>
              <li>You were dissatisfied because a numerology interpretation did not match an expected outcome.</li>
            </ul>
          </PolicySection>

          <PolicySection title="8. Refund Processing Timeline">
            <p>
              Approved refunds will be initiated to the original payment method
              where possible. Processing usually takes 5 to 10 business days
              after approval, depending on the payment provider, bank, card
              network, UPI provider, or wallet used. Transaction fees or payment
              gateway charges may be deducted where they are non-recoverable.
            </p>
          </PolicySection>

          <PolicySection title="9. How to Request a Refund or Cancellation">
            <p>
              To request a cancellation, reschedule, or refund, email{" "}
              <a className="font-semibold text-[color:var(--sunrise-orange)]" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>{" "}
              with your full name, phone number, booking date, service purchased,
              payment reference, and reason for the request. Requests are
              reviewed case by case.
            </p>
          </PolicySection>

          <PolicySection title="10. Chargebacks and Payment Disputes">
            <p>
              Please contact us first if there is a payment or delivery issue.
              If a chargeback or payment dispute is opened without contacting
              us, we may share booking records, delivery proof, communication
              records, and this policy with the payment provider to respond to
              the dispute.
            </p>
          </PolicySection>

          <PolicySection title="11. Policy Updates">
            <p>
              We may update this policy from time to time. The version posted on
              this page applies from the &quot;Last updated&quot; date above.
            </p>
          </PolicySection>
        </article>
      </section>
    </div>
  );
}

function PolicySection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="border-t border-[color:var(--border)] py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-bold text-[color:var(--text-primary)]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[color:var(--text-secondary)] marker:text-[color:var(--sunrise-orange)] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
