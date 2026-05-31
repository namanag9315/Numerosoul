"use client";

import { useState, useMemo } from "react";
import {
  X,
  Printer,
  Sparkles,
  RefreshCw
} from "lucide-react";
import {
  calculatePsychicNumber,
  calculateDestinyNumber,
  calculateChaldeanNameNumber,
} from "@/lib/numerology";
import { ChatMessage } from "@/components/ChatMessage";

type Booking = {
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
};

interface ClientReportModalProps {
  booking: Booking;
  onClose: () => void;
}

export function ClientReportModal({ booking, onClose }: ClientReportModalProps) {
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string>("");

  const clientName = booking.clients?.name || "Client";
  const clientDob = booking.clients?.date_of_birth || "";
  const serviceName = booking.services?.name || "Numerology Consultation";

  const psychic = useMemo(() => calculatePsychicNumber(clientDob), [clientDob]);
  const destiny = useMemo(() => calculateDestinyNumber(clientDob), [clientDob]);
  const expr = useMemo(() => calculateChaldeanNameNumber(clientName).nameNumber, [clientName]);

  const generateReport = async () => {
    setLoading(true);
    setReportMarkdown("");
    try {
      const res = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientDob,
          serviceName,
          psychic,
          destiny,
          customInstructions,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await res.json();
      setReportMarkdown(data.report);
    } catch (err) {
      console.error(err);
      setReportMarkdown("⚠️ Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 overflow-y-auto print:bg-white print:p-0 print:absolute print:inset-0">
      {/* Print Stylesheet Injection */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Header Controls (Hidden on Print) */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            <h3 className="font-display text-lg font-bold text-slate-800">
              Premium Report Generator
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              disabled={!reportMarkdown}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="h-4 w-4" /> Download PDF Report
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto bg-white print:overflow-visible" id="print-area">
          
          {/* PURPLE GRADIENT COVER */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#9333ea] text-white p-10 print:p-8 print:bg-purple-900 print:text-white">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-400 opacity-10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-200" />
                  <h1 className="font-display text-2xl font-black tracking-widest uppercase text-purple-100">
                    Numerology Report
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-200">NumeroSoul</p>
                  <p className="text-xs text-purple-300">Professional Insights</p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-5xl font-extrabold tracking-tight mb-2">
                  {clientName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-purple-200 mt-4">
                  <span className="flex items-center gap-1.5"><span className="text-purple-400 font-bold">DOB:</span> {clientDob}</span>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-1.5"><span className="text-purple-400 font-bold">Service:</span> {serviceName}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-purple-400/20">
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-300">Life Path</span>
                  <span className="block text-2xl font-black font-numeral mt-0.5">{destiny}</span>
                </div>
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-300">Psychic</span>
                  <span className="block text-2xl font-black font-numeral mt-0.5">{psychic}</span>
                </div>
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-300">Expression</span>
                  <span className="block text-2xl font-black font-numeral mt-0.5">{expr}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Generator Controls (Hidden on Print) */}
          <div className="p-8 border-b border-slate-100 bg-slate-50 no-print space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Custom Instructions for Numerologist Insight (Optional)
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. 'Add a list of recommended baby names totaling to 5' or 'Focus strictly on their recent career shift...'"
                className="w-full min-h-[80px] p-3 text-sm rounded-xl border border-slate-200 bg-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none resize-y"
              />
            </div>
            
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Generating Insight...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Auto Generate Report
                </>
              )}
            </button>
          </div>

          {/* AI Output Rendered */}
          <div className="p-8 pb-16 print:p-8">
            {reportMarkdown ? (
              <div className="max-w-none print:text-black">
                <ChatMessage
                  content={reportMarkdown}
                  source="groq"
                />
              </div>
            ) : (
              !loading && (
                <div className="text-center py-16 text-slate-400 no-print">
                  <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">Click &quot;Auto Generate Report&quot; to instruct the AI to write the insights.</p>
                </div>
              )
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
