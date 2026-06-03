"use client";

import { useMemo, useState, useEffect } from "react";
import {
  CalendarDays,
  Sparkles,
  Grid,
  Car,
  Calendar,
  Printer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import {
  calculatePsychicNumber,
  calculateDestinyNumber,
  calculateChaldeanNameNumber,
  calculateLoShuGrid,
  calculateVehicleVibration,
  checkVehicleCompatibility,
  calculatePersonalYear,
  getDomainScores,
} from "@/lib/numerology";
import {
  PLANETS,
  DOB_COMBINATIONS,
  MISSING_REMEDIES,
  LIFE_PATH_MEANINGS,
  DESTINY_MEANINGS,
  LO_SHU_NUMBER_MEANINGS,
  MISSING_NUMBER_REMEDIES,
  VEHICLE_VIBRATION_MEANINGS,
} from "@/lib/numerology-interpretations";
import { AdminChatbot } from "./AdminChatbot";
import { AdvancedPremiumReportGenerator } from "./AdvancedPremiumReportGenerator";
import { ChatMessage } from "@/components/ChatMessage";
import { NameCorrectionTool } from "./NameCorrectionTool";
import { AdminBabyNameRanker } from "./AdminBabyNameRanker";
import { AdminAIGroqSuggestor } from "./AdminAIGroqSuggestor";
import { analysePlanes, type PlaneAnalysis } from "@/lib/loshu-planes";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  booking_date: string;
  time_slot: string;
  mode: string;
  status: string;
  amount_paid: number;
  focus_areas: string | null;
  additional_dobs: string | null;
  created_at: string;
  clients: {
    id: string;
    name: string;
    email: string;
    phone: string;
    date_of_birth: string | null;
    notes: string | null;
  } | null;
  services: {
    id: string;
    name: string;
    slug: string;
    duration_minutes: number;
  } | null;
}

