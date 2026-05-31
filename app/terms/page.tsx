import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the NumeroSoul Terms and Conditions for website use, bookings, payments, consultations, digital reports, disclaimers, and client responsibilities.",
};

const lastUpdated = "May 31, 2026";

export default function TermsPage() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Terms and Conditions</p>
          <h1 className="page-title">
            Terms for Using <span className="page-title-accent">NumeroSoul</span>
          </h1>
          <p className="page-subtitle">
            These terms govern your use of the NumeroSoul website, free tools,
            bookings, consultations, personalized reports, and related digital
            services.
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
              Important Notice
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              NumeroSoul provides numerology-based guidance, spiritual insight,
              educational content, and personal reflection tools. Our services
              do not replace professional medical, legal, financial,
              psychological, tax, or investment advice.
            </p>
          </div>

          <PolicySection title="1. Acceptance of Terms">
            <p>
              By accessing or using this website, booking a session, purchasing
              a report, using a free tool, or communicating with us about a
              service, you agree to these Terms and Conditions. If you do not
              agree, please do not use the website or services.
            </p>
          </PolicySection>

          <PolicySection title="2. About NumeroSoul">
            <p>
              NumeroSoul is operated by {BRAND.legalName}, based in{" "}
              {BRAND.location}. We offer numerology consultations, digital
              reports, name guidance, compatibility insights, annual forecasts,
              vehicle and phone number checks, educational content, and related
              services.
            </p>
          </PolicySection>

          <PolicySection title="3. Nature of Services">
            <ul>
              <li>
                Numerology readings and reports are based on interpretive,
                spiritual, traditional, symbolic, and educational systems.
              </li>
              <li>
                Services are provided for personal insight, self-reflection,
                spiritual guidance, entertainment, and educational purposes.
              </li>
              <li>
                We do not guarantee specific outcomes in relationships, career,
                health, finances, legal matters, business decisions, marriage,
                travel, investments, or any other life event.
              </li>
              <li>
                You remain responsible for your own decisions and should consult
                qualified professionals before making medical, financial, legal,
                psychological, or other regulated decisions.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Eligibility and Account Access">
            <p>
              You must be legally capable of entering into a binding agreement
              to use paid services. If you use the website on behalf of someone
              else, you confirm that you have authority to provide their
              information and request the service. You are responsible for
              keeping login credentials and account access secure.
            </p>
          </PolicySection>

          <PolicySection title="5. Information You Provide">
            <p>
              You agree to provide accurate and complete details, including
              names, dates of birth, contact information, booking details,
              payment references, and consultation inputs. NumeroSoul is not
              responsible for inaccurate readings, reports, invoices, reminders,
              or delivery issues caused by incorrect or incomplete information
              submitted by you.
            </p>
          </PolicySection>

          <PolicySection title="6. Bookings and Consultations">
            <ul>
              <li>Bookings are subject to availability and confirmation.</li>
              <li>
                Session timings, duration, format, and deliverables may vary by
                service selected.
              </li>
              <li>
                You are responsible for joining on time and ensuring that your
                phone, internet, video-call access, and communication channels
                are working.
              </li>
              <li>
                We may reschedule a session due to availability, technical
                problems, emergencies, or circumstances outside our control.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="7. Payments, Pricing, and Invoices">
            <p>
              Paid services must be paid in advance unless otherwise agreed.
              Prices may change at any time, but confirmed bookings will be
              honored at the price accepted at checkout or in the official
              payment communication. Payment success does not guarantee a
              booking until the booking is confirmed by our system or team.
            </p>
          </PolicySection>

          <PolicySection title="8. Cancellations and Refunds">
            <p>
              Cancellations, rescheduling, no-shows, digital report purchases,
              duplicate payments, and refund timelines are governed by our{" "}
              <Link className="font-semibold text-[color:var(--sunrise-orange)]" href="/refund">
                Refund and Cancellation Policy
              </Link>
              . By purchasing a service, you agree to that policy.
            </p>
          </PolicySection>

          <PolicySection title="9. Digital Reports and Deliverables">
            <p>
              Reports, readings, written recommendations, corrected name
              suggestions, number analysis, and other deliverables are prepared
              using the information available at the time of service. Delivery
              may occur through the website, email, WhatsApp, downloadable
              document, video call, or another agreed channel. You may use your
              purchased report for personal use, but you may not resell,
              republish, copy, train systems on, or commercially exploit it
              without written permission.
            </p>
          </PolicySection>

          <PolicySection title="10. Intellectual Property">
            <p>
              The website, brand elements, copy, design, reports, templates,
              calculators, visuals, content, and service materials are owned by
              NumeroSoul or licensed to us. You may not reproduce, modify,
              distribute, scrape, reverse engineer, or create derivative works
              from our materials except as allowed by law or with written
              permission.
            </p>
          </PolicySection>

          <PolicySection title="11. Prohibited Use">
            <p>You agree not to:</p>
            <ul>
              <li>Use the website or services for unlawful, harmful, abusive, misleading, or fraudulent purposes.</li>
              <li>Interfere with website security, availability, payment flows, accounts, or other users.</li>
              <li>Submit false, unauthorized, defamatory, offensive, or infringing content.</li>
              <li>Copy, scrape, resell, or misuse our content, reports, tools, or client materials.</li>
              <li>Attempt to access admin, private, or restricted areas without authorization.</li>
            </ul>
          </PolicySection>

          <PolicySection title="12. Third-Party Services">
            <p>
              We may use third-party services for payments, authentication,
              hosting, analytics, email, WhatsApp or SMS, calendars, video
              calls, and other operations. Those services may have their own
              terms and privacy practices. NumeroSoul is not responsible for
              third-party platforms outside our control.
            </p>
          </PolicySection>

          <PolicySection title="13. Privacy">
            <p>
              Our collection and use of personal information is explained in our{" "}
              <Link className="font-semibold text-[color:var(--sunrise-orange)]" href="/privacy">
                Privacy Policy
              </Link>
              . By using the website or services, you acknowledge that personal
              information may be processed as described there.
            </p>
          </PolicySection>

          <PolicySection title="14. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, NumeroSoul and
              {` ${BRAND.founder} `}will not be liable for indirect, incidental,
              consequential, special, punitive, or loss-of-profit damages arising
              from use of the website, readings, reports, consultations, or
              interpretations. Our aggregate liability for a paid service will
              not exceed the amount you paid for that specific service.
            </p>
          </PolicySection>

          <PolicySection title="15. Indemnity">
            <p>
              You agree to indemnify and hold NumeroSoul harmless from claims,
              losses, liabilities, damages, costs, and expenses arising from your
              misuse of the website, breach of these terms, violation of law, or
              infringement of another person&apos;s rights.
            </p>
          </PolicySection>

          <PolicySection title="16. Changes to Services or Terms">
            <p>
              We may update services, prices, features, policies, and these
              terms from time to time. The latest version will be posted on this
              page with an updated date. Continued use of the website or
              services after changes are posted means you accept the revised
              terms.
            </p>
          </PolicySection>

          <PolicySection title="17. Governing Law and Disputes">
            <p>
              These terms are governed by the laws of India, subject to any
              mandatory consumer protection rights that may apply. Before
              starting any formal dispute, you agree to contact us so we can try
              to resolve the issue in good faith.
            </p>
          </PolicySection>

          <PolicySection title="18. Contact">
            <p>
              Questions about these Terms and Conditions can be sent to{" "}
              <a className="font-semibold text-[color:var(--sunrise-orange)]" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
              .
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
