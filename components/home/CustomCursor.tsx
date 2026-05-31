"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [hoverState, setHoverState] = useState<"none" | "cta" | "wheel">("none");
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Mouse coords motion values
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Main cursor springs (zero lag relative to motion value, high stiffness)
  const cx = useSpring(x, { stiffness: 600, damping: 32 });
  const cy = useSpring(y, { stiffness: 600, damping: 32 });

  // Simplified 3-dot spring chain trail
  const tx1 = useSpring(cx, { stiffness: 400, damping: 28 });
  const ty1 = useSpring(cy, { stiffness: 400, damping: 28 });

  const tx2 = useSpring(tx1, { stiffness: 340, damping: 28 });
  const ty2 = useSpring(ty1, { stiffness: 340, damping: 28 });

  const tx3 = useSpring(tx2, { stiffness: 280, damping: 28 });
  const ty3 = useSpring(ty2, { stiffness: 280, damping: 28 });

  const trail = [
    { x: tx1, y: ty1, size: 7, opacity: 0.6 },
    { x: tx2, y: ty2, size: 5.5, opacity: 0.4 },
    { x: tx3, y: ty3, size: 4, opacity: 0.2 },
  ];

  useEffect(() => {
    // Check if device is desktop
    const checkDevice = () => {
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      setIsDesktop(finePointer);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (!isDesktop) return;

    // Hide default cursor
    document.body.style.cursor = "none";
    const stylesheet = document.createElement("style");
    stylesheet.innerHTML = "* { cursor: none !important; }";
    document.head.appendChild(stylesheet);

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isCta = target.closest("a, button, [role='button'], input, textarea, select, .cta-hover");
      const isWheel = target.closest(".number-wheel-container, .number-wheel-container *");

      if (isWheel) {
        setHoverState("wheel");
      } else if (isCta) {
        setHoverState("cta");
      } else {
        setHoverState("none");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      document.body.style.cursor = "auto";
      if (document.head.contains(stylesheet)) {
        document.head.removeChild(stylesheet);
      }
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [x, y, isVisible, isDesktop]);

  if (!isDesktop || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden">
      {/* 1. Tail Dots */}
      {hoverState === "none" && trail.map((dot, idx) => (
        <motion.div
          key={`trail-${idx}`}
          style={{
            x: dot.x,
            y: dot.y,
            translateX: "-50%",
            translateY: "-50%",
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            backgroundColor: "#E8A020",
            boxShadow: "0 0 6px rgba(232, 160, 32, 0.4)",
          }}
          className="absolute rounded-full"
        />
      ))}

      {/* 2. Main Cursor Dot */}
      <motion.div
        style={{
          x: cx,
          y: cy,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hoverState === "cta" ? 40 : hoverState === "wheel" ? 45 : 8,
          height: hoverState === "cta" ? 40 : hoverState === "wheel" ? 45 : 8,
          backgroundColor: hoverState === "none" ? "#E8A020" : "rgba(232,160,32,0)",
          border: hoverState === "none" ? "none" : "2px solid #E8A020",
          boxShadow: hoverState === "none" ? "0 0 10px #E8A020" : "0 0 15px rgba(232,160,32,0.3)",
        }}
        className="absolute rounded-full flex items-center justify-center overflow-hidden"
      >
        {/* Inner text for hovers */}
        {hoverState === "cta" && (
          <span className="font-display text-[8px] font-bold text-[#E8A020] uppercase tracking-wider">
            open
          </span>
        )}
        {hoverState === "wheel" && (
          <span className="font-display text-[8px] font-bold text-[#E8A020] uppercase tracking-wider">
            rotate
          </span>
        )}
      </motion.div>
    </div>
  );
}
