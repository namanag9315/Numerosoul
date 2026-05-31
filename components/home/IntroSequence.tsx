"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const planetColors = [
  "#F97316", // 1 -> Amber
  "#94A3B8", // 2 -> Silver
  "#EAB308", // 3 -> Yellow
  "#7C3AED", // 4 -> Purple
  "#22C55E", // 5 -> Green
  "#EC4899", // 6 -> Rose
  "#9CA3AF", // 7 -> Grey
  "#1E40AF", // 8 -> Dark Blue
  "#EF4444", // 9 -> Red
];

// Calculate points of a centered nonagon
const R = 120;
const cx = 200;
const cy = 200;
const points = Array.from({ length: 9 }, (_, i) => {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / 9;
  return {
    x: cx + R * Math.cos(angle),
    y: cy + R * Math.sin(angle),
    digitX: cx + (R + 25) * Math.cos(angle),
    digitY: cy + (R + 25) * Math.sin(angle),
    angle,
  };
});

// Inner diagonal connections (connect i with i+2 and i+4)
const diagonals: Array<[number, number]> = [];
for (let i = 0; i < 9; i++) {
  diagonals.push([i, (i + 2) % 9]);
  diagonals.push([i, (i + 4) % 9]);
}

// Sparkles data around "Jai Gurudev" text
const sparklesData = [
  { x: -95, y: -25, delay: 0.1, scale: 0.8 },
  { x: 95, y: -20, delay: 0.3, scale: 0.9 },
  { x: -50, y: 25, delay: 0.2, scale: 0.75 },
  { x: 60, y: 20, delay: 0.4, scale: 0.8 },
  { x: -10, y: -45, delay: 0.5, scale: 1.15 },
  { x: 20, y: 35, delay: 0.15, scale: 0.85 },
  { x: -110, y: 5, delay: 0.35, scale: 0.9 },
  { x: 110, y: 10, delay: 0.25, scale: 0.75 },
];

// Ambient sparkles across the entire screen during geometry animation
const ambientSparkles = [
  { top: "15%", left: "20%", delay: 1.8, size: 10 },
  { top: "25%", left: "75%", delay: 2.2, size: 12 },
  { top: "70%", left: "15%", delay: 2.5, size: 8 },
  { top: "80%", left: "80%", delay: 2.0, size: 10 },
  { top: "10%", left: "50%", delay: 2.8, size: 14 },
  { top: "85%", left: "45%", delay: 3.1, size: 10 },
  { top: "40%", left: "10%", delay: 2.4, size: 12 },
  { top: "50%", left: "88%", delay: 2.7, size: 8 },
];

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Play the full 4.5s intro animation on mount
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Outer nonagon SVG path format: M x0 y0 L x1 y1 ... Z
  const nonagonPathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05,
        transition: { duration: 0.6, ease: "easeInOut" }
      }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ cursor: "none" }}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        
        {/* 1. Jai Gurudev Greeting with Sparkles (0s to 1.7s) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.95, 1.02, 1.03, 1.05]
          }}
          transition={{
            duration: 1.8,
            times: [0, 0.25, 0.75, 1],
            ease: "easeInOut"
          }}
          className="absolute flex flex-col items-center justify-center pointer-events-none z-30"
        >
          <div className="relative">
            <h2 className="font-display text-xl sm:text-2xl tracking-[0.4em] uppercase text-[#E8A020] font-semibold drop-shadow-[0_0_12px_rgba(232,160,32,0.5)] select-none">
              Jai Gurudev
            </h2>
            {sparklesData.map((spark, idx) => (
              <motion.svg
                key={`sparkle-${idx}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#E8A020"
                className="absolute"
                style={{
                  left: `calc(50% + ${spark.x}px - 12px)`,
                  top: `calc(50% + ${spark.y}px - 12px)`,
                  filter: "drop-shadow(0 0 4px #E8A020)"
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.3, spark.scale, 0.3],
                  rotate: [0, 90, 180]
                }}
                transition={{
                  duration: 1.2,
                  delay: spark.delay,
                  ease: "easeInOut"
                }}
              >
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
              </motion.svg>
            ))}
          </div>
        </motion.div>

        {/* 2. Ambient background sparkles (appear starting at 1.8s) */}
        {ambientSparkles.map((spark, idx) => (
          <motion.svg
            key={`ambient-${idx}`}
            width={spark.size}
            height={spark.size}
            viewBox="0 0 24 24"
            fill="#E8A020"
            className="absolute pointer-events-none z-0"
            style={{
              top: spark.top,
              left: spark.left,
              filter: "drop-shadow(0 0 3px #E8A020)"
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.85, 0],
              scale: [0.4, 1.2, 0.4],
              rotate: [0, 120, 240]
            }}
            transition={{
              duration: 2.2,
              delay: spark.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          >
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
          </motion.svg>
        ))}

        {/* 3. Center Dot (fades in at 1.5s) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.5 }}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#E8A020] shadow-[0_0_8px_#E8A020] z-20"
          style={{ left: "calc(50% - 3px)", top: "calc(50% - 3px)" }}
        />

        {/* 4. Starburst & Nonagon Geometry SVG (starts drawing at 1.8s) */}
        <svg width="400" height="400" viewBox="0 0 400 400" className="relative z-10">
          {/* Staggered shooting lines */}
          {points.map((pt, i) => (
            <motion.path
              key={`star-${i}`}
              d={`M 200 200 L ${pt.x} ${pt.y}`}
              stroke="#E8A020"
              strokeWidth="1"
              opacity="0.65"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 1.8 + i * 0.06, ease: "easeOut" }}
            />
          ))}

          {/* Outer nonagon border */}
          <motion.path
            d={nonagonPathD}
            stroke="#E8A020"
            strokeWidth="1.2"
            fill="none"
            opacity="0.75"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.75, delay: 2.1, ease: "easeInOut" }}
          />

          {/* Inner connecting lines */}
          {diagonals.map(([start, end], idx) => (
            <motion.path
              key={`diag-${idx}`}
              d={`M ${points[start].x} ${points[start].y} L ${points[end].x} ${points[end].y}`}
              stroke="#E8A020"
              strokeWidth="0.6"
              opacity="0.45"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.65, delay: 2.3 + (idx % 9) * 0.04, ease: "easeInOut" }}
            />
          ))}

          {/* Digits 1-9 with glow flash */}
          {points.map((pt, i) => (
            <motion.text
              key={`digit-${i}`}
              x={pt.digitX}
              y={pt.digitY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={planetColors[i]}
              className="font-display font-bold text-sm"
              style={{ filter: `drop-shadow(0 0 3px ${planetColors[i]}80)` }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.45, 
                delay: 2.5 + i * 0.08,
                ease: "easeOut"
              }}
            >
              {i + 1}
            </motion.text>
          ))}
        </svg>

        {/* 5. Title & Subtitle (starts letters drop at 2.8s) */}
        <div className="absolute bottom-[20%] flex flex-col items-center z-20">
          <h1 className="flex text-[32px] font-bold text-[#E8A020] font-display select-none tracking-widest">
            {"NumeroSoul".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 160, 
                  damping: 15,
                  delay: 2.8 + i * 0.05 
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 0.6, delay: 3.3 }}
            className="mt-3 font-body text-[13px] text-[#FAF3E0] tracking-[3px] select-none"
          >
            by Uma Rastogi
          </motion.p>
        </div>

      </div>
    </motion.div>
  );
}
