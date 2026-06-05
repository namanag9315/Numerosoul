"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, Copy, FileText, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { calculatePsychicNumber, calculateDestinyNumber, calculateChaldeanNameNumber } from "@/lib/numerology";
import {
  calcName,
  getSeriesVerdict,
  hasOpposition,
  generateNameSuggestions,
  PLANET_NAMES
} from "@/lib/name-correction";
import { DOB_COMBINATIONS } from "@/lib/numerology-interpretations";
import { ScoreBars, AIDeepDive } from "./AdminNumerologyWorkspace";

export function UnifiedNameLaboratory() {
  const [clientName, setClientName] = useState("");
  const [dob, setDob] = useState("");
  const [seriesOverride, setSeriesOverride] = useState("");
  
  const [analyzedName, setAnalyzedName] = useState("");
  const [analyzedDob, setAnalyzedDob] = useState("");
  const [analyzedOverride, setAnalyzedOverride] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Autofill listener
  useEffect(() => {
    const handle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.name) setClientName(detail.name);
      if (detail?.dob) {
        setDob(detail.dob);
      }
    };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const handleSearch = () => {
    if (!clientName.trim()) {
      alert("Please enter a name");
      return;
    }
    setAnalyzedName(clientName);
    setAnalyzedDob(dob);
    setAnalyzedOverride(seriesOverride);
    setHasSearched(true);
  };

  const psychic = useMemo(() => {
    try { return analyzedDob ? calculatePsychicNumber(analyzedDob) : 1; } catch { return 1; }
  }, [analyzedDob]);

  const destiny = useMemo(() => {
    try { return analyzedDob ? calculateDestinyNumber(analyzedDob) : 1; } catch { return 1; }
  }, [analyzedDob]);

  const recommendedSeries = useMemo(() => {
    if (analyzedOverride.trim()) {
      return analyzedOverride.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    }
    try {
      const combKey = `${psychic}-${destiny}`;
      const comb = DOB_COMBINATIONS[combKey];
      if (comb && comb.bestNameSeries) {
        return comb.bestNameSeries.split(",").map(s => parseInt(s.trim()));
      }
    } catch {}
    return [1, 3, 5, 6, 9];
  }, [analyzedOverride, psychic, destiny]);

  const oldCalc = useMemo(() => {
    if (!analyzedName) return null;
    return calculateChaldeanNameNumber(analyzedName);
  }, [analyzedName]);

  const originalAnalysis = useMemo(() => {
    if (!analyzedName) return null;
    return calcName(analyzedName);
  }, [analyzedName]);

  const suggestions = useMemo(() => {
    if (!analyzedName) return [];
    return generateNameSuggestions(analyzedName, psychic, destiny, recommendedSeries);
  }, [analyzedName, psychic, destiny, recommendedSeries]);

  const verdict = originalAnalysis ? getSeriesVerdict(originalAnalysis.reduced) : 'neutral';
  const oppositionDetected = originalAnalysis ? hasOpposition(originalAnalysis.reduced, psychic, destiny) : false;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied "${text}" to clipboard`);
  };

  const handleUseInReport = (name: string) => {
    window.dispatchEvent(new CustomEvent('autofill-client', {
      detail: { name, dob: analyzedDob }
    }));
    alert(`Pre-filled "${name}" across tools`);
    setClientName(name);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* LEFT PANEL: Input & References */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-[#E8A020]/20 bg-white/75 p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-[#D4700A] mb-6">
            Name Laboratory
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Client&apos;s Full Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white text-sm outline-none focus:border-[#E8A020]/60 focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Date of Birth (Optional)
              </label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white text-sm outline-none focus:border-[#E8A020]/60 focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Recommended Series Override
              </label>
              <input
                type="text"
                value={seriesOverride}
                onChange={(e) => setSeriesOverride(e.target.value)}
                placeholder="e.g. 1, 5, 6"
                className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white text-sm outline-none focus:border-[#E8A020]/60 focus:ring-1"
              />
              <p className="text-[10px] text-slate-400 mt-1">Comma-separated target numbers. Overrides DOB defaults.</p>
            </div>

            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8A020] to-[#D4700A] px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="h-4 w-4" /> Analyze & Correct
            </button>
          </div>
        </div>

        {hasSearched && (
          <div className="rounded-2xl border border-[#E8A020]/12 overflow-hidden bg-white p-5 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-600">
                Interactive Chaldean Reference
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Highlighted letters are active in &ldquo;{analyzedName.toUpperCase()}&rdquo;
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:grid md:grid-cols-3 md:gap-1 text-center">
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
                  <div key={col.val} className="flex flex-col gap-1 p-1 bg-slate-50/50 rounded border border-slate-100">
                    <span className="text-sm font-bold text-[#D4700A] border-b border-slate-200 pb-1 mb-1 font-numeral">
                      {col.val}
                    </span>
                    <div className="flex flex-wrap justify-center gap-1">
                      {col.letters.length > 0 ? (
                        col.letters.map((lettr) => {
                          const isActive = analyzedName.toUpperCase().includes(lettr);
                          return (
                            <span
                              key={lettr}
                              className={`inline-block px-1 py-0.5 rounded text-[10px] font-bold transition-all ${
                                isActive
                                  ? "bg-amber-500 text-white shadow-sm"
                                  : "bg-white border border-slate-200 text-slate-400 opacity-60"
                              }`}
                            >
                              {lettr}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[9px] font-bold text-slate-300 italic py-1">
                          Sacred
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Results */}
      <div className="lg:col-span-8 space-y-6">
        {hasSearched && originalAnalysis && oldCalc && (
          <>
            {/* Section 1 - Current Name Analysis */}
            <div className="rounded-2xl border border-[#E8A020]/20 bg-white/75 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-slate-800">
                  Current Name Analysis
                </h3>
                {verdict === 'excellent' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> Favourable
                  </span>
                )}
                {verdict === 'good' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Good
                  </span>
                )}
                {verdict === 'neutral' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    <AlertTriangle className="h-4 w-4" /> Neutral
                  </span>
                )}
                {verdict === 'avoid' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    <XCircle className="h-4 w-4" /> Avoid
                  </span>
                )}
              </div>

              {/* Running sum */}
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex-1 min-w-[200px] break-all leading-relaxed">
                  {originalAnalysis.letterValues.map((lv, i) => (
                    <span key={i} className="inline-flex items-center">
                      <span className="text-slate-800">{lv.letter}</span>
                      <span className="text-[#D4700A] text-[10px] mx-0.5">({lv.value})</span>
                      {i < originalAnalysis.letterValues.length - 1 && <span className="mx-1">+</span>}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                  <span>=</span>
                  <span className="text-xl text-slate-800">{originalAnalysis.compound}</span>
                  <span>→</span>
                  <span className="text-2xl text-[#D4700A]">{originalAnalysis.reduced}</span>
                </div>
              </div>

              {/* Warnings */}
              {verdict === 'avoid' && (
                <div className="mb-4 rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3 text-red-800">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Harmful Vibration Series Detected</h4>
                    <p className="text-xs mt-1 leading-relaxed">
                      This name reduces to {originalAnalysis.reduced} ({PLANET_NAMES[originalAnalysis.reduced]}). 
                      The 4, 7, and 8 series represent Rahu, Ketu, and Saturn respectively, bringing unexpected struggles, isolation, or delays. A name correction is highly advised.
                    </p>
                  </div>
                </div>
              )}

              {oppositionDetected && (
                <div className="mb-4 rounded-xl bg-amber-50 p-4 border border-amber-200 flex items-start gap-3 text-amber-800">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Critical 3 vs 6 Opposition Warning</h4>
                    <p className="text-xs mt-1 leading-relaxed">
                      A severe clash exists between the name number ({originalAnalysis.reduced}) and the core numbers (Psychic {psychic} / Destiny {destiny}). The opposition of Jupiter (3) and Venus (6) creates friction between spiritual and material pursuits.
                    </p>
                  </div>
                </div>
              )}

              {/* Meaning from Old Calc */}
              <div className="rounded-xl border border-[#E8A020]/12 bg-white p-4 mb-4">
                <h4 className="font-display text-sm font-bold text-slate-800 border-b border-[#E8A020]/10 pb-2 mb-2">
                  Compound Number {oldCalc.compound} Interpretation
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  {oldCalc.summary}
                </p>
              </div>

              {/* Domain Scores */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Name Vibration Domain Scores
                </h4>
                <ScoreBars scores={oldCalc.scores} />
              </div>

            </div>

            {/* Section 2 - Suggested Corrections */}
            <div className="rounded-2xl border border-[#E8A020]/20 bg-[#FDF9F1]/50 p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-slate-800 mb-6">
                Spelling Suggestions That Improve Vibration
              </h3>

              {suggestions.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {suggestions.map((sug, i) => (
                    <div key={i} className="rounded-xl border border-[#E8A020]/20 bg-white p-5 shadow-[0_4px_12px_rgba(232,160,32,0.05)] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 style={{ fontFamily: 'var(--font-cormorant)' }} className="text-2xl font-bold text-[#D4700A]">
                            {sug.name}
                          </h4>
                          {sug.priority === 1 ? (
                            <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
                              <CheckCircle2 className="h-3 w-3" /> Recommended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                              <CheckCircle2 className="h-3 w-3" /> Good
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                          <span className="text-slate-500">{sug.compound}</span>
                          <span className="text-slate-300">→</span>
                          <span className="text-slate-800 font-bold">{sug.reduced}</span>
                          <span style={{ color: sug.planetColor }} className="text-xs px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
                            {sug.planet}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mb-4">{sug.improvement}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(sug.name)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#E8A020]/30 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-[#E8A020]/5 transition"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy Name
                        </button>
                        <button
                          onClick={() => handleUseInReport(sug.name)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#E8A020]/10 px-3 py-2 text-[11px] font-bold text-[#D4700A] hover:bg-[#E8A020]/20 transition"
                        >
                          <FileText className="h-3.5 w-3.5" /> Use in Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    No exact spelling improvements found for the recommended series.
                  </p>
                  <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                    Consider modifying the recommended series override or manually adjusting letters to find an optimal compound.
                  </p>
                </div>
              )}
            </div>

            {/* AI Deep Dive */}
            <div className="mt-6">
              <AIDeepDive section="name" parameters={{ name: analyzedName, compound: originalAnalysis.compound, single: originalAnalysis.reduced, dob: analyzedDob, psychic, destiny }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
