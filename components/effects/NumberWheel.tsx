"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PlanetNode = {
  num: number;
  name: string;
  symbol: string;
  color: string;
  direction: string;
  element: string;
  governs: string;
};

const planetNodes: PlanetNode[] = [
  { num: 1, name: "Sun", symbol: "☉", color: "#F97316", direction: "North Direction", element: "Water", governs: "Career & Life Mission" },
  { num: 2, name: "Moon", symbol: "☽", color: "#94A3B8", direction: "Northwest Direction", element: "Water/Wind", governs: "Mind & Emotions" },
  { num: 3, name: "Jupiter", symbol: "♃", color: "#EAB308", direction: "Northeast Direction", element: "Ether", governs: "Wisdom & Growth" },
  { num: 4, name: "Rahu", symbol: "☊", color: "#7C3AED", direction: "Southwest Direction", element: "Wind", governs: "Ambition & Shadows" },
  { num: 5, name: "Mercury", symbol: "☿", color: "#22C55E", direction: "North Direction", element: "Earth", governs: "Speech & Intellect" },
  { num: 6, name: "Venus", symbol: "♀", color: "#EC4899", direction: "Southeast Direction", element: "Water", governs: "Love & Artistry" },
  { num: 7, name: "Ketu", symbol: "☋", color: "#9CA3AF", direction: "Northeast Direction", element: "Fire", governs: "Spirituality & Release" },
  { num: 8, name: "Saturn", symbol: "♄", color: "#1E40AF", direction: "West Direction", element: "Air", governs: "Discipline & Karma" },
  { num: 9, name: "Mars", symbol: "♂", color: "#EF4444", direction: "South Direction", element: "Fire", governs: "Energy & Courage" },
];

