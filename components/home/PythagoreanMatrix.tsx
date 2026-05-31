"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

type ChartColumn = {
  num: number;
  letters: string[];
  planet: string;
  symbol: string;
  governs: string;
  color: string;
  keywords: string;
};

const matrixData: ChartColumn[] = [
  { num: 1, letters: ["A", "I", "J", "Q", "Y"], planet: "Sun", symbol: "☉", governs: "Ego, Leadership, Soul", color: "#F97316", keywords: "Independence, Initiation, Originality" },
  { num: 2, letters: ["B", "K", "R"], planet: "Moon", symbol: "☽", governs: "Mind, Emotions, Intuition", color: "#94A3B8", keywords: "Diplomacy, Cooperation, Sensitivity" },
  { num: 3, letters: ["C", "G", "L", "S"], planet: "Jupiter", symbol: "♃", governs: "Wisdom, Fortune, Expansion", color: "#EAB308", keywords: "Expression, Creativity, Social Joy" },
  { num: 4, letters: ["D", "M", "T"], planet: "Rahu", symbol: "☊", governs: "Shadow, Ambition, Structure", color: "#7C3AED", keywords: "Stability, Discipline, Foundation" },
  { num: 5, letters: ["E", "H", "N"], planet: "Mercury", symbol: "☿", governs: "Speech, Intellect, Commerce", color: "#22C55E", keywords: "Adaptability, Freedom, Intellect" },
  { num: 6, letters: ["U", "V", "W", "X"], planet: "Venus", symbol: "♀", governs: "Love, Artistry, Luxury", color: "#EC4899", keywords: "Responsibility, Harmony, Nurturing" },
  { num: 7, letters: ["O", "Z"], planet: "Ketu", symbol: "☋", governs: "Release, Spirituality, Intellect", color: "#9CA3AF", keywords: "Analysis, Spiritual Depth, Solitude" },
  { num: 8, letters: ["F", "P"], planet: "Saturn", symbol: "♄", governs: "Karma, Authority, Time", color: "#1E40AF", keywords: "Authority, Material Power, Justice" },
  { num: 9, letters: [], planet: "Mars", symbol: "♂", governs: "Sacred limit, Higher forces, Spiritual boundary", color: "#EF4444", keywords: "Sacred Number (No Letters Assigned)" },
];

