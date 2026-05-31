"use client";

import React, { useState } from "react";

const loShuNumbers = [
  { num: 4, label: "Wood", color: "#0D9488" }, // Teal
  { num: 9, label: "Fire", color: "#EA580C" }, // Warm Orange
  { num: 2, label: "Earth", color: "#D97706" }, // Amber/Gold
  { num: 3, label: "Wood", color: "#0D9488" }, 
  { num: 5, label: "Earth", color: "#E8A020" }, 
  { num: 7, label: "Metal", color: "#475569" }, // Slate Gray
  { num: 8, label: "Earth", color: "#D97706" }, 
  { num: 1, label: "Water", color: "#2563EB" }, // Royal Blue
  { num: 6, label: "Metal", color: "#475569" }, 
];

export function LoShuGridVisual({ className = "" }: { className?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`relative mx-auto w-full max-w-[340px] ${className}`}>
      {/* Warm background glow */}
      <div 
        className="absolute -inset-6 z-0 rounded-[36px] opacity-40 blur-3xl transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, rgba(232,160,32,0.12) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
          transform: hoveredIndex !== null ? "scale(1.15)" : "scale(1)",
        }}
      />
      
      {/* Grid Container */}
      <div 
        className="relative z-10 grid grid-cols-3 gap-3 rounded-[32px] p-5 shadow-[0_20px_50px_rgba(232,160,32,0.06)] border transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(232, 160, 32, 0.22)",
        }}
      >
        {loShuNumbers.map((cell, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border transition-all duration-300"
              style={{
                backgroundColor: isHovered ? cell.color : "rgba(253, 251, 247, 0.7)",
                borderColor: isHovered ? cell.color : "rgba(232, 160, 32, 0.12)",
                transform: isHovered ? "translateY(-6px) scale(1.05)" : "translateY(0) scale(1)",
                boxShadow: isHovered 
                  ? `0 10px 24px ${cell.color}35` 
                  : "none",
              }}
            >
              {/* Cell number */}
              <span
                className="font-display text-4xl font-bold transition-colors duration-300 select-none"
                style={{
                  color: isHovered ? "#FFFFFF" : cell.color,
                  textShadow: isHovered ? "none" : `0 0 8px ${cell.color}15`,
                }}
              >
                {cell.num}
              </span>
              
              {/* Element Label */}
              <span
                className="mt-1 font-numeral text-[9px] font-semibold uppercase tracking-widest transition-colors duration-300 select-none"
                style={{
                  color: isHovered ? "rgba(255, 255, 255, 0.85)" : "#94A3B8",
                }}
              >
                {cell.label}
              </span>
              
              {/* Outline flare */}
              <div
                className={`absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 pointer-events-none ${
                  isHovered ? "opacity-100" : ""
                }`}
                style={{
                  border: `1.5px solid ${cell.color}`,
                  boxShadow: `inset 0 0 10px rgba(255, 255, 255, 0.2)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
