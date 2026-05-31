"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

export function ChapterCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const numberVariants: Variants = {
    hidden: { opacity: 0, x: 80, scale: 0.9 },
    visible: {
      opacity: 0.07,
      x: 0,
      scale: 1,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative flex h-[70vh] min-h-[500px] items-center justify-center overflow-hidden px-6 text-center bg-[#0D0820] border-y border-white/5 section-gradient-depth-dark"
      style={{
        background: "linear-gradient(145deg, #0D0820 0%, #17082E 48%, #0A0516 100%)"
      }}
    >
      <div className="gradient-depth-ribbon gradient-depth-ribbon-c pointer-events-none" aria-hidden="true" />
      {/* Cinematic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(232,160,32,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(232,160,32,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Floating Low-Opacity Gold "9" watermark */}
      <motion.div
        variants={numberVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="absolute right-[-5%] lg:right-[5%] text-[40vw] lg:text-[28vw] font-bold text-[#E8A020] leading-none select-none font-numeral pointer-events-none filter blur-[1px]"
      >
        9
      </motion.div>

      {/* Content wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 max-w-3xl px-4 flex flex-col items-center"
      >
        <motion.p
          variants={itemVariants}
          className="font-display text-xs font-semibold uppercase tracking-[6px] text-[#E8A020] mb-6"
        >
          ✦ Chapter I ✦
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="font-display text-3xl md:text-5xl font-bold text-[#FAF3E0] leading-tight mb-8"
        >
          The Universe in Nine Vibrations
        </motion.h2>

        {/* Drawing Line */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="h-[1px] w-48 bg-gradient-to-r from-transparent via-[#E8A020]/60 to-transparent origin-left mb-8"
        />

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg leading-relaxed text-[#FAF3E0]/70 font-body max-w-2xl"
        >
          &ldquo;Numbers are the universal language, the energetic blueprint of our soul. From the single point of creation to the completion of the cycle at nine, each vibration holds a map of lessons, gifts, and destiny.&rdquo;
        </motion.p>

        {/* Bouncing Scroll Indicator */}
        <motion.div
          variants={itemVariants}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-12 flex flex-col items-center cursor-pointer"
          onClick={() => {
            const aboutEl = document.getElementById("about");
            if (aboutEl) {
              aboutEl.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <span className="text-[10px] uppercase tracking-[4px] text-[#E8A020]/50 mb-2 font-display">
            Descend
          </span>
          <svg
            className="w-4 h-4 text-[#E8A020]/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
