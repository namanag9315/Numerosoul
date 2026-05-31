"use client";

import { useState, useEffect } from "react";
import { Sparkles, Printer, RefreshCw } from "lucide-react";
import { renderReportHTML } from "./reportTemplate";

export function AdvancedPremiumReportGenerator() {
  const [clientName, setClientName] = useState("");
  const [clientDob, setClientDob] = useState("");
  const [serviceName, setServiceName] = useState("Numerology Profile");
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportHTML, setReportHTML] = useState<string>("");

  useEffect(() => {
    const handle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.name) setClientName(detail.name);
      if (detail?.dob) setClientDob(detail.dob);
      if (detail?.service) setServiceName(detail.service);
    };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const generateReport = async () => {
    if (!clientName || !clientDob) {
      alert("Please enter both Name and DOB to generate a report.");
      return;
    }
    setLoading(true);
    setReportHTML("");
    try {
      const res = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientDob,
          serviceName,
          customInstructions,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await res.json();
      if (data.reportData) {
        const generatedHTML = renderReportHTML(data.reportData);
        setReportHTML(generatedHTML);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setReportHTML("<div style='padding:20px;color:red'>⚠️ Failed to generate report. Please try again.</div>");
    } finally {
      setLoading(false);
    }
  };

  const downloadReportPDF = () => {
    if (!reportHTML) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid gap-4 sm:grid-cols-3 border-b border-[#E8A020]/10 pb-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Client Name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none focus:border-[#E8A020]/60 focus:bg-white focus:ring-1"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Date of Birth
          </label>
          <input
            type="text"
            value={clientDob}
            onChange={(e) => setClientDob(e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none focus:border-[#E8A020]/60 focus:bg-white focus:ring-1"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Service / Focus
          </label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g. Baby Name Selection"
            className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none focus:border-[#E8A020]/60 focus:bg-white focus:ring-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Custom Instructions for Numerologist Insight (Optional)
        </label>
        <textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="e.g. 'Add a list of recommended baby names totaling to 5'..."
          className="w-full min-h-[80px] p-3 text-sm rounded-xl border border-slate-200 bg-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none resize-y"
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={generateReport}
            disabled={loading || !clientName || !clientDob}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Generating Insight...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Auto Generate JSON Report</>
            )}
          </button>
          
          <button
            onClick={downloadReportPDF}
            disabled={!reportHTML}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-4 w-4" /> Print / Download PDF
          </button>
        </div>
      </div>

      {/* Output Preview Section */}
      <div className="bg-slate-100 rounded-2xl overflow-hidden mt-8 border border-slate-200 p-2">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm min-h-[600px] relative">
          {reportHTML ? (
            <iframe 
              srcDoc={reportHTML} 
              className="w-full h-[800px] border-none"
              title="Report Preview"
            />
          ) : (
            !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">Enter details and click &quot;Auto Generate JSON Report&quot;.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
