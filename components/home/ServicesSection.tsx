"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { NumberRainEffect } from "@/components/effects/NumberRainEffect";
import { SectionDivider } from "@/components/effects/SectionDivider";
import {
  User,
  Baby,
  Car,
  Smartphone,
  Edit3,
  Building2,
  Heart,
  Grid3X3,
  ArrowRight
} from "lucide-react";

const services = [
  {
    title: "Personal Reading",
    description: "Deep dive into your birth chart, core vibrations, destiny maps, and upcoming timeline cycles.",
    icon: User,
    price: "₹2,100",
    symbol: "☉", // Sun
    color: "#F97316"
  },
  {
    title: "Name Correction",
    description: "Align your name's letter vibrations with your life path number for harmony and career acceleration.",
    icon: Edit3,
    price: "₹1,500",
    symbol: "☿", // Mercury
    color: "#22C55E"
  },
  {
    title: "Baby Name Numerology",
    description: "Select a lucky, harmonious name for your newborn based on exact birth planetary rulers.",
    icon: Baby,
    price: "₹3,100",
    symbol: "☽", // Moon
    color: "#94A3B8"
  },
  {
    title: "Business Numerology",
    description: "Optimise brand name frequencies, select favorable launch dates, and balance founder grids.",
    icon: Building2,
    price: "₹5,100",
    symbol: "♃", // Jupiter
    color: "#EAB308"
  },
  {
    title: "Marriage Compatibility",
    description: "Vibrational matching between life paths to understand emotional flow, growth areas, and alignment.",
    icon: Heart,
    price: "₹2,500",
    symbol: "♀", // Venus
    color: "#EC4899"
  },
  {
    title: "Lo Shu Grid Reading",
    description: "Chinese numerological mapping of your personal strength planes, weak planes, and missing elements.",
    icon: Grid3X3,
    price: "₹1,800",
    symbol: "☊", // Rahu
    color: "#7C3AED"
  },
  {
    title: "Vehicle Number Check",
    description: "Vibrational analysis of vehicle registration plates to ensure compatibility with your birth numbers.",
    icon: Car,
    price: "₹700",
    symbol: "♄", // Saturn
    color: "#1E40AF"
  },
  {
    title: "Phone Number Check",
    description: "Ensure your mobile number vibration aligns with business communication or personal life trends.",
    icon: Smartphone,
    price: "₹500",
    symbol: "♂", // Mars
    color: "#EF4444"
  }
];

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      rotateX: 18, 
      y: 40,
      transformPerspective: 1000 
    },
    visible: { 
      opacity: 1, 
      rotateX: 0, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative px-6 py-24 sm:px-10 lg:px-16 overflow-hidden bg-[#FFFDF9] services-light-depth"
      style={{
        background: "linear-gradient(145deg, #FFFDF9 0%, #FFF4E5 42%, #F3E8FF 72%, #ECFDF5 100%)",
        perspective: "1200px" // For 3D perspective context
      }}
    >
      {/* Falling Numbers Background */}
      <NumberRainEffect count={34} className="opacity-[0.12]" />

      {/* Glow nebula backgrounds */}
      <div className="absolute right-[-10%] top-[12%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.14)_0%,transparent_70%)] blur-[86px] pointer-events-none" />
      <div className="absolute left-[-10%] bottom-[12%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,160,32,0.16)_0%,transparent_70%)] blur-[86px] pointer-events-none" />
      <div className="absolute left-[42%] top-[42%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.12)_0%,transparent_70%)] blur-[72px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center">
          <p className="eyebrow text-[#D4700A]">✦ Sacred Services ✦</p>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold leading-tight text-slate-950">
            Vibrational Guidance & <span className="italic text-[#E8A020]">Consultations</span>
          </h2>
          <SectionDivider className="mx-auto mt-6" variant="gold" />
        </div>

        {/* Services Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.article
                key={idx}
                variants={cardVariants}
                className="group relative flex flex-col justify-between p-6 border rounded-2xl transition-all duration-500 overflow-hidden cursor-pointer h-[320px] depth-card service-light-card"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.74)",
                  borderColor: "rgba(232, 160, 32, 0.18)",
                  boxShadow: "0 18px 42px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.72)",
                  transformStyle: "preserve-3d"
                }}
                whileHover={{
                  y: -8,
                  rotateX: 4,
                  rotateY: idx % 2 === 0 ? -4 : 4,
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
                  borderColor: `${service.color}40`,
                  boxShadow: `0 26px 60px rgba(15, 23, 42, 0.10), 0 0 34px ${service.color}18`,
                }}
              >
                {/* Planet Symbol Watermark (revealed on hover) */}
                <span 
                    className="absolute right-4 top-2 text-[120px] font-bold select-none pointer-events-none opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 font-numeral"
                  style={{ color: service.color, position: "absolute" }}
                >
                  {service.symbol}
                </span>

                {/* Card Header: Icon */}
                <div>
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      background: `linear-gradient(145deg, ${service.color}18, rgba(255,255,255,0.86))`,
                      border: `1px solid ${service.color}26`,
                      boxShadow: `0 10px 24px ${service.color}12`,
                    }}
                  >
                    <IconComponent 
                      className="h-5 w-5 text-[#E8A020] group-hover:scale-110 transition-transform duration-300" 
                      style={{ color: service.color }}
                      strokeWidth={1.8} 
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 font-display text-xl font-bold leading-tight text-slate-900 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                {/* Card Footer: Price & Arrow Link */}
                <div className="mt-6 pt-4 border-t border-[#E8A020]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Investment</span>
                    <span className="font-numeral text-sm font-semibold text-[#E8A020]" style={{ color: service.color }}>
                      From {service.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#E8A020] tracking-wider uppercase group-hover:translate-x-1.5 transition-transform duration-300">
                    <ArrowRight className="h-4 w-4" style={{ color: service.color }} />
                  </div>
                </div>

              </motion.article>
            );
          })}
        </motion.div>

        {/* Centered CTA */}
        <div className="mt-16 text-center">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="/services"
            className="btn-secondary"
            style={{
              borderColor: "#E8A020",
              color: "#D4700A",
              backgroundColor: "rgba(255,255,255,0.64)",
            }}
          >
            Explore Sacred Services
          </motion.a>
        </div>

      </div>
    </section>
  );
}
