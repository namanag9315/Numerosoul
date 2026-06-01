"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Sparkles, Loader2, CheckCircle2, AlertTriangle, XCircle, Baby } from "lucide-react";
import {
  calculatePsychicNumber,
  calculateDestinyNumber,
  calculateChaldeanNameNumber,
  checkNameCompatibility,
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

      <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        {/* Tool 1 */}
        <BasicDOBCombinationAnalyser />

        {/* Tool 2 */}
        <AdvancedNameSuggestor />
      </div>

      <div className="max-w-5xl mx-auto mt-12">
        <BabyNameBatchRanker />
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

// Types
interface NameSuggestion {
  name: string;
  compound: number;
  nameNumber: number;
  compatibility: {
    compatible: boolean;
    rating: string;
    message: string;
  };
}

interface BatchRankResult {
  name: string;
  calc: { compound: number; nameNumber: number; planet: string };
  comp: { rating: 'excellent' | 'good' | 'neutral' | 'challenging'; message: string };
}

// Advanced Name Suggestor (with AI Groq)
function AdvancedNameSuggestor() {
  const [name, setName] = useState("RAHUL");
  const [dob, setDob] = useState("16/12/1982");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([]);
  const [original, setOriginal] = useState<NameSuggestion | null>(null);

  const handleSuggest = async () => {
    if (!name.trim() || !dob.trim()) return;
    setLoading(true);
    setSuggestions([]);
    setOriginal(null);
    try {
      const res = await fetch("/api/tools/name-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob }),
      });
      const data = await res.json();
      if (data.original) setOriginal(data.original);
      if (data.suggestions) setSuggestions(data.suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolCard
      icon={Sparkles}
      title="Name Correction Suggestor"
      description="Find your name vibration and get AI-generated lucky spelling suggestions."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Current Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. RAHUL"
              className="tool-input w-full uppercase"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Date of Birth</label>
            <input
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="tool-input w-full"
            />
          </div>
        </div>

        <button
          onClick={handleSuggest}
          disabled={loading || !name || !dob}
          className="btn-primary w-full justify-center disabled:opacity-50"
          style={{ minHeight: "44px" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyse & Suggest Lucky Spellings ✨"}
        </button>

        {original && (
          <div className="mt-4 rounded-xl border border-[#E8A020]/20 bg-[#FFF8EE] p-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Original Name: {original.name}</h4>
            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
              <span className="text-sm font-medium">Compound: <span className="font-bold text-[#E8A020]">{original.compound}</span></span>
              <span className="text-sm font-medium">Reduced: <span className="font-bold text-[#E8A020]">{original.nameNumber}</span></span>
              <span className={`text-xs px-2 py-1 rounded-full ${original.compatibility.compatible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {original.compatibility.rating.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Top AI Suggestions</h4>
            {suggestions.map((s, i) => (
              <div key={i} className="flex flex-col rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-green-800 text-lg tracking-wider">{s.name}</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">
                    {s.compound} / {s.nameNumber}
                  </span>
                </div>
                <span className="text-[10px] text-green-700 leading-snug">{s.compatibility.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// Baby Name Batch Ranker
function BabyNameBatchRanker() {
  const [dob, setDob] = useState("");
  const [namesText, setNamesText] = useState("");
  const [results, setResults] = useState<BatchRankResult[]>([]);

  const handleRank = () => {
    if (!dob.trim() || !namesText.trim()) return;
    try {
      const psychic = calculatePsychicNumber(dob);
      const destiny = calculateDestinyNumber(dob);
      
      const names = namesText.split(/[,\n]+/).map(n => n.trim()).filter(Boolean);
      
      const ranked = names.map(name => {
        const calc = calculateChaldeanNameNumber(name);
        const comp = checkNameCompatibility(calc.nameNumber, psychic, destiny);
        return { name, calc, comp };
      });
      
      // Sort: excellent first, then good, neutral, challenging
      const order = { excellent: 1, good: 2, neutral: 3, challenging: 4 };
      ranked.sort((a, b) => order[a.comp.rating] - order[b.comp.rating]);
      
      setResults(ranked as BatchRankResult[]);
    } catch {
      alert("Invalid DOB or names.");
    }
  };

  return (
    <ToolCard
      icon={Baby}
      title="Baby Name Batch Ranker"
      description="Quickly evaluate multiple baby names against a DOB to find the most harmonising option. Saves ~20 mins per consultation!"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Baby&apos;s Date of Birth</label>
            <input
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="tool-input w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Proposed Names (comma or line separated)</label>
            <textarea
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              placeholder="e.g. Rahul, Aman, Sunita"
              className="tool-input w-full"
              rows={3}
            />
          </div>
        </div>

        <button
          onClick={handleRank}
          disabled={!dob || !namesText}
          className="btn-primary w-full justify-center disabled:opacity-50"
          style={{ minHeight: "44px" }}
        >
          Batch Rank Names
        </button>

        {results.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-[#FAF6EE]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Compound / Reduced</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Planet</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Verdict & Compatibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((res, i) => {
                  const r = res.comp.rating;
                  const Icon = r === 'excellent' || r === 'good' ? CheckCircle2 : r === 'neutral' ? AlertTriangle : XCircle;
                  const color = r === 'excellent' || r === 'good' ? 'text-green-600' : r === 'neutral' ? 'text-amber-600' : 'text-red-600';
                  const bg = r === 'excellent' || r === 'good' ? 'bg-green-50' : r === 'neutral' ? 'bg-amber-50' : 'bg-red-50';
                  
                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold uppercase tracking-wider">{res.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-[#E8A020]">{res.calc.compound}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="font-bold">{res.calc.nameNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{res.calc.planet}</td>
                      <td className={`px-4 py-3 ${bg}`}>
                        <div className="flex items-start gap-2">
                          <Icon className={`w-4 h-4 mt-0.5 ${color} shrink-0`} />
                          <div>
                            <div className={`font-semibold capitalize ${color}`}>{r}</div>
                            <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">{res.comp.message}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
