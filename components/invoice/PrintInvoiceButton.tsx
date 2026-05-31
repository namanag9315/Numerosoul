"use client";

import { Printer } from "lucide-react";

export function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--sacred-indigo)] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(30,10,60,0.18)] transition hover:shadow-[0_16px_32px_rgba(30,10,60,0.24)] print:hidden"
    >
      <Printer className="h-4 w-4" />
      Print / Save PDF
    </button>
  );
}
