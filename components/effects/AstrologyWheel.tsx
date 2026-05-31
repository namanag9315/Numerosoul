"use client";

import React from "react";

export function AstrologyWheel({
  className = "",
  size = 500,
  opacity = 0.15,
}: {
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 500"
        className="h-full w-full animate-wheel-spin"
        style={{
          filter: "drop-shadow(0 0 16px rgba(124,58,237,0.3))",
        }}
      >
        <g stroke="currentColor" fill="none" className="text-[color:var(--cosmic-purple)]">
          {/* Outer Ring */}
          <circle cx="250" cy="250" r="240" strokeWidth="1" opacity="0.5" />
          <circle cx="250" cy="250" r="230" strokeWidth="2" />
          
          {/* 12 Houses / Zodiac dividers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`div-${i}`}
              x1="250"
              y1="20"
              x2="250"
              y2="100"
              transform={`rotate(${i * 30} 250 250)`}
              strokeWidth="1.5"
            />
          ))}

          {/* Inner Rings */}
          <circle cx="250" cy="250" r="150" strokeWidth="1.5" />
          <circle cx="250" cy="250" r="140" strokeWidth="1" opacity="0.5" />
          
          {/* Constellation dots in the houses */}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={`dot-${i}`}
              cx="250"
              cy="60"
              r="3"
              fill="currentColor"
              transform={`rotate(${i * 30 + 15} 250 250)`}
            />
          ))}

          {/* Core geometry */}
          <g transform="translate(250 250)">
            <polygon points="0,-120 104,60 -104,60" strokeWidth="1.5" opacity="0.6" className="text-[color:var(--sunrise-orange)]" />
            <polygon points="0,120 104,-60 -104,-60" strokeWidth="1.5" opacity="0.6" className="text-[color:var(--sunrise-orange)]" />
            <circle r="60" strokeWidth="1" opacity="0.4" />
            <circle r="20" strokeWidth="2" fill="currentColor" opacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
