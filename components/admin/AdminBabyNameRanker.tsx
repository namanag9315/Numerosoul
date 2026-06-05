"use client";

import { useState } from "react";
import { Baby, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import {
  calculatePsychicNumber,
  calculateDestinyNumber,
} from "@/lib/numerology";
import { calcName, getSeriesVerdict, hasOpposition, PLANET_NAMES } from "@/lib/name-correction";

export function AdminBabyNameRanker() {
  const [dob, setDob] = useState("");
  const [namesText, setNamesText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);

  const handleRank = () => {
    if (!dob.trim() || !namesText.trim()) return;
    try {
      const psychic = calculatePsychicNumber(dob);
      const destiny = calculateDestinyNumber(dob);
      
      const names = namesText.split(/[,\n]+/).map(n => n.trim()).filter(Boolean);
      
      const ranked = names.map(name => {
        const calc = calcName(name);
        const verdict = getSeriesVerdict(calc.reduced);
        const opposition = hasOpposition(calc.reduced, psychic, destiny);
        
        let rating = verdict;
        let message = `Series ${calc.reduced} (${PLANET_NAMES[calc.reduced]}) is considered ${verdict}.`;
        
        if (opposition) {
          rating = 'avoid';
          message = `Severe 3 vs 6 opposition detected with core numbers. Avoid.`;
        } else if (verdict === 'avoid') {
          message = `Harmful vibration series detected (${calc.reduced}). Avoid.`;
        }

        return { 
          name, 
          calc: {
            compound: calc.compound,
            nameNumber: calc.reduced,
            planet: PLANET_NAMES[calc.reduced],
          }, 
          comp: { rating, message } 
        };
      });
      
      const order = { excellent: 1, good: 2, neutral: 3, avoid: 4 };
      ranked.sort((a, b) => (order[a.comp.rating as keyof typeof order] || 5) - (order[b.comp.rating as keyof typeof order] || 5));
      
      setResults(ranked);
    } catch {
      alert("Invalid DOB or names.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E8A020]/20 bg-[#FDF9F1] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Baby className="h-6 w-6 text-[#D4700A]" />
          <h2 className="font-display text-2xl font-bold text-[#D4700A]">
            Baby Name Batch Ranker
          </h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">Quickly evaluate multiple baby names against a DOB to find the most harmonising option (Chaldean method).</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Baby&apos;s Date of Birth</label>
            <input
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white text-sm outline-none focus:border-[#E8A020]/60 focus:ring-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Proposed Names (comma or line separated)</label>
            <textarea
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              placeholder="e.g. Rahul, Aman, Sunita"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8A020]/20 bg-white text-sm outline-none focus:border-[#E8A020]/60 focus:ring-1"
              rows={3}
            />
          </div>
        </div>

        <button
          onClick={handleRank}
          disabled={!dob || !namesText}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8A020] to-[#D4700A] px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          Batch Rank Names
        </button>
      </div>

      {results.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
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
  );
}

