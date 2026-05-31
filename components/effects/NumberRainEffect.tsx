"use client";

import { useMemo, useState, useEffect } from "react";

type RainDigit = {
  digit: number;
  x: string;
  size: string;
  delay: string;
  duration: string;
};

export function NumberRainEffect({
  className = "",
  count = 35,
}: {
  className?: string;
  count?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const digits = useMemo<RainDigit[]>(() => {
    return Array.from({ length: count }, () => ({
      digit: Math.floor(Math.random() * 9) + 1,
      x: `${Math.random() * 96 + 2}%`,
      size: `${Math.floor(Math.random() * 32) + 16}px`,
      delay: `${-(Math.random() * 40).toFixed(1)}s`,
      duration: `${(Math.random() * 25 + 15).toFixed(1)}s`,
    }));
  }, [count]);

  if (!mounted) return null;

  return (
    <div className={`number-rain ${className}`} aria-hidden="true">
      {digits.map((d, i) => (
        <span
          key={i}
          style={
            {
              "--rain-x": d.x,
              "--rain-size": d.size,
              "--rain-delay": d.delay,
              "--rain-duration": d.duration,
            } as React.CSSProperties
          }
        >
          {d.digit}
        </span>
      ))}
    </div>
  );
}
