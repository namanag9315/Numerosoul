"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ChartColumn = {
  num: number;
  letters: string[];
};

const pythagoreanColumns: ChartColumn[] = [
  { num: 1, letters: ["A", "J", "S"] },
  { num: 2, letters: ["B", "K", "T"] },
  { num: 3, letters: ["C", "L", "U"] },
  { num: 4, letters: ["D", "M", "V"] },
  { num: 5, letters: ["E", "N", "W"] },
  { num: 6, letters: ["F", "O", "X"] },
  { num: 7, letters: ["G", "P", "Y"] },
  { num: 8, letters: ["H", "Q", "Z"] },
  { num: 9, letters: ["I", "R"] },
];

export function PythagoreanChart({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 ${className}`}>
      <div className="text-center mb-8">
        <p className="font-numeral text-[10px] tracking-[4px] uppercase text-amber-500 font-semibold mb-2">
          ✦ Pythagorean Matrix ✦
        </p>
        <h3 className="font-display text-2xl font-bold text-slate-800">
          Letter-to-Number Vibrations
        </h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Hover over each column to see which letters channel that numerical frequency in name corrections.
        </p>
      </div>

      {/* Grid matrix */}
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
        {pythagoreanColumns.map((col, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <motion.div
              key={col.num}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.06 }}
              className="flex flex-col items-center rounded-2xl border transition-all duration-300 p-4 relative overflow-hidden"
              style={{
                backgroundColor: isHovered ? "rgba(255, 253, 249, 0.9)" : "rgba(255, 255, 255, 0.7)",
                borderColor: isHovered ? "rgba(232, 160, 32, 0.3)" : "rgba(232, 160, 32, 0.12)",
                boxShadow: isHovered
                  ? "0 12px 30px rgba(232, 160, 32, 0.12), 0 0 15px rgba(232, 160, 32, 0.04)"
                  : "0 4px 16px rgba(15, 23, 42, 0.02)",
                transform: isHovered ? "translateY(-6px)" : "translateY(0)",
              }}
            >
              {/* Radial flare on hover */}
              {isHovered && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,160,32,0.06)_0%,transparent_70%)] pointer-events-none" />
              )}

              {/* Number head */}
              <span
                className="font-display text-4xl font-bold transition-transform duration-300 select-none mb-3"
                style={{
                  color: isHovered ? "#E8A020" : "#475569",
                  transform: isHovered ? "scale(1.15)" : "scale(1)",
                  textShadow: isHovered ? "0 0 15px rgba(232, 160, 32, 0.25)" : "none",
                }}
              >
                {col.num}
              </span>

              {/* Line divider */}
              <div 
                className="w-full h-px mb-3 transition-colors duration-300"
                style={{
                  backgroundColor: isHovered ? "rgba(232, 160, 32, 0.25)" : "rgba(232, 160, 32, 0.1)",
                }}
              />

              {/* Letter stack */}
              <div className="flex flex-col gap-2 w-full items-center relative z-10">
                {col.letters.map((letter) => (
                  <div
                    key={letter}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold select-none transition-all duration-300 border"
                    style={{
                      backgroundColor: isHovered ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                      borderColor: isHovered ? "rgba(232, 160, 32, 0.2)" : "rgba(15, 23, 42, 0.04)",
                      color: isHovered ? "#1E1B4B" : "#64748B",
                      boxShadow: isHovered ? "0 2px 8px rgba(15, 23, 42, 0.03)" : "none",
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
