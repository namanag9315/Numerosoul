"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { NumerologistPhoto } from "@/components/ui/NumerologistPhoto";

export function AboutUma() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
        delay: custom * 0.05
      }
    })
  };

  const badges = [
    {
      title: "Certified Chaldean Numerologist",
      issuer: "Federation of Vedic Astrologers, India",
      desc: "Mastery in sound-vibration frequencies and Chaldean number grids.",
      number: "1"
    },
    {
      title: "Chaldean Vibration Expert",
      issuer: "Institute of Mystical Sciences, Badaun",
      desc: "Specialized in sound-vibration frequencies and name corrections.",
      number: "5"
    },
    {
      title: "Sacred Geometry Practitioner",
      issuer: "Academy of Harmonic Arts",
      desc: "Advanced reading of planetary alignments via yantras and grids.",
      number: "9"
    }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative px-6 py-24 sm:px-10 lg:px-16 overflow-hidden bg-[#FBF9F4] text-slate-800"
      style={{
        background: "radial-gradient(circle at 80% 20%, #FFFDF9 0%, #FAF6EE 50%, #F5EFE2 100%)"
      }}
    >
      {/* SVG Noise Layer specific to this section for parchment texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035] mix-blend-multiply" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px"
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          
          {/* Left: Bio Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col text-left"
          >
            <motion.p variants={itemVariants} className="eyebrow text-[#E8A020]">
              ✦ Meet Your Guide ✦
            </motion.p>

            {/* Handwriting Name Scale-In */}
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold leading-tight text-slate-900">
              <span className="block font-body text-lg tracking-[3px] text-slate-500 font-medium mb-1">
                NUMEROLOGIST & MENTOR
              </span>
              <span className="flex flex-wrap">
                {"Uma Rastogi".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterVariants}
                    className={char === " " ? "w-3" : "inline-block text-[#1E0A3C] font-semibold"}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h2>

            <motion.div
              variants={lineVariants}
              className="h-[1px] w-24 bg-[#E8A020] mt-4 mb-6"
            />

            <motion.p variants={itemVariants} className="text-base md:text-lg leading-relaxed text-slate-600 mb-6">
              Certified numerologist based in Badaun, Uttar Pradesh, India, Uma Rastogi specialises in the mathematical clarity and ancient intuitive traditions of Chaldean numerology.
            </motion.p>

            <motion.p variants={itemVariants} className="text-base leading-relaxed text-slate-600 mb-8">
              Over eight years, she has guided hundreds of clients to realign their names, choose lucky dates, evaluate business titles, and discover the hidden maps inside their birth date grid. Her approach is non-dogmatic, practical, and focused on grounded growth.
            </motion.p>

            <motion.div variants={itemVariants}>
              <a
                href="/about"
                className="btn-primary"
                style={{
                  background: "linear-gradient(135deg, #1E0A3C, #0D0820)",
                  boxShadow: "0 10px 25px rgba(30, 10, 60, 0.15)",
                }}
              >
                Read Full Story
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Shatkona Photo Frame */}
          <div className="flex items-center justify-center relative h-[350px] w-full max-w-[350px] mx-auto lg:max-w-none">
            <div className="relative h-64 w-64 md:h-72 md:w-72 shrink-0">
              
              {/* Shatkona SVG frame - Dual rotating triangles */}
              <svg
                className="absolute inset-[-40px] h-[calc(100%+80px)] w-[calc(100%+80px)] text-[#E8A020] select-none pointer-events-none"
                viewBox="0 0 200 200"
              >
                {/* Outer circle */}
                <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3,6" fill="none" />

                {/* Triangle 1: Upward pointing (Shiva - rotates clockwise) */}
                <motion.polygon
                  points="100,28 160,132 40,132"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeOpacity="0.8"
                  fill="none"
                  style={{ transformOrigin: "100px 100px" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                />

                {/* Triangle 2: Downward pointing (Shakti - rotates counter-clockwise) */}
                <motion.polygon
                  points="100,172 40,68 160,68"
                  stroke="#E8A020"
                  strokeWidth="1.2"
                  strokeOpacity="0.8"
                  fill="none"
                  style={{ transformOrigin: "100px 100px" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />

                {/* Tiny corner nodes */}
                <circle cx="100" cy="20" r="3" fill="#FAF6EE" stroke="currentColor" strokeWidth="1" />
                <circle cx="100" cy="180" r="3" fill="#FAF6EE" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Photo inside the circular mask */}
              <div className="absolute inset-0 flex items-center justify-center">
                <NumerologistPhoto size="lg" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Certification Badges */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(30,10,60,0.06)" }}
              className="p-6 text-left rounded-2xl bg-white border border-[#E8A020]/15 relative overflow-hidden transition-all duration-300"
              style={{
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.02)",
                borderTop: "3px solid #E8A020"
              }}
            >
              {/* Watermark digit */}
              <span className="absolute right-4 bottom-2 text-6xl font-bold font-numeral text-[#E8A020]/5 select-none pointer-events-none">
                {badge.number}
              </span>

              <h4 className="font-display text-lg font-bold text-slate-900 mb-1">
                {badge.title}
              </h4>
              <p className="text-[11px] font-semibold text-[#E8A020] tracking-wider uppercase mb-3">
                {badge.issuer}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed relative z-10">
                {badge.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// Micro line drawing variant
const lineVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
  }
};
