"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || pathname.startsWith("/admin")) return null;

  return (
    <div className="mobile-sticky-bar">
      <Link
        href="/book"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[color:var(--saffron-gold)] to-[color:var(--molten-amber)] text-sm font-medium text-white"
        style={{ minHeight: 48 }}
      >
        📞 Book Session
      </Link>
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] text-sm font-medium text-white"
        style={{ minHeight: 48 }}
      >
        💬 WhatsApp NumeroSoul
      </a>
    </div>
  );
}
