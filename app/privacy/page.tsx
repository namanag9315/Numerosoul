import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the NumeroSoul Privacy Policy to understand how consultation, booking, payment, account, and communication data is collected, used, protected, and retained.",
};

const lastUpdated = "May 31, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Privacy Policy</p>
          <h1 className="page-title">
            How We Protect <span className="page-title-accent">Your Information</span>
          </h1>
          <p className="page-subtitle">
            This policy explains how {BRAND.legalName} collects, uses, stores,
            shares, and protects personal information when you use our website,
            tools, reports, bookings, and consultation services.
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
              We collect only the information needed to provide numerology
              services, manage bookings, process payments, send customer
              communication, improve the website, and meet legal requirements.
              We do not sell your personal information.
            </p>
          </div>

          <PolicySection title="1. Who We Are">
            <p>
              This Privacy Policy applies to {BRAND.legalName}, located in{" "}
              {BRAND.location}. In this policy, &quot;NumeroSoul&quot;, &quot;we&quot;, &quot;us&quot;, and
              &quot;our&quot; refer to {BRAND.legalName}. &quot;You&quot; refers to visitors,
              clients, customers, and users of our website and services.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p>Depending on how you use the website, we may collect:</p>
            <ul>
              <li>Name, phone number, email address, and communication details.</li>
              <li>
                Date of birth, time-sensitive booking details, name spellings,
                vehicle or phone numbers, focus areas, and other information you
                choose to provide for a reading or report.
              </li>
              <li>
                Booking details, selected services, appointment date and time,
                payment status, invoices, session notes, and support history.
              </li>
              <li>
                Account or authentication details when you sign in through a
                supported provider.
              </li>
              <li>
                Technical information such as device type, browser, pages
                visited, approximate location derived from network data, and
                website usage events.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Use Information">
            <p>We use personal information to:</p>
            <ul>
              <li>Prepare numerology readings, compatibility guidance, reports, and consultation material.</li>
              <li>Confirm bookings, schedule sessions, issue invoices, and provide customer support.</li>
              <li>Send reminders, follow-ups, service updates, and responses to your questions.</li>
              <li>Process payments, prevent misuse, troubleshoot errors, and maintain website security.</li>
              <li>Improve our website, free tools, reports, services, and client experience.</li>
              <li>Send marketing communication only where permitted or where you have opted in.</li>
              <li>Comply with applicable law, tax, accounting, recordkeeping, and dispute-resolution requirements.</li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Payments">
            <p>
              Payments are processed through third-party payment providers or
              official payment links. We may receive transaction references,
              payment status, amount paid, and invoice details. We do not store
              your complete card number, UPI PIN, net-banking credentials, or
              other sensitive payment authentication details on our website.
            </p>
          </PolicySection>

          <PolicySection title="5. Cookies and Analytics">
            <p>
              The website may use cookies, local storage, analytics events, and
              similar technologies to keep the website working, remember
              preferences, understand page usage, improve services, and protect
              against abuse. You can control cookies through your browser
              settings, but some features may not function properly if cookies
              are disabled.
            </p>
          </PolicySection>

          <PolicySection title="6. Sharing With Service Providers">
            <p>
              We may share limited information with trusted providers who help
              us operate the website and deliver services, such as hosting,
              database, authentication, payment, email, WhatsApp or SMS,
              calendar, video-call, analytics, and customer-support providers.
              These providers are expected to use information only for the
              purpose of supporting NumeroSoul services.
            </p>
            <p>
              We may also disclose information if required by law, to respond to
              lawful requests, to protect our rights, to prevent fraud or abuse,
              or in connection with a business transfer.
            </p>
          </PolicySection>

          <PolicySection title="7. Marketing Choices">
            <p>
              If you opt in to receive promotional messages, we may contact you
              about services, offers, educational content, or updates. You can
              opt out by following the unsubscribe instructions in a message or
              by contacting us. Service-related messages, such as booking
              confirmations and payment updates, may still be sent when needed.
            </p>
          </PolicySection>

          <PolicySection title="8. Data Retention">
            <p>
              We keep personal information only for as long as reasonably needed
              for the purposes described in this policy, including service
              delivery, accounting, legal compliance, dispute handling, fraud
              prevention, and business records. When information is no longer
              required, we may delete, anonymize, or archive it in accordance
              with our operational and legal obligations.
            </p>
          </PolicySection>

          <PolicySection title="9. Security">
            <p>
              We use reasonable technical and organizational safeguards to
              protect personal information. However, no website, internet
              transmission, or storage system can be guaranteed to be completely
              secure. Please use strong account credentials and contact us
              promptly if you suspect unauthorized access to your information.
            </p>
          </PolicySection>

          <PolicySection title="10. Your Rights and Requests">
            <p>
              Subject to applicable law, you may request access, correction,
              deletion, restriction, withdrawal of consent, or clarification
              about how we process your personal information. We may need to
              verify your identity before fulfilling a request, and some
              information may be retained where required for legal, tax,
              security, or dispute-resolution purposes.
            </p>
          </PolicySection>

          <PolicySection title="11. Children's Information">
            <p>
              NumeroSoul services are intended for adults. If information about
              a child is provided for a baby-name or family consultation, it
              should be submitted by a parent, guardian, or authorized adult. If
              you believe a child has submitted personal information without
              appropriate consent, please contact us.
            </p>
          </PolicySection>

          <PolicySection title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The updated
              version will be posted on this page with a revised &quot;Last updated&quot;
              date. Continued use of the website after an update means you
              acknowledge the revised policy.
            </p>
          </PolicySection>

          <PolicySection title="13. Contact">
            <p>
              For privacy questions or requests, contact us at{" "}
              <a className="font-semibold text-[color:var(--sunrise-orange)]" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
              . You can also review our{" "}
              <Link className="font-semibold text-[color:var(--sunrise-orange)]" href="/terms">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link className="font-semibold text-[color:var(--sunrise-orange)]" href="/refund">
                Refund and Cancellation Policy
              </Link>
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
