"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--cream)] px-5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
