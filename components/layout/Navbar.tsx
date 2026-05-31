"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase-client";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Free Tools" },
  { href: "/guide", label: "Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track user session status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[999] transition-all duration-500 ${
        isScrolled
          ? "shadow-[0_1px_0_rgba(232,160,32,0.15),0_12px_40px_rgba(15,23,42,0.04)]"
          : ""
      }`}
      style={{
        backgroundColor: isScrolled
          ? "rgba(255,255,255,0.85)"
          : "transparent",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: isScrolled
          ? "1px solid rgba(232, 160, 32, 0.15)"
          : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="NumeroSoul home"
          onClick={() => setIsOpen(false)}
        >
          <MandalaIcon />
          <div className="flex flex-col">
            <span
              className="font-numeral text-lg font-semibold text-[#1E0A3C] leading-none"
            >
              ✦ NumeroSoul
            </span>
            <span
              className="font-body text-[10px] tracking-[1px] text-[#E8A020]/70 mt-0.5 leading-none"
            >
              by Uma Rastogi
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link-hover relative flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[color:var(--sunrise-orange)]"
            >
              {link.label === "Profile" && user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="h-6 w-6 rounded-full border border-[#E8A020]/30 shadow-sm"
                />
              ) : (
                link.label
              )}
              <span className="absolute -bottom-1 left-1/2 h-[1.5px] w-0 -translate-x-1/2 bg-[color:var(--sunrise-orange)] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/book"
          className="btn-primary hidden md:inline-flex"
          style={{ 
            minHeight: 44, 
            padding: "0.5rem 1.5rem", 
            fontSize: "0.8125rem",
            background: "linear-gradient(135deg, #1E0A3C, #0D0820)"
          }}
        >
          Book a Session
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 md:hidden shadow-sm"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen((o) => !o)}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden"
          >
            <div
              className="mx-4 mb-4 rounded-2xl p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-slate-100"
              style={{
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 border-b border-slate-100 px-2 py-3 text-sm font-medium text-slate-600 last:border-b-0 hover:text-[color:var(--sunrise-orange)]"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label === "Profile" && user?.user_metadata?.avatar_url ? (
                        <>
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            className="h-6 w-6 rounded-full border border-[#E8A020]/30 shadow-sm"
                          />
                          <span>Profile ({user.user_metadata.full_name?.split(" ")[0] || "User"})</span>
                        </>
                      ) : (
                        link.label
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/book"
                className="btn-primary mt-4 w-full justify-center"
                style={{ minHeight: 48 }}
                onClick={() => setIsOpen(false)}
              >
                Book a Session
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav link hover underline CSS */}
      <style jsx>{`
        .nav-link-hover::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 1.5px;
          background: var(--sunrise-orange);
          transform: translateX(-50%);
          transition: width 300ms ease;
        }
        .nav-link-hover:hover::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
}

function MandalaIcon() {
  return (
    <svg
      className="h-8 w-8 shrink-0"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      style={{ animation: "breathe-ring 3s ease-in-out infinite" }}
    >
      <g transform="translate(16 16)" fill="currentColor" style={{ color: "#1E0A3C" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-8"
            rx="2.4"
            ry="6"
            transform={`rotate(${i * 45})`}
            opacity="0.78"
          />
        ))}
        <circle r="4.3" fill="var(--sunrise-orange)" />
        <circle r="1.7" fill="#fff" />
      </g>
    </svg>
  );
}
