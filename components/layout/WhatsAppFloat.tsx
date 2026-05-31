"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const [showPreview, setShowPreview] = useState(false);
  const pathname = usePathname();
  const link = getWhatsAppLink();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      className="fixed right-6 z-[1000] bottom-6 md:bottom-6"
      style={{ bottom: "max(24px, calc(env(safe-area-inset-bottom) + 70px))" }}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {/* Chat preview card */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[72px] right-0 w-[260px] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          >
            <div className="bg-[#25D366] px-4 py-3">
              <p className="text-sm font-semibold text-white">NumeroSoul</p>
              <p className="text-xs text-white/80">Typically replies in minutes</p>
            </div>
            <div className="p-4">
              <div className="rounded-xl rounded-tl-none bg-[#f0f0f0] p-3">
                <p className="text-sm text-gray-800">
                  👋 <strong>Chat with Uma</strong>
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Ask about readings, services, or book a session directly.
                </p>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-medium text-white transition hover:bg-[#20bd5a]"
              >
                Send Message
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float relative"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="sonar-pulse" />
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
          <path
            d="M16 4.2C9.58 4.2 4.36 9.08 4.36 15.08c0 2.1.64 4.07 1.76 5.73L5.2 27.8l7.32-1.84c1.08.34 2.25.52 3.48.52 6.42 0 11.64-4.88 11.64-10.88S22.42 4.2 16 4.2Z"
            fill="currentColor"
            opacity="0.98"
          />
          <path
            d="M20.94 18.44c-.26-.13-1.55-.73-1.79-.82-.24-.08-.42-.13-.59.13-.17.25-.67.82-.82.98-.15.17-.3.19-.56.06-.26-.13-1.1-.38-2.1-1.21-.78-.66-1.31-1.47-1.46-1.72-.15-.25-.02-.39.11-.52.12-.11.26-.3.39-.45.13-.15.17-.25.26-.42.09-.17.04-.32-.02-.45-.06-.13-.59-1.36-.81-1.86-.21-.48-.43-.42-.59-.43h-.5c-.17 0-.45.06-.68.32-.24.25-.9.84-.9 2.04s.92 2.37 1.05 2.53c.13.17 1.81 2.64 4.39 3.7.61.25 1.09.4 1.46.51.61.19 1.17.16 1.61.1.49-.07 1.55-.61 1.77-1.19.22-.59.22-1.09.15-1.19-.06-.11-.23-.17-.49-.3Z"
            fill="#25D366"
          />
        </svg>
      </a>
    </div>
  );
}
