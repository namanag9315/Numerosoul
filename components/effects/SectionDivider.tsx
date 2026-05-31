"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function SectionDivider({
  className = "",
  variant = "gold",
}: {
  className?: string;
  variant?: "gold" | "cream";
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const color = variant === "gold" ? "#E8A020" : "#FFF8EE";
  const dotColor = variant === "gold" ? "rgba(232,160,32,0.5)" : "rgba(255,248,238,0.5)";

  return (
    <svg
      ref={ref}
      className={`divider-ornament ${className}`}
      viewBox="0 0 320 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", maxWidth: 320, height: 24 }}
    >
      {/* Left line */}
      <motion.line
        x1="0"
        y1="12"
        x2="130"
        y2="12"
        stroke={color}
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {/* Left dot */}
      <motion.circle
        cx="132"
        cy="12"
        r="2"
        fill={dotColor}
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.6 }}
      />
      {/* Central diamond */}
      <motion.path
        d="M152 4L160 12L152 20L144 12Z"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{ transformOrigin: "152px 12px" }}
      />
      {/* Inner diamond dot */}
      <motion.circle
        cx="152"
        cy="12"
        r="2"
        fill={color}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.7 }}
      />
      {/* Central top/bottom dots */}
      <motion.circle cx="160" cy="12" r="1.5" fill={dotColor}
        initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ duration: 0.3, delay: 0.75 }} />
      <motion.circle cx="144" cy="12" r="1.5" fill={dotColor}
        initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ duration: 0.3, delay: 0.75 }} />
      {/* Right dot */}
      <motion.circle
        cx="180"
        cy="12"
        r="2"
        fill={dotColor}
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.6 }}
      />
      {/* Right line */}
      <motion.line
        x1="182"
        y1="12"
        x2="320"
        y2="12"
        stroke={color}
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}