export function PythagoreanMatrix() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const activePlanet = hoveredIdx !== null ? matrixData[hoveredIdx] : null;

  return (
    <section
      id="matrix"
      ref={containerRef}
      className="relative px-6 py-24 sm:px-10 lg:px-16 overflow-hidden bg-[#0D0820] text-[#FAF3E0] section-gradient-depth-dark"
      style={{
        background: "linear-gradient(145deg, #0A0516 0%, #17082E 48%, #0A0516 100%)",
      }}
    >
      {/* ── Gold Dot-Grid Mesh ── */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: "radial-gradient(#E8A020 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Decorative blurred orbit gradient behind grid */}
      <div className="absolute left-[30%] top-[40%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,160,32,0.08)_0%,transparent_70%)] blur-[60px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="eyebrow text-[#E8A020]">✦ Sacred Sound Vibrations ✦</p>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold leading-tight text-[#FAF3E0]">
            The Chaldean <span className="italic text-[#E8A020]">Alphabet Grid</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            In numerology, names are translated into numbers. Explore the vibrational connection of the English alphabet to the planetary frequencies.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          
          {/* Left Grid Column */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-3 sm:gap-2 select-none">
            {matrixData.map((col, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <motion.div
                  key={col.num}
                  onMouseEnter={() => hoveredIdx !== idx && setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 14,
                    delay: idx * 0.05
                  }}
                  whileHover={{ y: -8, rotateX: 5, rotateY: idx % 2 === 0 ? -3 : 3 }}
                  className="flex flex-col items-center rounded-xl border p-4 transition-all duration-300 relative overflow-hidden depth-card-dark"
                  style={{
                    backgroundColor: isHovered ? "rgba(232, 160, 32, 0.06)" : "rgba(255, 255, 255, 0.02)",
                    borderColor: isHovered ? col.color : "rgba(232, 160, 32, 0.1)",
                    boxShadow: isHovered 
                      ? `0 0 20px ${col.color}25, inset 0 0 10px ${col.color}15`
                      : "none",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Number Header */}
                  <motion.span
                    animate={{
                      scale: isHovered ? 1.25 : 1,
                      color: isHovered ? col.color : "#FAF3E0",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="font-display text-3xl font-bold mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  >
                    {col.num}
                  </motion.span>

                  {/* Horizontal line */}
                  <div 
                    className="w-full h-px mb-4"
                    style={{ backgroundColor: isHovered ? `${col.color}40` : "rgba(232, 160, 32, 0.15)" }}
                  />

                  {/* Letter stack */}
                  <div className="flex flex-col gap-2 w-full items-center">
                    {col.letters.length > 0 ? (
                      col.letters.map((letter, lIdx) => (
                        <motion.div
                          key={letter}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ delay: idx * 0.04 + lIdx * 0.06 }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold border transition-all duration-200"
                          style={{
                            backgroundColor: isHovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                            borderColor: isHovered ? `${col.color}40` : "rgba(255,255,255,0.05)",
                            color: isHovered ? col.color : "rgba(250, 246, 238, 0.7)",
                          }}
                        >
                          {letter}
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        className="flex h-12 w-9 items-center justify-center rounded-lg text-base border transition-all duration-200"
                        style={{
                          backgroundColor: isHovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                          borderColor: isHovered ? `${col.color}40` : "rgba(255,255,255,0.05)",
                          color: isHovered ? col.color : "rgba(232, 160, 32, 0.35)",
                        }}
                      >
                        ✦
                      </motion.div>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* Right Planetary Panel */}
          <div className="relative h-[320px] lg:h-full min-h-[280px]">
            <AnimatePresence mode="wait">
              {activePlanet ? (
                <motion.div
                  key={activePlanet.num}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 p-6 rounded-2xl border flex flex-col justify-between text-left h-full"
                  style={{
                    backgroundColor: "rgba(10, 5, 22, 0.85)",
                    borderColor: `${activePlanet.color}40`,
                    boxShadow: `0 15px 40px rgba(0,0,0,0.5), inset 0 0 20px ${activePlanet.color}10`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold" style={{ color: activePlanet.color }}>
                        {activePlanet.symbol}
                      </span>
                      <span 
                        className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider font-display"
                        style={{ backgroundColor: `${activePlanet.color}20`, color: activePlanet.color }}
                      >
                        Number {activePlanet.num}
                      </span>
                    </div>

                    <h4 className="font-display text-2xl font-bold text-[#FAF3E0] mb-1">
                      {activePlanet.planet} Vibration
                    </h4>
                    <p className="text-xs text-slate-400 tracking-wider uppercase mb-4 border-b border-white/5 pb-2">
                      Letters: {activePlanet.letters.length > 0 ? activePlanet.letters.join(", ") : "Sacred (No Letters)"}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-550 font-semibold uppercase tracking-wider block">Governed Domains</span>
                        <p className="text-sm text-slate-350">{activePlanet.governs}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-550 font-semibold uppercase tracking-wider block">Primary Keywords</span>
                        <p className="text-sm text-slate-350">{activePlanet.keywords}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activePlanet.color }} />
                    <span className="text-[10px] text-slate-400 tracking-wide uppercase">
                      Channeling {activePlanet.planet} energy
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 p-6 rounded-2xl border border-dashed border-[#E8A020]/20 flex flex-col items-center justify-center text-center h-full"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.01)",
                  }}
                >
                  <svg
                    className="w-12 h-12 text-[#E8A020]/25 mb-4 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <p className="text-sm text-slate-400 font-display">
                    Hover over any matrix column to decode its planetary vibration and letter connections.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
