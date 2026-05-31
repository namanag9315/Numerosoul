import type { CSSProperties } from "react";

type MandalaPosition = "center" | "center-right" | "top-right" | "bottom-left" | "bottom-right";

const positionStyles: Record<MandalaPosition, CSSProperties> = {
  center: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
  "center-right": { right: "-4rem", top: "50%", transform: "translateY(-50%)" },
  "top-right": { right: "-2rem", top: "2rem" },
  "bottom-left": { bottom: "-3rem", left: "-3rem" },
  "bottom-right": { bottom: "-3rem", right: "-3rem" },
};

export function MandalaBg({
  className = "",
  opacity = 0.04,
  position = "center-right",
  rotationSpeed = "120s",
  size = 400,
}: {
  className?: string;
  opacity?: number;
  position?: MandalaPosition;
  rotationSpeed?: string;
  size?: number;
}) {
  return (
    <svg
      className={`pointer-events-none absolute text-[color:var(--gold)] ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      style={{
        ...positionStyles[position],
        width: size,
        height: size,
        opacity,
      }}
      aria-hidden="true"
    >
      <g className="mandala-bg-spin" style={{ animationDuration: rotationSpeed, transformOrigin: "center" }}>
        <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="36" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="12" stroke="currentColor" strokeWidth="0.8" />
        {Array.from({ length: 8 }).map((_, index) => (
          <ellipse
            key={`large-${index}`}
            cx="100"
            cy="39"
            rx="18"
            ry="39"
            transform={`rotate(${index * 45} 100 100)`}
            stroke="currentColor"
            strokeWidth="1.1"
          />
        ))}
        {Array.from({ length: 16 }).map((_, index) => (
          <ellipse
            key={`small-${index}`}
            cx="100"
            cy="58"
            rx="8"
            ry="22"
            transform={`rotate(${index * 22.5} 100 100)`}
            stroke="currentColor"
            strokeWidth="0.8"
          />
        ))}
        <path
          d="M100 18L112 82L182 100L112 118L100 182L88 118L18 100L88 82L100 18Z"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}
