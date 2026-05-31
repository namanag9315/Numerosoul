"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Sparkles } from "lucide-react";
import {
  calculatePsychicNumber,
  calculateDestinyNumber,
  calculateChaldeanNameNumber,
} from "@/lib/numerology";
import { PLANETS } from "@/lib/numerology-interpretations";

export function ToolsPageClient() {
  return (
    <div className="space-y-12">
      {/* Public introduction banner */}
      <div className="rounded-2xl p-6 text-center bg-[#FAF6EE]/90 border border-[#E8A020]/20 max-w-3xl mx-auto shadow-sm">
        <p className="text-slate-800 font-medium text-base">
          Guided by <span className="text-[#D4700A] font-bold">Uma Rastogi</span> · Certified Numerologist
        </p>
        <p className="text-slate-500 text-xs mt-1">
          Explore the basic vibrations of your birth dates and names. For complete grids, missing number remedies, 
          compatibility warnings, and personal year reports, book a private session.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
        {/* Tool 1 */}
        <BasicDOBCombinationAnalyser />

        {/* Tool 2 */}
        <BasicNameNumberCalculator />
      </div>
    </div>
  );
}

// Public Basic DOB Combination Analyser
function BasicDOBCombinationAnalyser() {
  const [dob, setDob] = useState("16/12/1982");

  const result = useMemo(() => {
    if (!dob.trim()) return null;
    try {
      const psychic = calculatePsychicNumber(dob);
      const destiny = calculateDestinyNumber(dob);
      const psychicPlanet = PLANETS[psychic] || "Unknown";
      const destinyPlanet = PLANETS[destiny] || "Unknown";

      return {
        psychic,
        psychicPlanet,
        destiny,
        destinyPlanet,
        combinationKey: `${psychic}-${destiny}`,
      };
    } catch {
      return null;
    }
  }, [dob]);

  return (
    <ToolCard
      icon={CalendarDays}
      title="Basic DOB Analyser"
      description="Find your Psychic (birth day) and Destiny numbers from your date of birth."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Enter Date of Birth</label>
          <input
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            placeholder="DD/MM/YYYY"
            className="tool-input w-full"
          />
        </div>

        {result ? (
          <div className="mt-4 space-y-4 rounded-xl border border-[#E8A020]/15 bg-[#FFF8EE]/70 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-[#E8A020]/10 bg-white/70 p-3 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">Psychic Number</span>
                <span className="text-3xl font-bold text-[#E8A020]">{result.psychic}</span>
                <span className="mt-1 block text-xs text-slate-500">Planet: {result.psychicPlanet}</span>
              </div>
              <div className="rounded-lg border border-[#E8A020]/10 bg-white/70 p-3 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">Destiny Number</span>
                <span className="text-3xl font-bold text-[#E8A020]">{result.destiny}</span>
                <span className="mt-1 block text-xs text-slate-500">Planet: {result.destinyPlanet}</span>
              </div>
            </div>
            <div className="rounded-lg border border-[#E8A020]/20 bg-[#E8A020]/10 p-3 text-center">
              <span className="text-xs text-slate-500">Your DOB Combination: </span>
              <span className="text-lg font-bold text-[#E8A020]">{result.combinationKey}</span>
            </div>
            <p className="mt-2 text-center text-[10.5px] italic leading-relaxed text-slate-500">
              Note: Advanced combination readings, domain scores, and target name series are available in private reports.
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic mt-2">Enter a valid Date of Birth.</div>
        )}
      </div>
    </ToolCard>
  );
}

// Public Basic Name Number Calculator (Chaldean)
function BasicNameNumberCalculator() {
  const [name, setName] = useState("RAHUL");

  const result = useMemo(() => {
    if (!name.trim()) return null;
    try {
      const calc = calculateChaldeanNameNumber(name);
      return {
        compound: calc.compound,
        nameNumber: calc.nameNumber,
        planet: calc.planet,
      };
    } catch {
      return null;
    }
  }, [name]);

  return (
    <ToolCard
      icon={Sparkles}
      title="Basic Name Calculator"
      description="Find the Chaldean compound total and reduced single digit for a name."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Enter Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. RAHUL"
            className="tool-input w-full"
          />
        </div>

        {result ? (
          <div className="mt-4 space-y-4 rounded-xl border border-[#E8A020]/15 bg-[#FFF8EE]/70 p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg border border-[#E8A020]/10 bg-white/70 p-3">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">Compound Total</span>
                <span className="text-3xl font-bold text-[#E8A020]">{result.compound}</span>
              </div>
              <div className="rounded-lg border border-[#E8A020]/10 bg-white/70 p-3">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">Name Number</span>
                <span className="text-3xl font-bold text-[#E8A020]">{result.nameNumber}</span>
                <span className="mt-1 block text-xs text-slate-500">Planet: {result.planet}</span>
              </div>
            </div>
            <p className="mt-2 text-center text-[10.5px] italic leading-relaxed text-slate-500">
              Note: Compatibility checks, 3-6 opposition checks, and compound descriptions are available in private reports.
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic mt-2">Enter a name to analyze.</div>
        )}
      </div>
    </ToolCard>
  );
}

// Card Wrapper for Tools
function ToolCard({
  children,
  description,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <article
      className="card-premium p-6"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(232,160,32,0.1)",
            boxShadow: "0 0 24px rgba(232,160,32,0.08)",
          }}
        >
          <Icon className="h-5 w-5 text-[#E8A020]" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[color:var(--text-primary)]">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </article>
  );
}