export function NumberWheel({ className = "" }: { className?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Center & Radius
  const cx = 250;
  const cy = 250;
  const rOuter = 220;
  const rMid = 160;
  const rInner = 100;

  // Orbit rotation durations
  const isPaused = hoveredIndex !== null;

  return (
    <div className={`relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] number-wheel-container flex items-center justify-center select-none ${className}`}>
      
      {/* 12 o'clock Fixed Indicator */}
      <div 
        className="absolute z-30" 
        style={{
          top: "calc(6% - 10px)",
          left: "calc(50% - 6px)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "8px solid #E8A020",
          filter: "drop-shadow(0 0 4px #E8A020)",
        }}
      />

      {/* SVG Container */}
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full relative z-10"
      >
        {/* Outer Ring */}
        <g 
          className="rotating-group"
          style={{ 
            transformOrigin: "250px 250px",
            animation: "mandala-spin 30s linear infinite",
            animationPlayState: isPaused ? "paused" : "running"
          }}
        >
          <circle cx={cx} cy={cy} r={rOuter} stroke="#E8A020" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />
          <circle cx={cx} cy={cy} r={rOuter} stroke="#E8A020" strokeWidth="1.5" strokeOpacity="0.08" strokeDasharray="5,15" fill="none" />
        </g>

        {/* Inner Ring */}
        <g
          className="rotating-group"
          style={{ 
            transformOrigin: "250px 250px",
            animation: "mandala-spin 60s linear infinite",
            animationPlayState: isPaused ? "paused" : "running"
          }}
        >
          <circle cx={cx} cy={cy} r={rInner} stroke="#E8A020" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
          <circle cx={cx} cy={cy} r={rInner - 8} stroke="#E8A020" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3,10" fill="none" />
        </g>

        {/* Central Lotus (8-petal, gold strokes, rotating 120s) */}
        <g
          className="rotating-group"
          style={{ 
            transformOrigin: "250px 250px",
            animation: "mandala-spin 120s linear infinite",
            animationPlayState: isPaused ? "paused" : "running"
          }}
          stroke="#E8A020"
          strokeWidth="1.2"
          fill="none"
          strokeOpacity="0.75"
        >
          <g transform={`translate(${cx} ${cy})`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={i}
                d="M0,0 C-10,-18 -15,-28 0,-44 C15,-28 10,-18 0,0"
                transform={`rotate(${i * 45})`}
                style={{ filter: "drop-shadow(0 0 2px rgba(232, 160, 32, 0.2))" }}
              />
            ))}
            <circle r="4" fill="#E8A020" stroke="none" />
          </g>
        </g>

        {/* Middle Ring & Planet Nodes Group (orbits counter-clockwise 45s) */}
        <g
          className="rotating-group"
          style={{ 
            transformOrigin: "250px 250px",
            animation: "mandala-spin 45s linear infinite reverse",
            animationPlayState: isPaused ? "paused" : "running"
          }}
        >
          {/* Middle Ring Line */}
          <circle cx={cx} cy={cy} r={rMid} stroke="#E8A020" strokeWidth="1" strokeOpacity="0.25" fill="none" />

          {/* 9 Planet Nodes */}
          {planetNodes.map((node, i) => {
            const angle = (i * 40 - 90) * Math.PI / 180;
            const nx = cx + rMid * Math.cos(angle);
            const ny = cy + rMid * Math.sin(angle);
            const isHovered = hoveredIndex === i;

            return (
              <g 
                key={node.num}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Node outer orbit path group */}
                <g transform={`translate(${nx} ${ny})`}>
                  
                  {/* Invisible mouse catcher */}
                  <circle r="36" fill="transparent" stroke="none" />

                  {/* Planet Node Circle (r=32) */}
                  <motion.circle
                    r="32"
                    fill={node.color}
                    fillOpacity={isHovered ? 0.25 : 0.12}
                    stroke={node.color}
                    strokeWidth={isHovered ? 2 : 1.2}
                    strokeOpacity={isHovered ? 1 : 0.8}
                    animate={{
                      scale: isHovered ? 1.3 : 1,
                      filter: isHovered 
                        ? [`drop-shadow(0 0 8px ${node.color}80)`, `drop-shadow(0 0 20px ${node.color})`]
                        : `drop-shadow(0 0 4px ${node.color}40)`,
                    }}
                    transition={{
                      duration: isHovered ? 0.3 : 3 + (i % 3),
                      repeat: isHovered ? 0 : Infinity,
                      repeatType: "reverse"
                    }}
                  />

                  {/* 1. Digit text (Cinzel 22px bold) */}
                  <text
                    y="-4"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={node.color}
                    fontSize="22"
                    fontFamily="var(--font-display)"
                    fontWeight="bold"
                    opacity={isHovered ? 1 : 0.9}
                  >
                    {node.num}
                  </text>

                  {/* 2. Planet name text (DM Sans 8px) */}
                  <text
                    y="14"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={node.color}
                    fontSize="8"
                    fontFamily="var(--font-body)"
                    letterSpacing="2"
                    fontWeight="500"
                    opacity={isHovered ? 1 : 0.7}
                  >
                    {node.name.toUpperCase()}
                  </text>

                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Tooltip Card */}
      <AnimatePresence>
        {hoveredIndex !== null && (() => {
          const node = planetNodes[hoveredIndex];
          const angle = (hoveredIndex * 40 - 90) * Math.PI / 180;
          
          // Calculate screen positions in percent of container size
          // We apply the middle ring rotation offset to match node location
          // Since the ring rotates counter-clockwise by -45s, we can just position the card in a fixed quadrant or dynamically track client coords
          // A clean way is: absolute centered card or placed relative to the container center!
          // Placed at center offsets to stay within bounds:
          const xPercent = 50 + 26 * Math.cos(angle);
          const yPercent = 50 + 26 * Math.sin(angle);

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-40 w-52 p-4 rounded-xl border pointer-events-none shadow-lg flex flex-col text-left"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                borderColor: "#E8A020",
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 20px ${node.color}15, 0 8px 24px rgba(15, 23, 42, 0.08)`
              }}
            >
              {/* Tooltip content */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg font-bold" style={{ color: node.color }}>
                  {node.symbol}
                </span>
                <span className="font-display font-bold text-xs uppercase tracking-widest text-slate-800">
                  {node.name}
                </span>
              </div>

              <p className="text-[10px] text-[#E8A020] tracking-wide font-numeral mb-2 border-b border-[#E8A020]/15 pb-1 font-semibold">
                Number {node.num} · {node.direction}
              </p>

              <div className="space-y-1 text-[10px]">
                <p className="text-slate-600">
                  <span className="text-slate-400 font-semibold uppercase text-[8px] tracking-wider block">Element</span> 
                  {node.element}
                </p>
                <p className="text-slate-600 mt-1">
                  <span className="text-slate-400 font-semibold uppercase text-[8px] tracking-wider block">Governs</span> 
                  {node.governs}
                </p>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
