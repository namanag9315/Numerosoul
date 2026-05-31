"use client";

import { useEffect, useRef } from "react";

export function StarField({
  className = "",
  starCount = 70,
  speed = 0.05,
  color = "gold",
}: {
  className?: string;
  starCount?: number;
  speed?: number; // scroll parallax speed multiplier
  color?: "white" | "gold";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = isCoarse;

    let w = 0, h = 0, dpr = 1, animId = 0;
    const count = isMobile ? Math.floor(starCount / 2) : starCount;

    // Define star properties
    const stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.8 + 0.6,
      twinkleSpeed: 0.005 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const scrollY = window.scrollY;

      const starColor = color === "gold" ? "rgba(232, 160, 32, " : "rgba(255, 255, 255, ";

      for (const s of stars) {
        // Calculate coordinate positions in pixels
        const xPx = s.x * w;
        
        // Calculate y with scroll-based parallax: move stars upward slightly on scroll down
        const initialYPx = s.y * h;
        // Parallax offset wraps around using modulo to stay within viewport height
        let yPx = (initialYPx - scrollY * speed) % h;
        if (yPx < 0) yPx += h;

        // Calculate twinkle opacity
        const opacity = 0.25 + Math.sin(Date.now() * s.twinkleSpeed + s.phase) * 0.45;

        // Draw star dot
        ctx.beginPath();
        ctx.arc(xPx, yPx, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${starColor}${opacity})`;
        ctx.fill();

        // Optional star glow for larger stars
        if (s.size > 1.4 && opacity > 0.5) {
          ctx.beginPath();
          ctx.arc(xPx, yPx, s.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${starColor}${opacity * 0.2})`;
          ctx.fill();
        }
      }

      if (!reducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    
    // Listen to scroll to force redraw on scroll if reducedMotion is active (to still show parallax)
    const handleScroll = () => {
      if (reducedMotion) {
        draw();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [starCount, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
