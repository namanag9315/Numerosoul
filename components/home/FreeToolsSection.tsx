"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { CalendarDays, Sparkles, Car } from "lucide-react";
import {
  calculateLifePath,
  calculateNameNumber,
  calculateVehicleVibration,
} from "@/lib/numerology";
import {
  DESTINY_MEANINGS,
  LIFE_PATH_MEANINGS,
  VEHICLE_VIBRATION_MEANINGS,
} from "@/lib/numerology-interpretations";
import { useCountUp } from "@/lib/hooks/useCountUp";

type ToolResultData = {
  number: number;
  label: string;
  meaning: string;
  total?: number;
};

export function FreeToolsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const headingText = "Calculate Your Vibrations";

  // Heading wave variants
  const waveContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 }
    }
  };

  const waveChar: Variants = {
    hidden: { y: 0 },
    visible: {
      y: [-3, 3, -3],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section
      id="tools"
      ref={containerRef}
      className="relative px-6 py-24 sm:px-10 lg:px-16 overflow-hidden bg-[#0A0516] section-gradient-depth-dark"
      style={{
        background: "linear-gradient(145deg, #0D0820 0%, #17082E 45%, #05020C 100%)"
      }}
    >
      {/* Mystical dust particle canvas or static glow */}
      <div className="absolute right-[20%] top-[40%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,160,32,0.05)_0%,transparent_70%)] blur-[70px] pointer-events-none" />
      <div className="absolute left-[15%] top-[10%] h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.05)_0%,transparent_70%)] blur-[70px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="eyebrow text-[#E8A020]">✦ Free Mystical Instruments ✦</p>
          
          {/* Character Wave Heading */}
          <motion.h2 
            variants={waveContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-4 font-display text-3xl sm:text-5xl font-bold leading-tight text-[#FAF3E0] flex justify-center flex-wrap select-none"
          >
            {headingText.split("").map((char, idx) => (
              <motion.span
                key={idx}
                variants={waveChar}
                className={char === " " ? "w-3" : "inline-block"}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Input your data into these precision-calibrated instruments to reveal the numerical harmonics shaping your life.
          </p>
        </div>

        {/* Tools grid layout */}
        <div className="grid gap-8 md:grid-cols-3">
          <LifePathTool />
          <NameNumberTool />
          <VehicleTool />
        </div>

        <div className="mt-16 text-center">
          <a
            href="/tools"
            className="btn-secondary"
            style={{
              borderColor: "#E8A020",
              color: "#FAF3E0",
            }}
          >
            See All 5 Numerical Tools
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Life Path Tool ── */
function LifePathTool() {
  const [date, setDate] = useState("");
  const result = useMemo<ToolResultData | null>(() => {
    if (!date.trim() || date.length < 10) return null;
    try {
      const c = calculateLifePath(date);
      const m = LIFE_PATH_MEANINGS[c.lifePath] ?? LIFE_PATH_MEANINGS[Number(String(c.lifePath).slice(-1))];
      return {
        number: c.lifePath,
        total: c.breakdown.total,
        label: c.isKarmic ? `${m.archetype} (${c.karmicOriginal}/${c.lifePath})` : m.archetype,
        meaning: `${m.keywords.slice(0, 3).join(", ")}. Day ${c.breakdown.dayReduced} + month ${c.breakdown.monthReduced} + year ${c.breakdown.yearReduced}.`,
      };
    } catch { return null; }
  }, [date]);

  return (
    <InstrumentPanelCard icon={CalendarDays} title="Life Path Calculator" desc="Your birthdate blueprint of destiny.">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={date}
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9]/g, "");
            if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
            if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);
            setDate(val);
          }}
          maxLength={10}
          placeholder="DD / MM / YYYY"
          className="tool-input bg-[#0A0516]/60 border-white/10 text-[#FAF3E0] placeholder-slate-500 focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/30 shadow-inner"
        />
        <InstrumentResult result={result} placeholder="Enter birth date to view arc" />
      </div>
    </InstrumentPanelCard>
  );
}

/* ── Name Number Tool ── */
function NameNumberTool() {
  const [name, setName] = useState("");
  const result = useMemo<ToolResultData | null>(() => {
    if (!name.trim()) return null;
    try {
      const c = calculateNameNumber(name, "pythagorean");
      const m = DESTINY_MEANINGS[c.nameNumber] ?? DESTINY_MEANINGS[Number(String(c.nameNumber).slice(-1))];
      return {
        number: c.nameNumber,
        total: c.compound,
        label: c.isKarmic ? `Karmic ${c.compound}/${c.nameNumber}` : m.archetype,
        meaning: m.guidance,
      };
    } catch { return null; }
  }, [name]);

  return (
    <InstrumentPanelCard icon={Sparkles} title="Destiny Name Correction" desc="Vibrations inside alphabetical letters.">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          className="tool-input bg-[#0A0516]/60 border-white/10 text-[#FAF3E0] placeholder-slate-500 focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/30 shadow-inner"
        />
        <InstrumentResult result={result} placeholder="Type full name to view arc" />
      </div>
    </InstrumentPanelCard>
  );
}

/* ── Vehicle Vibration Tool ── */
function VehicleTool() {
  const [vehicle, setVehicle] = useState("");
  const result = useMemo<ToolResultData | null>(() => {
    if (!vehicle.trim() || vehicle.length < 4) return null;
    try {
      const c = calculateVehicleVibration(vehicle);
      if (c.digits.length === 0) return null;
      const m = VEHICLE_VIBRATION_MEANINGS[c.vibration];
      return {
        number: c.vibration,
        total: c.vibration,
        label: m.theme,
        meaning: `${m.bestFor.slice(0, 2).join(", ")}. ${m.caution}`,
      };
    } catch { return null; }
  }, [vehicle]);

  return (
    <InstrumentPanelCard icon={Car} title="Vehicle Lucky Vibration" desc="Calculate registration energy matching.">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          placeholder="MP 09 AB 1234"
          className="tool-input uppercase bg-[#0A0516]/60 border-white/10 text-[#FAF3E0] placeholder-slate-500 focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/30 shadow-inner"
        />
        <InstrumentResult result={result} placeholder="Enter license plate to view arc" />
      </div>
    </InstrumentPanelCard>
  );
}

/* ── Instrument Panel Container Card ── */
function InstrumentPanelCard({
  icon: Icon,
  title,
  desc,
  children
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: string | number }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="p-6 rounded-2xl border flex flex-col justify-between depth-card-dark"
      whileHover={{ y: -8, rotateX: 4, rotateY: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        borderColor: "rgba(232, 160, 32, 0.08)",
        boxShadow: "inset 0 0 15px rgba(255,255,255,0.01), 0 10px 30px rgba(0,0,0,0.4)",
        transformStyle: "preserve-3d",
      }}
    >
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Icon className="h-5 w-5 text-[#E8A020]" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#FAF3E0]">{title}</h3>
            <p className="text-[11px] text-slate-500">{desc}</p>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

/* ── Interactive Results Panel (Speedometer) ── */
function InstrumentResult({ result, placeholder }: { result: ToolResultData | null; placeholder: string }) {
  const displayVal = useCountUp(result?.number ?? 0, 800);

  // Math for SVG Speedometer arc
  // Radius = 40, circumference = 2 * PI * r = 251.3
  // Since it's a semi-circle (speedometer), we only draw half of it.
  // Half of circumference = 125.6
  const r = 36;
  const strokeCircumference = Math.PI * r; // ~113
  const valueOffset = result ? strokeCircumference - (strokeCircumference * result.number) / 9 : strokeCircumference;

  if (!result) {
    return (
      <div 
        className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs text-slate-500"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        {placeholder}
      </div>
    );
  }

  return (
    <motion.div
      key={`${result.number}-${result.total}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 rounded-xl border flex flex-col items-center"
      style={{
        backgroundColor: "rgba(10, 5, 22, 0.45)",
        borderColor: "rgba(232, 160, 32, 0.15)",
        boxShadow: "inset 0 0 10px rgba(232,160,32,0.03)"
      }}
    >
      {/* Speedometer Arc SVG */}
      <div className="relative flex items-center justify-center w-36 h-20 mb-3 overflow-hidden">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background Track */}
          <path
            d="M 14 45 A 36 36 0 0 1 86 45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Active Colored Arc */}
          <motion.path
            d="M 14 45 A 36 36 0 0 1 86 45"
            fill="none"
            stroke="#E8A020"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={strokeCircumference}
            initial={{ strokeDashoffset: strokeCircumference }}
            animate={{ strokeDashoffset: valueOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              filter: "drop-shadow(0 0 4px #E8A020)",
            }}
          />
        </svg>

        {/* Counter Number Display centered in the arc */}
        <div className="absolute bottom-1 flex flex-col items-center justify-center">
          <span className="font-numeral text-4xl font-bold text-[#E8A020] drop-shadow-[0_0_10px_rgba(232,160,32,0.4)]">
            {displayVal}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500">
            Vibration
          </span>
        </div>
      </div>

      <div className="text-center w-full mt-2">
        <h4 className="font-display text-base font-bold text-[#FAF3E0] leading-tight">
          {result.label}
        </h4>
        <p className="text-[10px] text-[#E8A020]/60 tracking-wider uppercase font-semibold mt-1">
          Compound Total: {result.total}
        </p>
        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed max-w-[220px] mx-auto border-t border-white/5 pt-2">
          {result.meaning}
        </p>
      </div>

    </motion.div>
  );
}
