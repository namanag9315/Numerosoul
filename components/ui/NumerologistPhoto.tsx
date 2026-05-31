"use client";

import React, { useState } from "react";

interface NumerologistPhotoProps {
  size: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  className?: string;
}

export function NumerologistPhoto({ size, showName = false, className = "" }: NumerologistPhotoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-11 w-11 text-sm",
    md: "h-[120px] w-[120px] text-2xl",
    lg: "h-[280px] w-[280px] text-6xl",
    xl: "h-[320px] w-[320px] text-7xl",
  };

  const ringStyles = {
    sm: { border: "2px solid #E8A020", boxShadow: "0 0 0 3px rgba(232, 160, 32, 0.12)" },
    md: { border: "3px solid #E8A020", boxShadow: "0 0 0 5px rgba(232, 160, 32, 0.15)" },
    lg: { border: "3px solid #E8A020", boxShadow: "0 0 0 6px rgba(232, 160, 32, 0.18)" },
    xl: { border: "3px solid #E8A020", boxShadow: "0 0 0 6px rgba(232, 160, 32, 0.18)" },
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 ${sizeClasses[size]}`}
        style={{
          ...ringStyles[size],
          background: "linear-gradient(135deg, #1E0A3C 0%, #0D0820 100%)",
        }}
      >
        {!imageError ? (
          <img
            src="/uma-rastogi.jpg"
            alt="Uma Rastogi"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-display font-semibold text-[#E8A020] select-none tracking-widest drop-shadow-[0_2px_10px_rgba(232,160,32,0.2)]">
            UR
          </span>
        )}
      </div>
      {showName && (
        <span className="font-body text-[10px] tracking-[4px] uppercase text-slate-500 font-semibold mt-1">
          Uma Rastogi
        </span>
      )}
    </div>
  );
}
