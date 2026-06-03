"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function AdminAIGroqSuggestor() {
  const [name, setName] = useState("RAHUL");
  const [dob, setDob] = useState("16/12/1982");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [original, setOriginal] = useState<any>(null);

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
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E8A020]/20 bg-[#FDF9F1] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-[#D4700A]" />
          <h2 className="font-display text-2xl font-bold text-[#D4700A]">
            AI Name Suggestor (Groq)
          </h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">AI-generated lucky spelling suggestions based on numerological principles.</p>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Current Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. RAHUL"
              className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white text-sm outline-none focus:border-[#E8A020]/60 focus:ring-1 uppercase"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Date of Birth</label>
            <input
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white text-sm outline-none focus:border-[#E8A020]/60 focus:ring-1"
            />
          </div>
        </div>

        <button
          onClick={handleSuggest}
          disabled={loading || !name || !dob}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8A020] to-[#D4700A] px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyse & Suggest Lucky Spellings ✨"}
        </button>
      </div>

      {original && (
        <div className="rounded-xl border border-[#E8A020]/20 bg-[#FFF8EE] p-4">
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
        <div className="space-y-3">
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
  );
}