export function AdminNumerologyWorkspace({ bookings = [] }: { bookings?: Booking[] }) {
  const [activeSubTab, setActiveSubTab] = useState<
    "dob" | "name" | "name_correction" | "loshu" | "vehicle" | "personal_year" | "chatbot" | "report" | "baby_names" | "ai_suggest"
  >("dob");

  return (
    <div className="space-y-6 print:space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E8A020]/15 pb-4 print:hidden">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">
            Numerology Diagnostics Workspace
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Advanced diagnostic engines for professional client chart analysis.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E8A020]/25 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-[#E8A020]/10 transition"
        >
          <Printer className="h-4 w-4" /> Print Workspace
        </button>
      </div>

      {/* Global Autofill */}
      {bookings && bookings.length > 0 && (
        <div className="flex items-center gap-4 bg-[#FDF9F1] px-5 py-3.5 rounded-xl border border-[#E8A020]/20 print:hidden shadow-sm">
           <label className="text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
             Auto-fill from Booking:
           </label>
           <select 
             onChange={(e) => {
               const b = bookings.find((x) => x.id === e.target.value);
               if (b && b.clients) {
                 window.dispatchEvent(new CustomEvent('autofill-client', {
                   detail: { 
                     name: b.clients.name, 
                     dob: b.clients.date_of_birth || "", 
                     service: b.services?.name || "" 
                   }
                 }));
               }
             }}
             className="w-full max-w-sm h-9 px-3 rounded-lg border border-[#E8A020]/30 bg-white text-sm text-slate-800 outline-none focus:border-[#E8A020] focus:ring-1 transition"
           >
             <option value="">-- Select an existing booking --</option>
             {bookings.map((b) => (
               <option key={b.id} value={b.id}>
                 {b.clients?.name} {b.clients?.date_of_birth ? `(${b.clients.date_of_birth})` : ""} - {b.services?.name}
               </option>
             ))}
           </select>
        </div>
      )}

      {/* Sub tabs for calculators */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#E8A020]/10 pb-px print:hidden">
        {[
          { id: "dob", label: "DOB Combination", icon: CalendarDays },
          { id: "name", label: "Name Vibrations", icon: Sparkles },
          { id: "name_correction", label: "Name Correction", icon: Sparkles },
          { id: "baby_names", label: "Baby Name Ranker", icon: Sparkles },
          { id: "ai_suggest", label: "AI Groq Suggestor", icon: Sparkles },
          { id: "loshu", label: "Lo Shu Grid", icon: Grid },
          { id: "vehicle", label: "Vehicle Compatibility", icon: Car },
          { id: "personal_year", label: "Personal Year Theme", icon: Calendar },
          { id: "chatbot", label: "Diagnostics Bot", icon: MessageSquare },
          { id: "report", label: "Premium Report", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all duration-150 ${
                active
                  ? "border-[#D4700A] text-slate-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Calculator Content */}
      <div className="bg-white/72 backdrop-blur-md rounded-2xl border border-[#E8A020]/16 p-6 shadow-sm print:border-none print:shadow-none print:p-0">
        <div className={activeSubTab === "dob" ? "block" : "hidden"}>
          <AdvancedDOBCombinationAnalyser />
        </div>
        <div className={activeSubTab === "name" ? "block" : "hidden"}>
          <AdvancedNameNumberCalculator />
        </div>
        <div className={activeSubTab === "name_correction" ? "block" : "hidden"}>
          <NameCorrectionTool />
        </div>
        <div className={activeSubTab === "loshu" ? "block" : "hidden"}>
          <AdvancedLoShuGridAnalyser />
        </div>
        <div className={activeSubTab === "vehicle" ? "block" : "hidden"}>
          <AdvancedVehicleVibrationAnalyser />
        </div>
        <div className={activeSubTab === "personal_year" ? "block" : "hidden"}>
          <AdvancedPersonalYearAnalyser />
        </div>
        <div className={activeSubTab === "chatbot" ? "block" : "hidden"}>
          <AdminChatbot bookings={bookings} />
        </div>
        <div className={activeSubTab === "report" ? "block" : "hidden"}>
          <AdvancedPremiumReportGenerator />
        </div>
        <div className={activeSubTab === "baby_names" ? "block" : "hidden"}>
          <AdminBabyNameRanker />
        </div>
        <div className={activeSubTab === "ai_suggest" ? "block" : "hidden"}>
          <AdminAIGroqSuggestor />
        </div>
      </div>
    </div>
  );
}

// 1. DOB COMBINATION ANALYSER
function AdvancedDOBCombinationAnalyser() {
  const [dob, setDob] = useState("16/12/1982");

  useEffect(() => {
    const handle = (e: Event) => { const detail = (e as CustomEvent).detail; if (detail?.dob) setDob(detail.dob); };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const result = useMemo(() => {
    if (!dob.trim()) return null;
    try {
      const psychic = calculatePsychicNumber(dob);
      const destiny = calculateDestinyNumber(dob);
      const psychicPlanet = PLANETS[psychic] || "Unknown";
      const destinyPlanet = PLANETS[destiny] || "Unknown";
      const combKey = `${psychic}-${destiny}`;
      const combination = DOB_COMBINATIONS[combKey] || {
        nature: "Neutral",
        summary: "Standard planetary resonance. Balancing of energies is recommended.",
        bestNameSeries: "1, 3, 5, 6",
      };

      const psychicScores = getDomainScores(psychic);
      const destinyScores = getDomainScores(destiny);

      const psychicDetails = LIFE_PATH_MEANINGS[psychic];
      const destinyDetails = DESTINY_MEANINGS[destiny];

      return {
        psychic,
        psychicPlanet,
        destiny,
        destinyPlanet,
        combKey,
        nature: combination.nature,
        summary: combination.summary,
        bestNameSeries: combination.bestNameSeries,
        psychicScores,
        destinyScores,
        psychicDetails,
        destinyDetails,
      };
    } catch {
      return null;
    }
  }, [dob]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between border-b border-[#E8A020]/10 pb-4 print:pb-0">
        <div className="max-w-xs">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Date of Birth
          </label>
          <input
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-lg font-bold text-slate-800">
            DOB: {dob}
          </p>
        </div>
        <div className="text-right print:text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Diagnostic Tool
          </span>
          <span className="text-xs font-semibold text-[#D4700A]">
            DOB Combination & Destiny Matrix
          </span>
        </div>
      </div>

      {result ? (
        <div className="space-y-6 print:space-y-8">
          {/* Section A: Core Numbers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Psychic Number (Driver)
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.psychic}
              </span>
              <span className="text-xs font-semibold text-slate-600 block">
                Ruling Planet: {result.psychicPlanet}
              </span>
            </div>

            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Destiny Number (Conductor)
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.destiny}
              </span>
              <span className="text-xs font-semibold text-slate-600 block">
                Ruling Planet: {result.destinyPlanet}
              </span>
            </div>
          </div>

          {/* Section A2: Archetypes & Profiles */}
          {result.psychicDetails && result.destinyDetails && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E8A020]/12 bg-white p-4 space-y-2">
                <div className="border-b border-[#E8A020]/10 pb-2 mb-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Psychic Personality Profile</span>
                  <span className="text-sm font-bold text-[#D4700A]">{result.psychicDetails.archetype}</span>
                </div>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> {result.psychicDetails.keywords.join(", ")}</p>
                <p className="text-xs text-slate-600"><strong>Ruling Planet:</strong> {result.psychicDetails.ruling_planet}</p>
                <p className="text-xs text-slate-600"><strong>Friendly Vibrations:</strong> {result.psychicDetails.compatibility.join(", ")}</p>
              </div>

              <div className="rounded-xl border border-[#E8A020]/12 bg-white p-4 space-y-2">
                <div className="border-b border-[#E8A020]/10 pb-2 mb-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Destiny Path Guidance</span>
                  <span className="text-sm font-bold text-[#D4700A]">{result.destinyDetails.archetype}</span>
                </div>
                <p className="text-xs text-slate-600"><strong>Theme Keywords:</strong> {result.destinyDetails.keywords.join(", ")}</p>
                <p className="text-xs text-slate-600"><strong>Professional Directive:</strong> {result.destinyDetails.guidance}</p>
              </div>
            </div>
          )}

          {/* Section B: Combination Reading */}
          <div className="rounded-xl border border-[#E8A020]/12 bg-white p-5">
            <div className="flex items-center justify-between border-b border-[#E8A020]/10 pb-3 mb-3">
              <h4 className="font-display text-sm font-bold text-slate-800">
                Combination Reading: {result.combKey} ({result.nature})
              </h4>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E8A020]/10 text-[#D4700A]">
                {result.nature} Nature
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Section C: Target Name Series */}
          <div className="rounded-xl border border-teal-600/12 bg-teal-50/20 p-5">
            <h4 className="font-display text-sm font-bold text-teal-800 mb-2">
              Recommended Target Name Series
            </h4>
            <p className="text-sm text-slate-700 mb-3">
              To harmonise the {result.combKey} birth chart, name compound totals should reduce to one of the following single-digit series:
            </p>
            <div className="flex flex-wrap gap-2">
              {result.bestNameSeries.split(",").map((s) => (
                <span
                  key={s}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-600/10 border border-teal-600/20 text-sm font-bold text-teal-700"
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Section D: Domain Scores */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Psychic Scores */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Psychic Vibration Domain Scores ({result.psychicPlanet})
              </h5>
              <ScoreBars scores={result.psychicScores} />
            </div>

            {/* Destiny Scores */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Destiny Vibration Domain Scores ({result.destinyPlanet})
              </h5>
              <ScoreBars scores={result.destinyScores} />
            </div>
          </div>

          {/* AI Deep Dive */}
          <AIDeepDive section="dob" parameters={{ psychic: result.psychic, destiny: result.destiny }} />
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">Please enter a valid Date of Birth.</p>
      )}
    </div>
  );
}

// 2. NAME NUMBER CALCULATOR
function AdvancedNameNumberCalculator() {
  const [name, setName] = useState("Rahul Sharma");

  useEffect(() => {
    const handle = (e: Event) => { const detail = (e as CustomEvent).detail; if (detail?.name) setName(detail.name); };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const [dob, setDob] = useState("16/12/1982"); // used for compatibility calculations

  const result = useMemo(() => {
    if (!name.trim()) return null;
    const calc = calculateChaldeanNameNumber(name);

    let psychic = null;
    let destiny = null;
    let compatibility = null;
    let oppositionWarning = false;

    if (dob.trim()) {
      try {
        psychic = calculatePsychicNumber(dob);
        destiny = calculateDestinyNumber(dob);

        // Opposition check: 3 vs 6
        if (
          (calc.nameNumber === 3 && (psychic === 6 || destiny === 6)) ||
          (calc.nameNumber === 6 && (psychic === 3 || destiny === 3))
        ) {
          oppositionWarning = true;
        }

        // Check if name reduces to one of the lucky series for this combination
        const combKey = `${psychic}-${destiny}`;
        const comb = DOB_COMBINATIONS[combKey];
        const bestSeries = comb?.bestNameSeries.split(",").map((s) => Number(s.trim())) || [];
        const isLucky = bestSeries.includes(calc.nameNumber);

        compatibility = {
          isLucky,
          bestSeries,
          psychic,
          destiny,
        };
      } catch {
        // ignore DOB parsing error for compatibility
      }
    }

    return {
      ...calc,
      compatibility,
      oppositionWarning,
    };
  }, [name, dob]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 border-b border-[#E8A020]/10 pb-4 print:pb-0">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Target Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-lg font-bold text-slate-800">
            Name: {name}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Owner DOB (optional)
          </label>
          <input
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-xs font-medium text-slate-500">
            DOB: {dob || "Not provided"}
          </p>
        </div>
      </div>

      {result ? (
        <div className="space-y-6 print:space-y-8">
          {/* Main Numbers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Chaldean Compound Total
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.compound}
              </span>
              <span className="text-xs font-bold text-slate-600">
                Verdict: <span className={result.verdict.includes("Good") || result.verdict.includes("Best") || result.verdict.includes("Excellent") ? "text-green-600" : "text-amber-600"}>{result.verdict}</span>
              </span>
            </div>

            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Name Number (Reduced)
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.nameNumber}
              </span>
              <span className="text-xs font-semibold text-slate-600 block">
                Planet: {result.planet}
              </span>
            </div>
          </div>

          {/* Opposition Warning & Alerts */}
          {result.oppositionWarning && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3 text-red-800">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm">Critical 3-6 Opposition Conflict!</h5>
                <p className="text-xs mt-1">
                  This name vibrates to {result.nameNumber} (ruled by {result.planet}), which stands in direct numbers conflict with a 3 or 6 in the client&apos;s DOB. This opposition frequently causes legal friction, blockages, and delayed marriage/success.
                </p>
              </div>
            </div>
          )}

          {result.compatibility && (
            <div className={`rounded-xl border p-4 flex gap-3 ${result.compatibility.isLucky ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50/50 text-amber-800"}`}>
              {result.compatibility.isLucky ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
              )}
              <div>
                <h5 className="font-bold text-sm">
                  {result.compatibility.isLucky ? "Lucky Name Alignment!" : "Compatibility Alignment Check"}
                </h5>
                <p className="text-xs mt-1">
                  {result.compatibility.isLucky
                    ? `Perfect match: Name Number ${result.nameNumber} matches the lucky numbers series (${result.compatibility.bestSeries.join(", ")}) calculated for client DOB Combination ${result.compatibility.psychic}-${result.compatibility.destiny}.`
                    : `Attention: Name Number ${result.nameNumber} is not inside the recommended lucky series (${result.compatibility.bestSeries.join(", ")}) for this DOB Combination. Spelling adjustment is advised.`}
                </p>
              </div>
            </div>
          )}

          {/* Section B: Compound Meaning Description */}
          <div className="rounded-xl border border-[#E8A020]/12 bg-white p-5">
            <h4 className="font-display text-sm font-bold text-slate-800 border-b border-[#E8A020]/10 pb-2 mb-2">
              Compound Number {result.compound} Interpretation
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              {result.summary}
            </p>
            {result.famousExamples && result.famousExamples !== "—" && (
              <p className="text-xs text-slate-500 font-semibold">
                Famous Examples: <span className="text-slate-700">{result.famousExamples}</span>
              </p>
            )}
          </div>

          {/* Section C: Letter Breakdown */}
          <div className="rounded-xl border border-[#E8A020]/12 overflow-hidden bg-white">
            <div className="bg-[#E8A020]/5 px-4 py-2.5 border-b border-[#E8A020]/12">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-600">
                Chaldean Name Letter Value Analysis
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-center">
                <thead>
                  <tr className="bg-slate-50">
                    {result.letterBreakdown.map((item, idx) => (
                      <th key={idx} className="px-3 py-2 text-xs font-bold text-slate-500 border-r border-slate-100 last:border-0">
                        {item.letter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {result.letterBreakdown.map((item, idx) => (
                      <td key={idx} className="px-3 py-2 text-sm font-bold text-[#D4700A] font-numeral border-r border-slate-100 last:border-0">
                        {item.value}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Chaldean Alphabet Grid */}
          <div className="rounded-xl border border-[#E8A020]/12 overflow-hidden bg-white p-5 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-600">
                Interactive Chaldean Reference Grid
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Highlighted letters are active in the entered name: &ldquo;{name.toUpperCase()}&rdquo;
              </p>
            </div>
            
            <div className="grid grid-cols-9 gap-1 text-center">
              {[
                { val: 1, letters: ["A", "I", "J", "Q", "Y"] },
                { val: 2, letters: ["B", "K", "R"] },
                { val: 3, letters: ["C", "G", "L", "S"] },
                { val: 4, letters: ["D", "M", "T"] },
                { val: 5, letters: ["E", "H", "N", "X"] },
                { val: 6, letters: ["U", "V", "W"] },
                { val: 7, letters: ["O", "Z"] },
                { val: 8, letters: ["F", "P"] },
                { val: 9, letters: [] },
              ].map((col) => {
                return (
                  <div key={col.val} className="flex flex-col gap-1.5 p-1 bg-slate-50/50 rounded border border-slate-100">
                    <span className="text-sm font-bold text-[#D4700A] border-b border-slate-200 pb-1 mb-1 font-numeral">
                      {col.val}
                    </span>
                    {col.letters.length > 0 ? (
                      col.letters.map((lettr) => {
                        const isActive = name.toUpperCase().includes(lettr);
                        return (
                          <span
                            key={lettr}
                            className={`inline-block py-1 rounded text-xs font-bold transition-all ${
                              isActive
                                ? "bg-amber-500 text-white shadow-sm scale-105"
                                : "bg-white border border-slate-200 text-slate-400 opacity-60"
                            }`}
                          >
                            {lettr}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[9px] font-bold text-slate-300 italic py-2">
                        Sacred
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Domain Scores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Name Vibration Domain Scores
            </h4>
            <ScoreBars scores={result.scores} />
          </div>

          {/* AI Deep Dive */}
          <AIDeepDive section="name" parameters={{ name, compound: result.compound, single: result.nameNumber, dob, psychic: result.compatibility?.psychic, destiny: result.compatibility?.destiny }} />
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">Please enter a name to analyze.</p>
      )}
    </div>
  );
}

// 3. LO SHU GRID ANALYSER
function AdvancedLoShuGridAnalyser() {
  const [dob, setDob] = useState("16/12/1982");

  useEffect(() => {
    const handle = (e: Event) => { const detail = (e as CustomEvent).detail; if (detail?.dob) setDob(detail.dob); };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const result = useMemo(() => {
    if (!dob.trim()) return null;
    try {
      const gridResult = calculateLoShuGrid(dob);
      const planes = analysePlanes(gridResult.counts);
      return { ...gridResult, advancedPlanes: planes };
    } catch {
      return null;
    }
  }, [dob]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between border-b border-[#E8A020]/10 pb-4 print:pb-0">
        <div className="max-w-xs">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Date of Birth
          </label>
          <input
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-lg font-bold text-slate-800">
            DOB: {dob}
          </p>
        </div>
        <div className="text-right print:text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Diagnostic Tool
          </span>
          <h3 className="font-display text-xl font-bold text-slate-800">
            Lo Shu Grid
          </h3>
        </div>
      </div>

      {result ? (
        <div className="space-y-6 print:space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Visual Grid */}
            <div className="rounded-2xl border border-[#E8A020]/15 bg-white p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Lo Shu Grid Layout
              </h4>
              <div className="grid grid-cols-3 gap-2 w-64 h-64">
                {result.grid.map((row, rIdx) =>
                  row.map((val, cIdx) => {
                    const standardNumbers = [
                      [4, 9, 2],
                      [3, 5, 7],
                      [8, 1, 6],
                    ];
                    const num = standardNumbers[rIdx][cIdx];
                    const repeats = val;
                    const isPresent = repeats > 0;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`flex flex-col items-center justify-center border-2 rounded-xl transition-all ${
                          isPresent
                            ? "bg-amber-500/10 border-[#E8A020] text-[#D4700A] shadow-sm"
                            : "bg-white border-slate-200 text-slate-300"
                        }`}
                      >
                        <span className="text-2xl font-extrabold font-numeral">
                          {isPresent ? num : ""}
                        </span>
                        {isPresent && (
                          <span className="text-[9px] font-bold uppercase tracking-wide mt-1">
                            {repeats}x
                          </span>
                        )}
                        {!isPresent && (
                          <span className="text-xs text-slate-300 font-numeral">
                            {num}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-4">
              {/* Present Element Correspondence */}
              <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/5 p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Active Element Alignments
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.keys(result.counts).map((num) => {
                    const meaning = LO_SHU_NUMBER_MEANINGS[Number(num)];
                    if (!meaning) return null;
                    return (
                      <div key={num} className="bg-white border border-[#E8A020]/12 p-2 rounded-lg">
                        <span className="font-bold text-slate-800 mr-1.5">{num}</span>
                        <span className="text-slate-500">{meaning.element}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Present Numbers
                  </span>
                  <div className="flex gap-1.5 mt-1">
                    {result.present.map((n) => (
                      <span key={n} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-50 border border-green-200 text-xs font-bold text-green-700">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Missing Numbers
                  </span>
                  <div className="flex gap-1.5 mt-1">
                    {result.missing.map((n) => (
                      <span key={n} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Prominent/Excessive Numbers (&gt;= 3 repeats)
                </span>
                <div className="flex gap-1.5 mt-1">
                  {result.prominent.length > 0 ? (
                    result.prominent.map((n) => (
                      <span key={n} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700">
                        {n}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1 — YOG DETECTION */}
          <div className="space-y-4">
            {result.advancedPlanes.find((p) => p.isGoldenYog) ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 p-6 shadow-lg shadow-amber-500/10 text-center"
              >
                <div className="flex justify-center mb-3">
                  <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                </div>
                <h3 className="font-display text-2xl font-bold text-amber-700 tracking-widest uppercase">
                  ✦ Golden Yog Detected ✦
                </h3>
                <p className="mt-2 text-sm font-medium text-amber-800 max-w-2xl mx-auto">
                  {result.advancedPlanes.find((p) => p.isGoldenYog)?.reading}
                </p>
              </motion.div>
            ) : result.advancedPlanes.find((p) => p.isSilverYog) ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-50 to-slate-200 p-6 shadow-lg shadow-slate-500/10 text-center"
              >
                <div className="flex justify-center mb-3">
                  <Sparkles className="h-8 w-8 text-slate-500 animate-pulse" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-700 tracking-widest uppercase">
                  ✦ Silver Yog Detected ✦
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-800 max-w-2xl mx-auto">
                  {result.advancedPlanes.find((p) => p.isSilverYog)?.reading}
                </p>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Neither Yog is currently active
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  Missing numbers preventing activation:{" "}
                  {Array.from(new Set([
                      ...(result.advancedPlanes.find(p => p.name === 'Golden Yog')?.missingNumbers || []),
                      ...(result.advancedPlanes.find(p => p.name === 'Silver Yog')?.missingNumbers || [])
                    ])).join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2 — PLANES OVERVIEW */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Planes Overview
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {result.advancedPlanes.map((plane) => (
                <div
                  key={plane.name}
                  className="rounded-lg border border-slate-200 bg-white p-2 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:border-[#E8A020]/30 transition-colors"
                  onClick={() => document.getElementById(`plane-${plane.name.replace(/\\s+/g, '-')}`)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="font-display text-[10px] font-bold text-slate-700 leading-tight mb-1">
                    {plane.name}
                  </span>
                  <span className="text-[9px] text-slate-400 mb-1.5">{plane.numbers.join('-')}</span>
                  {plane.isComplete ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3 — ROWS */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-800">Horizontal Planes — Rows</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {result.advancedPlanes.filter((p) => p.type === 'row').map((plane) => (
                <PlaneDetailCard key={plane.name} plane={plane} />
              ))}
            </div>
          </div>

          {/* SECTION 4 — COLUMNS */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-800">Vertical Planes — Columns</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {result.advancedPlanes.filter((p) => p.type === 'column').map((plane) => (
                <PlaneDetailCard key={plane.name} plane={plane} />
              ))}
            </div>
          </div>

          {/* SECTION 5 — DIAGONALS */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-800">Diagonal Planes — Yogs</h3>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
              {result.advancedPlanes.filter((p) => p.type === 'diagonal').map((plane) => (
                <PlaneDetailCard key={plane.name} plane={plane} isSpecial />
              ))}
            </div>
          </div>

          {/* SECTION 6 — SUMMARY READING */}
          <div className="rounded-xl border-l-4 border-l-[#E8A020] bg-[#FAF6EE] p-5 shadow-sm mt-8">
            <h4 className="text-xs font-bold text-[#E8A020] uppercase tracking-wider mb-2">Automated Summary Reading</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              This chart has <strong>{result.advancedPlanes.filter(p => p.isComplete).length} complete planes</strong> and <strong>{result.advancedPlanes.filter(p => !p.isComplete).length} incomplete planes</strong>. 
              {result.advancedPlanes.filter(p => p.isComplete).length > 0 && (
                <> The strongest area is the <strong>{result.advancedPlanes.find(p => p.isComplete)?.name}</strong> — {result.advancedPlanes.find(p => p.isComplete)?.reading}</>
              )}
              {result.advancedPlanes.some(p => p.isGoldenYog || p.isSilverYog) && (
                <span className="block mt-2 text-[#D4700A] font-bold">
                  The {result.advancedPlanes.find(p => p.isGoldenYog) ? 'Golden' : 'Silver'} Yog is active — this is a highly significant indicator of lifelong success and abundance.
                </span>
              )}
            </p>
          </div>

          {/* Section C: Remedies for Missing Numbers */}
          <div className="space-y-3 border-t border-[#E8A020]/10 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Missing Number Remedies & Alignments
            </h4>
            <div className="space-y-3">
              {result.missing.map((n) => {
                const data = MISSING_REMEDIES[n];
                const remedyDetail = MISSING_NUMBER_REMEDIES[n];
                if (!data) return null;
                return (
                  <div key={n} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                        {n}
                      </span>
                      <h5 className="font-bold text-xs text-slate-800">
                        Lacking {data.planet} Energy (Focus: {remedyDetail?.focus || data.lacking})
                      </h5>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Practical Remedies</span>
                        <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                          {data.remedies.map((rem: string, idx: number) => (
                            <li key={idx}>{rem}</li>
                          ))}
                          {remedyDetail?.practices.map((prac: string, idx: number) => (
                            <li key={idx} className="text-[#D4700A] font-semibold">{prac}</li>
                          ))}
                        </ul>
                      </div>
                      {remedyDetail?.affirmation && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Aura Affirmation</span>
                          <p className="text-xs italic text-slate-700 font-medium">
                            &ldquo;{remedyDetail.affirmation}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Deep Dive */}
          <AIDeepDive section="loshu" parameters={{ present: result.present, missing: result.missing }} />
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">Please enter a valid Date of Birth.</p>
      )}
    </div>
  );
}

// 4. VEHICLE VIBRATION ANALYSER
function AdvancedVehicleVibrationAnalyser() {
  const [vehicle, setVehicle] = useState("DL3C-AK-4792");
  const [ownerLifePath, setOwnerLifePath] = useState("7");

  useEffect(() => {
    const handle = (e: Event) => { 
      const detail = (e as CustomEvent).detail;
      if (detail?.lifePath) setOwnerLifePath(detail.lifePath);
    };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const result = useMemo(() => {
    if (!vehicle.trim()) return null;
    const calc = calculateVehicleVibration(vehicle);
    const ownerPathNum = parseInt(ownerLifePath.trim());

    let compatibility = null;
    if (!isNaN(ownerPathNum)) {
      compatibility = checkVehicleCompatibility(calc.vibration, ownerPathNum);
    }

    const vibrationDetails = VEHICLE_VIBRATION_MEANINGS[calc.vibration];

    return {
      ...calc,
      compatibility,
      vibrationDetails,
    };
  }, [vehicle, ownerLifePath]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 border-b border-[#E8A020]/10 pb-4 print:pb-0">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Vehicle Registration Number
          </label>
          <input
            type="text"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            placeholder="e.g. DL3C-AK-4792"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-lg font-bold text-slate-800">
            Vehicle No: {vehicle}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Owner&apos;s Life Path or Destiny Number
          </label>
          <input
            type="number"
            min="1"
            max="9"
            value={ownerLifePath}
            onChange={(e) => setOwnerLifePath(e.target.value)}
            placeholder="1-9"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-xs font-medium text-slate-500">
            Owner Path: {ownerLifePath}
          </p>
        </div>
      </div>

      {result ? (
        <div className="space-y-6 print:space-y-8">
          {/* Main Numbers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Digits Sum (Compound)
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.compound}
              </span>
            </div>

            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Reduced Vibration Number
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.vibration}
              </span>
              <span className="text-xs font-semibold text-slate-600 block">
                Ruling Planet: {PLANETS[result.vibration]}
              </span>
            </div>
          </div>

          {/* Vibration Archetype Details */}
          {result.vibrationDetails && (
            <div className="rounded-xl border border-[#E8A020]/12 bg-white p-5 space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle Vibration Profile</span>
              <p className="text-sm font-bold text-slate-800">{result.vibrationDetails.theme}</p>
              <p className="text-xs text-slate-600"><strong>Best For:</strong> {result.vibrationDetails.bestFor.join(", ")}</p>
              <p className="text-xs text-amber-700 font-semibold"><strong>Caution Checklist:</strong> {result.vibrationDetails.caution}</p>
            </div>
          )}

          {/* Compatibility results */}
          {result.compatibility && (
            <div
              className={`rounded-xl border p-5 space-y-2 ${
                result.compatibility.rating === "excellent"
                  ? "border-green-200 bg-green-50/20 text-green-800"
                  : result.compatibility.rating === "good"
                  ? "border-teal-200 bg-teal-50/20 text-teal-800"
                  : result.compatibility.rating === "neutral"
                  ? "border-amber-200 bg-amber-50/20 text-amber-800"
                  : "border-red-200 bg-red-50/20 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.compatibility.compatible ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0" />
                )}
                <h4 className="font-display text-sm font-bold capitalize">
                  {result.compatibility.rating} Compatibility Match
                </h4>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                {result.compatibility.message}
              </p>
            </div>
          )}

          {/* Numerical breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Digits Extracted for Calculation
            </h4>
            <div className="flex gap-2">
              {result.digits.map((digit, idx) => (
                <span
                  key={idx}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 font-numeral"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8A020]/10 print:hidden">
            <AIDeepDive section="vehicle" parameters={{ regNumber: vehicle, compound: result.compound, vibration: result.vibration, ownerLifePath }} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">Please enter a valid registration number.</p>
      )}
    </div>
  );
}

// 5. PERSONAL YEAR ANALYSER
function AdvancedPersonalYearAnalyser() {
  const [dob, setDob] = useState("16/12/1982");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const handle = (e: Event) => { const detail = (e as CustomEvent).detail; if (detail?.dob) setDob(detail.dob); };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const result = useMemo(() => {
    if (!dob.trim()) return null;
    try {
      return calculatePersonalYear(dob, targetYear);
    } catch {
      return null;
    }
  }, [dob, targetYear]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 border-b border-[#E8A020]/10 pb-4 print:pb-0">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Date of Birth
          </label>
          <input
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-lg font-bold text-slate-800">
            DOB: {dob}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Target Year
          </label>
          <input
            type="number"
            value={targetYear}
            onChange={(e) => setTargetYear(parseInt(e.target.value) || new Date().getFullYear())}
            placeholder="YYYY"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 print:hidden"
          />
          <p className="hidden print:block text-xs font-medium text-slate-500">
            Target Year: {targetYear}
          </p>
        </div>
      </div>

      {result ? (
        <div className="space-y-6 print:space-y-8">
          {/* Main Numbers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Universal Year ({targetYear})
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.universalYear}
              </span>
            </div>

            <div className="rounded-xl border border-[#E8A020]/12 bg-[#E8A020]/4 p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Personal Year Vibration
              </span>
              <span className="text-4xl font-extrabold text-[#D4700A] my-1 block">
                {result.personalYear}
              </span>
              <span className="text-xs font-semibold text-slate-600 block">
                Theme: {result.theme}
              </span>
            </div>
          </div>

          {/* Theme & Focus */}
          <div className="rounded-xl border border-[#E8A020]/12 bg-white p-5 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Annual Focus & Directives
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {result.theme} Cycle
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {result.focus}
            </p>
          </div>

          {/* Best and Challenging Months */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50/20 p-4">
              <span className="text-[10px] font-bold text-green-800 uppercase tracking-wider block mb-2">
                Recommended Actions Months
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.bestMonths.map((m) => (
                  <span
                    key={m}
                    className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg bg-green-600/10 border border-green-600/20 text-xs font-bold text-green-700"
                  >
                    {getMonthName(m)}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50/20 p-4">
              <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block mb-2">
                Caution & Challenge Months
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.challengeMonths.map((m) => (
                  <span
                    key={m}
                    className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg bg-red-600/10 border border-red-600/20 text-xs font-bold text-red-700"
                  >
                    {getMonthName(m)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8A020]/10 print:hidden">
            <AIDeepDive section="personal_year" parameters={{ dob, targetYear, personalYear: result.personalYear, universalYear: result.universalYear, theme: result.theme }} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">Please enter a valid DOB.</p>
      )}
    </div>
  );
}

// Shared UI Helpers
function ScoreBars({ scores }: { scores: { health: number; relationships: number; finance: number } }) {
  const domains = [
    { label: "Health & Well-being", val: scores.health, color: "bg-red-500" },
    { label: "Love & Relationships", val: scores.relationships, color: "bg-pink-500" },
    { label: "Finance & Material Growth", val: scores.finance, color: "bg-emerald-500" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
      {domains.map((dom) => (
        <div key={dom.label} className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>{dom.label}</span>
            <span className="font-numeral">{dom.val} / 10</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${dom.color} rounded-full transition-all duration-300`}
              style={{ width: `${dom.val * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function getMonthName(m: number): string {
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return names[m - 1] || `${m}`;
}

function AIDeepDive({ section, parameters }: { section: string, parameters: Record<string, unknown> }) {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateDeepDive = async () => {
    setLoading(true);
    setReport("");
    try {
      const res = await fetch("/api/diagnostics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, parameters })
      });
      const data = await res.json();
      if (data.report) setReport(data.report);
      else setReport("⚠️ Failed to generate report.");
    } catch {
      setReport("⚠️ Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t border-[#E8A020]/20 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="font-display text-sm font-bold text-slate-800">
            <Sparkles className="inline-block w-4 h-4 text-[#D4700A] mr-1.5 mb-0.5" />
            Generate AI Deep Dive
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Produce a highly detailed markdown report pulling exact traits and remedies directly from the Chaldean Guide PDF Knowledge Base.
          </p>
        </div>
        <button
          onClick={generateDeepDive}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2.5 text-xs font-bold text-violet-700 shadow-sm hover:bg-violet-100 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Deep Dive"}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col gap-3 p-6 bg-slate-50 border border-slate-100 rounded-xl animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <p className="text-xs text-slate-400 italic mt-3">Consulting the Knowledge Base...</p>
        </div>
      )}

      {report && !loading && (
        <div className="p-6 bg-white border border-violet-100/50 rounded-xl shadow-sm">
          <ChatMessage content={report} />
        </div>
      )}
    </div>
  );
}

function PlaneDetailCard({ plane, isSpecial = false }: { plane: PlaneAnalysis; isSpecial?: boolean }) {
  const missingString = plane.missingNumbers.length > 0 ? `(Missing: ${plane.missingNumbers.join(', ')})` : '';
  
  return (
    <div
      id={`plane-${plane.name.replace(/\\s+/g, '-')}`}
      className={`rounded-xl border p-4 space-y-3 flex flex-col h-full ${
        isSpecial
          ? plane.isComplete
            ? plane.name === 'Golden Yog' ? 'border-amber-300 bg-amber-50/50' : 'border-slate-300 bg-slate-50/80'
            : 'border-slate-200 bg-white'
          : 'border-slate-200 bg-white shadow-sm hover:border-[#E8A020]/30 transition-colors'
      }`}
    >
      <div>
        <h4 className="font-display text-sm font-bold text-slate-800">
          {plane.name} <span className="text-slate-400 font-normal">· {plane.numbers.join(' · ')}</span>
        </h4>
        
        <div className="flex items-center justify-between mt-2 mb-3">
          <div className="flex gap-1.5">
            {plane.numbers.map((n: number) => {
              const isPresent = plane.presentNumbers.includes(n);
              return (
                <div
                  key={n}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    isPresent
                      ? isSpecial 
                        ? plane.name === 'Golden Yog' ? 'bg-amber-500 text-white' : 'bg-slate-600 text-white'
                        : 'bg-[#E8A020] text-white'
                      : 'border border-dashed border-slate-300 text-slate-400 bg-transparent'
                  }`}
                >
                  {n}
                </div>
              );
            })}
          </div>
          
          <div className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
            plane.isComplete ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {plane.isComplete ? 'COMPLETE ✓' : `INCOMPLETE ${missingString}`}
          </div>
        </div>

        <p className="text-[13px] text-slate-600 leading-relaxed font-sans mt-2">
          {plane.reading}
        </p>
      </div>
      
      {isSpecial && (
        <div className="mt-auto pt-3 flex justify-end">
          <div className="grid grid-cols-3 gap-0.5 w-12 h-12 opacity-50">
             {[4,9,2,3,5,7,8,1,6].map(n => {
                const isDiagonalNum = plane.numbers.includes(n);
                return (
                  <div key={n} className={`border ${isDiagonalNum ? (plane.name === 'Golden Yog' ? 'bg-amber-400 border-amber-500' : 'bg-slate-400 border-slate-500') : 'border-slate-200 bg-slate-50'} rounded-[1px]`} />
                );
             })}
          </div>
        </div>
      )}
    </div>
  );
}
