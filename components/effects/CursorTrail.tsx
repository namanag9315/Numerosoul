"use client";

import { useEffect, useRef, useCallback } from "react";

export function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainDotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const positions = useRef<Array<{ x: number; y: number }>>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const rafId = useRef<number>(0);

  const TRAIL_COUNT = 12;

  const setDotRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) dotsRef.current[i] = el;
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isCoarse) return;

    document.body.style.cursor = "none";

    // Initialize positions
    positions.current = Array.from({ length: TRAIL_COUNT + 1 }, () => ({ x: -100, y: -100 }));

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role=button], input, textarea, select")) {
        isHovering.current = true;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role=button], input, textarea, select")) {
        isHovering.current = false;
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      // Update head position
      positions.current[0] = { ...mouse.current };

      // Update trail with lerp lag
      for (let i = 1; i <= TRAIL_COUNT; i++) {
        const speed = 0.15 - i * 0.008;
        positions.current[i] = {
          x: lerp(positions.current[i].x, positions.current[i - 1].x, Math.max(speed, 0.04)),
          y: lerp(positions.current[i].y, positions.current[i - 1].y, Math.max(speed, 0.04)),
        };
      }

      // Update main dot
      const main = mainDotRef.current;
      if (main) {
        const hover = isHovering.current;
        const size = hover ? 40 : 8;
        main.style.transform = `translate(${positions.current[0].x - size / 2}px, ${positions.current[0].y - size / 2}px)`;
        main.style.width = `${size}px`;
        main.style.height = `${size}px`;
        main.style.background = hover ? "transparent" : "#E8A020";
        main.style.border = hover ? "2px solid #E8A020" : "none";

        if (labelRef.current) {
          labelRef.current.style.opacity = hover ? "1" : "0";
        }
      }

      // Update trail dots
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const dot = dotsRef.current[i];
        if (!dot) continue;
        const pos = positions.current[i + 1];
        const size = Math.max(7 - i * 0.45, 2);
        const opacity = Math.max(0.7 - i * 0.055, 0.08);
        dot.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.opacity = String(opacity);
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9998] hidden md:block"
      aria-hidden="true"
    >
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => setDotRef(el, i)}
          className="cursor-trail-dot"
          style={{ position: "fixed", top: 0, left: 0 }}
        />
      ))}
      {/* Main cursor dot */}
      <div
        ref={mainDotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: 999,
          background: "#E8A020",
          boxShadow: "0 0 12px rgba(232,160,32,0.5)",
          transition: "width 200ms ease, height 200ms ease, background 200ms ease, border 200ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-numeral), serif",
            fontSize: 8,
            color: "#E8A020",
            opacity: 0,
            transition: "opacity 150ms ease",
            userSelect: "none",
          }}
        >
          tap
        </span>
      </div>
    </div>
  );
}
