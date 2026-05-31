import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, Grid3X3, Sparkles, MapPin } from "lucide-react";
import { StarField } from "@/components/effects/StarField";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { NumerologistPhoto } from "@/components/ui/NumerologistPhoto";

export const metadata: Metadata = {
  title: "About Uma Rastogi — Certified Numerologist",
  description:
    "Learn about Uma Rastogi's background, qualifications, and certified expertise in Chaldean, Pythagorean, and Lo Shu Grid systems in Badaun, Uttar Pradesh, India.",
};

const approachCards = [
  {
    title: "Pythagorean Foundation",
    description:
      "Birth-name and full-name calculations reveal life path, destiny, soul urge, and personality patterns with clear practical guidance.",
    icon: BookOpen,
  },
  {
    title: "Chaldean Refinement",
    description:
      "Compound name numbers and sound-based vibration checks add nuance for business names, baby names, and public identity.",
    icon: Sparkles,
  },
  {
    title: "Lo Shu + Vedic Blend",
    description:
      "DOB grids, planetary associations, remedies, colors, and timing cycles create a reading that feels both symbolic and usable.",
    icon: Grid3X3,
  },
];

const certifications = [
  { name: "Certified Chaldean Numerologist", institution: "Federation of Vedic Astrologers, India", year: "2018", type: "Chaldean Numerology" },
  { name: "Pythagorean Numerology Master", institution: "Institute of Mystical Sciences", year: "2019", type: "Pythagorean Numerology" },
  { name: "Vastu & Harmony Consultant", institution: "Academy of Harmonic Arts", year: "2020", type: "Vastu Shastra" },
  { name: "Karmic & Spiritual Guide Certificate", institution: "Universal Healing Foundation", year: "2021", type: "Karmic Guide" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <div className="relative selection:bg-[#E8A020]/20 selection:text-[#E8A020]">
        
        {/* Main Profile Columns */}
        <section
          className="relative overflow-hidden px-6 pb-20 pt-36 sm:px-10 lg:px-16"
          style={{
            background: "radial-gradient(ellipse at 20% 50%, #FFF8EE 0%, #FAF3E0 50%, #F5EFE2 100%)",
          }}
        >
          {/* Animated stars */}
          <StarField starCount={35} color="gold" className="opacity-[0.25] z-0" />
          <StarField starCount={15} color="white" className="opacity-[0.15] z-0" />

          <div className="relative z-[1] mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[4fr_6fr] items-start">
              
              {/* Left Column (40%) */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* 320px circular photo frame (slow pulse glow, 4s loop) */}
                <div className="relative p-2 rounded-full animate-[pulse_4s_ease-in-out_infinite]" style={{ boxShadow: "0 0 35px rgba(232, 160, 32, 0.25)" }}>
                  <NumerologistPhoto size="xl" />
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-5 mt-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E8A020]/20 text-[#D4700A] shadow-sm hover:bg-[#E8A020]/10 hover:scale-105 transition-all"
                    aria-label="Instagram"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E8A020]/20 text-[#D4700A] shadow-sm hover:bg-[#E8A020]/10 hover:scale-105 transition-all"
                    aria-label="YouTube"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/919193053666"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E8A020]/20 text-[#D4700A] shadow-sm hover:bg-[#E8A020]/10 hover:scale-105 transition-all"
                    aria-label="WhatsApp"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.022-.015-.078-.026-.187-.078-.108-.052-.64-.316-.738-.351-.098-.035-.17-.052-.24.053-.07.106-.273.342-.335.412-.063.07-.126.077-.234.025-.108-.052-.457-.168-.87-0.536-.32-.284-.536-.635-.6-.745-.063-.11-.007-.17.048-.225.05-.05.108-.126.163-.189.055-.063.073-.105.11-.176.037-.07.018-.13-.009-.182-.027-.053-.24-.58-.329-.796-.086-.21-.174-.181-.24-.181-.06-.002-.13-.002-.2-.002-.07 0-.184.026-.28.13-.097.105-.371.363-.371.885s.38 1.025.433 1.1c.053.07.747 1.141 1.81 1.599.253.109.45.174.604.223.254.08.485.069.668.042.204-.03.64-.262.73-.516.09-.254.09-.472.063-.516-.027-.044-.1-.07-.208-.122zm-5.467 6.425C10.024 20.807 8.083 20.2 6.4 19.1l-.3-.17-1.9.5.5-1.85-.2-.3c-1.2-1.9-1.85-4.14-1.85-6.4 0-6.6 5.4-12 12-12s12 5.4 12 12c.006 6.6-5.38 12-11.986 12zM12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.2 2 5.9L2.8 22l4.3-1.1c1.6 1 3.5 1.5 5.5 1.5 6.63 0 12-5.37 12-12S18.63 2 12 2z"/>
                    </svg>
                  </a>
                </div>

                {/* Left badges column */}
                <div className="w-full bg-[#FFF8EE]/80 border border-[#E8A020]/25 rounded-2xl p-5 text-left space-y-4">
                  <span className="text-[10px] text-[#E8A020] font-bold uppercase tracking-widest block border-b border-[#E8A020]/15 pb-2">Credentials summary</span>
                  <div className="space-y-3">
                    <div className="flex gap-2.5 items-start">
                      <Award className="h-4.5 w-4.5 text-[#D4700A] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">8+ Years Active Consultations</span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Award className="h-4.5 w-4.5 text-[#D4700A] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">Chaldean Certified Expert</span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Award className="h-4.5 w-4.5 text-[#D4700A] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">Vastu & Vedic Harmony Advisor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (60%) */}
              <div className="text-left space-y-5">
                <p className="eyebrow text-[#D4700A] font-bold">✦ About Your Numerologist</p>
                
                <h1
                  className="font-display font-bold leading-[1.08] text-slate-900"
                  style={{ fontSize: "52px" }}
                >
                  Uma Rastogi
                </h1>

                <p className="text-[13px] font-semibold text-[#D4700A] tracking-wider uppercase" style={{ fontFamily: "Cinzel, serif" }}>
                  Certified Numerologist · Vastu Consultant · Karmic Guide
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-4 w-4 text-[#D4700A]" />
                  <span>Badaun, Uttar Pradesh, India</span>
                </div>

                <div className="space-y-4 pt-2 text-base leading-8 text-slate-600">
                  <p>
                    Uma Rastogi is a highly respected certified numerologist, Vastu consultant, and karmic mentor with a dedicated practice in Badaun, Uttar Pradesh, India. Over the last eight years, she has worked with more than 500 clients worldwide, applying the clear mathematical frameworks of Pythagorean calculations alongside the deep sound-vibration frequencies of the Chaldean system.
                  </p>
                  <p>
                    Her journey with the science of numbers began with extensive personal research and studies, under renowned Vedic scholars and Vastu masters. She believes that numbers represent the cosmic gears of our reality. They are not merely fortune-telling symbols, but detailed energy signatures that dictate compatibility, timing, and personal trajectories.
                  </p>
                  <p>
                    Uma specializes in baby name selections, business spelling corrections, property/vehicle vibration checks, and custom Lo Shu Grid readings. By integrating numerology with Vastu Shastra principles, she offers actionable remedies that allow clients to balance their environments and align their names to match the positive strengths in their birth charts.
                  </p>
                  <p>
                    Her consulting approach is highly individualistic, non-dogmatic, and focused on practical, real-world empowerment. Uma assists clients in understanding their karmic blueprints, turning missing numbers into strengths, and navigating major life transitions with confidence and clarity.
                  </p>
                </div>

                {/* Signature Pull Quote */}
                <div className="relative border-y border-[#E8A020]/20 py-6 my-8 text-center bg-white/20 rounded-xl px-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF3E0] px-3 text-[10px] text-[#E8A020] tracking-widest uppercase">
                    Core philosophy
                  </div>
                  <p className="font-display italic text-[#1E0A3C]" style={{ fontSize: "26px" }}>
                    &ldquo;Names carry the vibration that unlocks destiny. Balance your name to match your stars, and you harmonize your path.&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-[#D4700A] uppercase tracking-wider font-semibold">
                    — Uma Rastogi
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Story Section */}
        <section
          className="px-6 py-20 sm:px-10 lg:px-16 animate-fade-in"
          style={{
            background: "linear-gradient(to bottom, #FFFDF9 0%, #FAF6EE 50%, #F5EFE2 100%)",
            borderTop: "1px solid rgba(232, 160, 32, 0.12)",
          }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <p className="eyebrow text-[#D4700A]">✦ Methodology ✦</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
                A Unified <span className="italic text-[#E8A020]">Holistic</span> Approach
              </h2>
              <p className="text-slate-500 text-xs mt-2">
                Uma Rastogi combines three distinct traditional systems for complete precision.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {approachCards.map((card) => (
                <article
                  key={card.title}
                  className="card-premium p-7 transition-all duration-300 hover:shadow-[0_28px_60px_rgba(249,115,22,0.1)] bg-white border border-[#E8A020]/15 rounded-2xl"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(232, 160, 32, 0.1), #FFF8EE)",
                      boxShadow: "0 0 24px rgba(232, 160, 32, 0.08)",
                    }}
                  >
                    <card.icon className="h-6 w-6 text-[#D4700A]" strokeWidth={1.7} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials & Certifications Table Section */}
        <section
          className="px-6 py-20 sm:px-10 lg:px-16"
          style={{
            background: "radial-gradient(circle at 50% 50%, #FFFDF9 0%, #FAF6EE 60%, #F5EFE2 100%)",
            borderTop: "1px solid rgba(232, 160, 32, 0.12)",
          }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <p className="eyebrow text-[#D4700A]">✦ Credentials & Certifications ✦</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">
                Verified Expert Qualification
              </h2>
            </div>

            {/* Certification Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E8A020]/20 bg-white/70 shadow-sm">
              <table className="w-full text-left border-collapse text-slate-800 text-xs">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-[#E8A020]/20 text-[10px] text-[#D4700A] uppercase tracking-widest font-bold">
                    <th className="p-4">Certification</th>
                    <th className="p-4">Institution</th>
                    <th className="p-4">Specialization</th>
                    <th className="p-4 text-center">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8A020]/10">
                  {certifications.map((cert, idx) => (
                    <tr key={idx} className="hover:bg-[#FFF8EE]/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <Award className="h-4.5 w-4.5 text-[#D4700A] shrink-0" />
                        {cert.name}
                      </td>
                      <td className="p-4 text-slate-600">{cert.institution}</td>
                      <td className="p-4 text-slate-500">{cert.type}</td>
                      <td className="p-4 text-center font-semibold text-[#D4700A]">{cert.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative overflow-hidden px-6 py-20 text-center sm:px-10 lg:px-16"
          style={{
            background: "radial-gradient(ellipse at 20% 50%, #FFF8EE 0%, #FAF3E0 50%, #F5EFE2 100%)",
            borderTop: "1px solid rgba(232, 160, 32, 0.12)",
          }}
        >
          {/* Animated stars */}
          <StarField starCount={30} color="gold" className="opacity-[0.2] z-0" />

          <div className="relative z-[1] mx-auto max-w-3xl">
            <h2 className="font-display text-4xl font-bold text-slate-900">
              Ready for a <span className="italic text-[#E8A020]">personal reading?</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Choose a focused service or book a full consultation for your core
              numbers, timing, remedies, and next steps with Uma Rastogi.
            </p>
            <Link href="/book" className="btn-primary mt-8 inline-block animate-float">
              Book a Session
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
