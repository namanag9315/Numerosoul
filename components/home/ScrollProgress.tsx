"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const milestones = [
  { id: "home", label: "Home", percent: 8 },
  { id: "about", label: "About", percent: 26 },
  { id: "matrix", label: "Chaldean Grid", percent: 44 },
  { id: "services", label: "Services", percent: 62 },
  { id: "tools", label: "Free Tools", percent: 80 },
  { id: "blog", label: "Blog", percent: 94 },
];

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const m of milestones) {
        const el = document.getElementById(m.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;
          if (scrollPos >= top && scrollPos <= bottom) {
            setActiveSection(m.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[99] hidden md:flex flex-col items-center h-[60vh] w-8 pointer-events-auto">
      {/* Scroll track */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-[rgba(201,151,58,0.1)] rounded-full overflow-hidden">
        {/* Dynamic progress fill */}
        <motion.div
          style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
          className="absolute inset-0 bg-[#E8A020]"
        />
      </div>

      {/* Milestones */}
      {milestones.map((m) => {
        const isActive = activeSection === m.id;
        return (
          <div
            key={m.id}
            onClick={() => handleClick(m.id)}
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer group flex items-center justify-center w-6 h-6 z-10"
            style={{ top: `${m.percent}%` }}
          >
            {/* Hover tooltip label (slides in to the left) */}
            <div className="absolute right-8 px-3 py-1 bg-[#0D0820] border border-[#rgba(201,151,58,0.3)] text-[#FAF3E0] text-[10px] tracking-[2px] uppercase font-display rounded-md opacity-0 scale-95 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap shadow-lg">
              {m.label}
            </div>

            {/* Diamond shape ◆ */}
            <motion.span
              animate={{ 
                scale: isActive ? 1.25 : 1,
                rotate: isActive ? 45 : 45,
                color: isActive ? "#E8A020" : "rgba(201,151,58,0.4)"
              }}
              whileHover={{ scale: 1.4 }}
              className="text-xs flex items-center justify-center font-bold"
              style={{
                textShadow: isActive ? "0 0 8px #E8A020" : "none"
              }}
            >
              ◆
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
