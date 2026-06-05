"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Constellation } from "@/components/effects/Constellation";
import { isAdminRoute } from "@/lib/admin-path";

const services = [
  "Life Path Reading",
  "Name Alignment",
  "Annual Forecast",
  "Compatibility Session",
];

const tools = [
  "Life Path Calculator",
  "Name Number Tool",
  "Vehicle / Phone Vibration",
  "Psychic Number",
  "Personal Year Guide",
];

const footerConstellation = [
  { x: 12, y: 26 }, { x: 25, y: 18 }, { x: 39, y: 28 },
  { x: 54, y: 18 }, { x: 70, y: 31 }, { x: 84, y: 22 },
  { x: 92, y: 42 }, { x: 78, y: 58 }, { x: 61, y: 50 },
];

const footerConnections: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [2, 8],
];

export function Footer() {
  const pathname = usePathname();

  if (isAdminRoute(pathname)) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--border)] bg-[color:var(--ethereal-pearl)]">
      {/* Subtle star field dots for texture */}
      <div className="star-field opacity-20" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="star" />
        ))}
      </div>

      {/* Uma Rastogi watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <h1 
          className="font-display font-black text-[#1E0A3C] tracking-tighter"
          style={{
            fontSize: "20vw",
            lineHeight: 0.8,
            whiteSpace: "nowrap"
          }}
        >
          Uma Rastogi
        </h1>
      </div>

      <Constellation
        className="right-8 top-10 h-72 w-72 text-[color:var(--cosmic-purple)] opacity-[0.05]"
        points={footerConstellation}
        connections={footerConnections}
        viewBox="0 0 100 80"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 md:grid-cols-2 lg:grid-cols-4 lg:px-16">
        <div>
          <Link
            href="/"
            className="font-numeral text-2xl font-semibold text-[#1E0A3C]"
          >
            ✦ NumeroSoul
          </Link>
          <p className="mt-4 font-display text-2xl leading-8 text-[color:var(--text-primary)]">
            Light-filled numerology for grounded inner clarity.
          </p>
        </div>

        <FooterColumn title="Services" items={services} href="/services" />
        <FooterColumn title="Free Tools" items={tools} href="/tools" />

        <div>
          <h2 className="font-display text-2xl font-semibold text-[color:var(--text-primary)]">Contact</h2>
          <div className="mt-5 space-y-3 text-sm text-[color:var(--text-secondary)]">
            <a className="block transition hover:text-[color:var(--sunrise-orange)]" href="mailto:numerosoul6@gmail.com">
              numerosoul6@gmail.com
            </a>
            <a className="block transition hover:text-[color:var(--sunrise-orange)]" href="tel:+15550114111">
              +1 (555) 011-4111
            </a>
          </div>
          <div className="mt-6 flex gap-3">
            {["IG", "YT", "X"].map((item) => (
              <a
                key={item}
                href="#social"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-white font-numeral text-xs text-[color:var(--text-secondary)] transition-all duration-300 hover:border-[color:var(--sunrise-orange)] hover:text-[color:var(--sunrise-orange)] hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                aria-label={`${item} social link`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Colorful divider */}
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--cosmic-purple)]/20 to-transparent" />
      </div>

      <div className="relative px-6 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[color:var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 NumeroSoul. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="transition hover:text-[color:var(--sunrise-orange)]">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-[color:var(--sunrise-orange)]">Terms & Conditions</Link>
            <Link href="/refund" className="transition hover:text-[color:var(--sunrise-orange)]">Refund Policy</Link>
          </div>
          <p
            className="font-numeral text-[color:var(--sunrise-orange)]"
          >
            Made with ✦ numbers
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ href, title, items }: { href: string; title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-[color:var(--text-primary)]">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-[color:var(--text-secondary)]">
        {items.map((item) => (
          <li key={item}>
            <Link href={href} className="transition hover:text-[color:var(--sunrise-orange)]">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
