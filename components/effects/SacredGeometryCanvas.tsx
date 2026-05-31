"use client";

import { useEffect, useRef } from "react";

export function SacredGeometryCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noAnim = isCoarse || reducedMotion;

    let w = 0, h = 0, dpr = 1, animId = 0;
    let mouseX = 0.5, mouseY = 0.5;
    let tiltX = 0, tiltY = 0;

    const colorPurple = (a: number) => `rgba(232, 160, 32, ${a})`; // Sacred Gold (#E8A020)
    const colorOrange = (a: number) => `rgba(245, 158, 11, ${a})`; // Warm Amber (#F59E0B)
    const colorTeal = (a: number) => `rgba(251, 191, 36, ${a})`;   // Light Gold (#FBBF24)


    // Number orbits
    const numbers = Array.from({ length: 9 }, (_, i) => ({
      digit: i + 1,
      radius: 140 + Math.random() * 200,
      speed: 0.0001 + Math.random() * 0.00015,
      phase: (Math.PI * 2 * i) / 9 + Math.random() * 0.5,
      size: 14 + Math.random() * 10,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (noAnim) {
        draw(0);
      }
    };

    const drawCircle = (cx: number, cy: number, r: number, alpha: number, colorFn = colorPurple) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = colorFn(alpha);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    const drawFlowerOfLife = (cx: number, cy: number, r: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = colorTeal(alpha);
      ctx.lineWidth = 0.7;
      // Center circle
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      // 6 surrounding circles
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawTriangles = (cx: number, cy: number, size: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = colorOrange(alpha);
      ctx.lineWidth = 0.8;

      // Upward triangles
      for (let i = 0; i < 4; i++) {
        const s = size * (0.4 + i * 0.2);
        const rot = i * 0.15;
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.866, s * 0.5);
        ctx.lineTo(-s * 0.866, s * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      // Downward triangles
      for (let i = 0; i < 3; i++) {
        const s = size * (0.5 + i * 0.2);
        const rot = -i * 0.12;
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.moveTo(0, s);
        ctx.lineTo(s * 0.866, -s * 0.5);
        ctx.lineTo(-s * 0.866, -s * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    };

    const drawMetatronsCube = (cx: number, cy: number, r: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = colorPurple(alpha);
      ctx.lineWidth = 0.5;

      // 13 node positions
      const nodes: [number, number][] = [[0, 0]];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        nodes.push([Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5]);
      }
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 + Math.PI / 6;
        nodes.push([Math.cos(a) * r, Math.sin(a) * r]);
      }

      // Draw circles at nodes
      for (const [x, y] of nodes) {
        ctx.beginPath();
        ctx.arc(x, y, r * 0.12, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Connect all pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i][0], nodes[i][1]);
          ctx.lineTo(nodes[j][0], nodes[j][1]);
          ctx.globalAlpha = alpha * 0.4;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      ctx.restore();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.55;
      const cy = h * 0.5;
      const scale = Math.min(w, h) / 900;

      const t1 = noAnim ? 0 : time / 40000;
      const t2 = noAnim ? 0 : time / 80000;
      const t3 = noAnim ? 0 : time / 120000;

      // Inner: Sri Yantra triangles
      drawTriangles(cx, cy, 120 * scale, t1 * Math.PI * 2, 0.15);

      // Middle: Flower of Life
      drawFlowerOfLife(cx, cy, 70 * scale, -t2 * Math.PI * 2, 0.12);

      // Concentric circles
      drawCircle(cx, cy, 180 * scale, 0.08, colorTeal);
      drawCircle(cx, cy, 260 * scale, 0.06, colorPurple);
      drawCircle(cx, cy, 340 * scale, 0.05, colorOrange);

      // Outer: Metatron's Cube
      drawMetatronsCube(cx, cy, 300 * scale, t3 * Math.PI * 2, 0.1);

      // Floating numbers
      if (!noAnim) {
        ctx.font = `${14 * scale}px var(--font-numeral, serif)`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const num of numbers) {
          const angle = num.phase + time * num.speed;
          const x = cx + Math.cos(angle) * num.radius * scale;
          const y = cy + Math.sin(angle) * num.radius * scale;
          ctx.fillStyle = colorPurple(0.2);
          ctx.font = `${num.size * scale}px var(--font-numeral, serif)`;
          ctx.fillText(String(num.digit), x, y);
        }
      }

      if (!noAnim) {
        animId = requestAnimationFrame(draw);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (noAnim || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = () => {
      mouseX = 0.5;
      mouseY = 0.5;
    };

    // Tilt animation
    let tiltRaf = 0;
    const updateTilt = () => {
      if (noAnim || !wrap) return;
      const targetX = (mouseY - 0.5) * -8;
      const targetY = (mouseX - 0.5) * 8;
      tiltX += (targetX - tiltX) * 0.05;
      tiltY += (targetY - tiltY) * 0.05;
      wrap.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      tiltRaf = requestAnimationFrame(updateTilt);
    };

    resize();
    if (!noAnim) {
      animId = requestAnimationFrame(draw);
      tiltRaf = requestAnimationFrame(updateTilt);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(tiltRaf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 ${className}`} style={{ willChange: "transform" }}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
